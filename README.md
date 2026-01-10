# AI Code Bug Finder

An AI-powered full-stack application that analyzes code for bugs, spelling mistakes, and provides intelligent improvements based on user preferences. Built with React, Node.js, Express, and OpenAI API.

## Features

- **AI-Powered Bug Detection**: Automatically finds syntax and logical errors in your code
- **Spelling Checker**: Detects spelling mistakes in variable names, comments, and strings
- **Line-by-Line Error Highlighting**: Visual error indicators with red underlines and hover tooltips
- **Code Improvement**: Get AI-enhanced code based on your preference:
  - **Simple Code**: Beginner-friendly, easy to understand
  - **Optimized Code**: Performance-focused, efficient
  - **Best Practices**: Industry standards, maintainable
- **Dual Code View**: Switch between Original and Improved code tabs
- **Multi-Language Support**: JavaScript, Python, Java, React, Node.js
- **VS Code-like Editor**: Monaco Editor with syntax highlighting
- **Real-time Analysis**: Dynamic updates when preferences change
- **Rate Limiting**: Built-in protection to control API costs

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Monaco Editor (VS Code editor)
- Axios

### Backend
- Node.js
- Express.js
- OpenAI API (gpt-4o-mini)
- Express Rate Limit

## Project Structure

```
Code-Bug-Finder/
├── backend/
│   ├── server.js                 # Express server
│   ├── routes/
│   │   └── bugRoutes.js          # API routes
│   ├── controllers/
│   │   └── bugController.js      # OpenAI integration
│   ├── middleware/
│   │   └── rateLimiter.js        # Rate limiting
│   ├── .env.example              # Environment template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CodeEditor.jsx    # Monaco editor component
│   │   │   ├── ResultPanel.jsx   # Results display
│   │   │   ├── PreferenceSelector.jsx
│   │   │   └── CodeTabs.jsx
│   │   ├── pages/
│   │   │   └── Home.jsx          # Main page
│   │   ├── utils/
│   │   │   └── spellingChecker.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   PORT=5000
   ```

5. Start the backend server:
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example` if available):
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` and configure the API base URL:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
   
   **Note:** In Vite, environment variables must be prefixed with `VITE_` to be accessible in the frontend code.

5. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

## Usage

1. **Select Language**: Choose your programming language from the dropdown (JavaScript, Python, Java, React, or Node.js)

2. **Paste Code**: Enter or paste your code into the editor

3. **Choose Preference**: Select your improvement style:
   - **Simple**: For beginners, easy to understand
   - **Optimized**: Performance-focused improvements
   - **Best Practices**: Industry-standard code

4. **Find Bugs**: Click the "Find Bugs" button to analyze your code

5. **View Results**: 
   - See errors highlighted in the editor with red underlines
   - Hover over errors to see detailed messages
   - View explanations and improved code in the right panel
   - Switch between "Original Code" and "Improved Code" tabs

6. **Copy Improved Code**: Click "Copy Code" button to copy the improved version

## API Endpoints

### POST `/api/bugs/find-bugs`

Analyzes code and returns bugs, improvements, and explanations.

**Request Body:**
```json
{
  "code": "function hello() {\n  console.log('Hello World')\n}",
  "language": "JavaScript",
  "preference": "Simple"
}
```

**Response:**
```json
{
  "success": true,
  "errors": [
    {
      "line": 2,
      "type": "bug",
      "message": "Missing semicolon",
      "suggestion": "Add semicolon at end of line"
    }
  ],
  "improvedCode": "function hello() {\n  console.log('Hello World');\n}",
  "explanation": "Added missing semicolon for proper JavaScript syntax."
}
```

**Rate Limit**: 10 requests per 15 minutes per IP address

## Error Types

- **bug**: Syntax or logical errors
- **spelling**: Spelling mistakes in variables, comments, or strings
- **warning**: Code quality warnings and best practice suggestions

## Development

### Backend Development

The backend uses ES modules. Make sure your `package.json` has `"type": "module"`.

### Frontend Development

The frontend uses Vite for fast development. Hot module replacement is enabled.

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`

**Backend:**
The backend can be run directly with Node.js:
```bash
cd backend
npm start
```

## Environment Variables

### Backend (.env)

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string (default: mongodb://localhost:27017/code-bug-finder)
- `JWT_SECRET`: Secret key for JWT tokens (required for authentication)

### Frontend (.env)

- `VITE_API_BASE_URL`: Backend API base URL (default: http://localhost:5000/api)
  
  **Important:** In Vite, all environment variables must be prefixed with `VITE_` to be accessible in the frontend code.

## Troubleshooting

### Backend won't start
- Check that your `.env` file exists and has a valid `OPENAI_API_KEY`
- Ensure port 5000 is not already in use
- Verify all dependencies are installed: `npm install`

### Frontend won't connect to backend
- Ensure the backend server is running on port 5000
- Check that CORS is enabled in the backend
- Verify the API URL in `Home.jsx` matches your backend URL

### Rate limit errors
- The API is rate-limited to 10 requests per 15 minutes per IP
- Wait 15 minutes or modify the rate limit in `backend/middleware/rateLimiter.js`

### Monaco Editor not loading
- Clear browser cache
- Check browser console for errors
- Ensure `@monaco-editor/react` is installed

## Future Enhancements

- [ ] Side-by-side diff view with Monaco Diff Editor
- [ ] Code execution in sandbox (Docker)
- [ ] Security vulnerability detection
- [ ] Performance optimization suggestions
- [ ] GitHub repository analysis
- [ ] CI/CD integration
- [ ] User authentication and history
- [ ] Export results as PDF/JSON

