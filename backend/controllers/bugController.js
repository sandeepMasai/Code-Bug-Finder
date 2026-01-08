import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const findBugs = async (req, res) => {
  try {
    const { code, language, preference } = req.body;

    // Validate required fields
    if (!code || !language) {
      return res.status(400).json({
        error: 'Missing required fields: code and language are required',
      });
    }

    // Default preference to 'Simple' if not provided
    const codePreference = preference || 'Simple';

    // Map preference to detailed description
    const preferenceDescriptions = {
      Simple: 'Beginner-friendly, easy to understand, clear and readable',
      Optimized: 'Performance-focused, efficient, optimized for speed and memory',
      'Best Practices': 'Industry standards, maintainable, follows best practices and conventions',
    };

    const preferenceDescription = preferenceDescriptions[codePreference] || preferenceDescriptions.Simple;

    // Construct the AI prompt
    const prompt = `Analyze the following ${language} code.

Tasks:
1. Find syntax and logical bugs
2. Find spelling mistakes in variable names, comments, and strings
3. Improve code based on preference: ${codePreference}
   - ${preferenceDescription}
4. Provide improved code

Return JSON with this exact structure:
{
  "errors": [
    {
      "line": <line_number>,
      "type": "bug|spelling|warning",
      "message": "<error_description>",
      "suggestion": "<optional_suggestion>"
    }
  ],
  "improvedCode": "<complete_improved_code>",
  "explanation": "<detailed_explanation>"
}

Code:
${code}`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a senior software engineer expert in code analysis and debugging. Always return valid JSON in the exact format specified.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    // Extract the response
    const responseContent = completion.choices[0].message.content;

    // Parse JSON response
    let result;
    try {
      result = JSON.parse(responseContent);
    } catch (parseError) {
      // If JSON parsing fails, try to extract JSON from markdown code blocks
      const jsonMatch = responseContent.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('Failed to parse AI response as JSON');
      }
    }

    // Validate response structure
    if (!result.errors || !Array.isArray(result.errors)) {
      result.errors = [];
    }
    if (!result.improvedCode) {
      result.improvedCode = code;
    }
    if (!result.explanation) {
      result.explanation = 'No explanation provided.';
    }

    // Return structured response
    res.json({
      success: true,
      errors: result.errors,
      improvedCode: result.improvedCode,
      explanation: result.explanation,
    });
  } catch (error) {
    console.error('Error in findBugs:', error);

    // Handle OpenAI API errors
    if (error instanceof OpenAI.APIError) {
      return res.status(500).json({
        error: 'OpenAI API error',
        message: error.message,
      });
    }

    // Handle other errors
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
};

export { findBugs };

