// Spelling checker utility
// This is a basic implementation - in production, you might want to use a proper dictionary API

// Common programming keywords to exclude
const KEYWORDS = new Set([
  // JavaScript keywords
  'var', 'let', 'const', 'function', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'return', 'try', 'catch', 'finally', 'throw', 'new', 'this', 'class', 'extends', 'super', 'import', 'export', 'default', 'async', 'await', 'promise', 'then', 'catch',
  // Python keywords
  'def', 'class', 'if', 'elif', 'else', 'for', 'while', 'try', 'except', 'finally', 'with', 'as', 'import', 'from', 'return', 'yield', 'lambda', 'pass', 'break', 'continue', 'raise', 'assert', 'global', 'nonlocal', 'True', 'False', 'None',
  // Java keywords
  'public', 'private', 'protected', 'static', 'final', 'class', 'interface', 'extends', 'implements', 'void', 'int', 'String', 'boolean', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'return', 'try', 'catch', 'finally', 'throw', 'new', 'this', 'super',
  // Common words
  'the', 'is', 'and', 'or', 'not', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'an', 'a',
]);

// Common variable name patterns
const VARIABLE_PATTERNS = {
  camelCase: /^[a-z][a-zA-Z0-9]*$/,
  PascalCase: /^[A-Z][a-zA-Z0-9]*$/,
  snake_case: /^[a-z][a-z0-9_]*$/,
  UPPER_SNAKE: /^[A-Z][A-Z0-9_]*$/,
};

// Basic dictionary of common words (in production, use a proper dictionary)
const COMMON_WORDS = new Set([
  'user', 'data', 'item', 'list', 'array', 'object', 'string', 'number', 'boolean', 'value', 'key', 'index', 'count', 'length', 'size', 'name', 'id', 'type', 'status', 'error', 'message', 'result', 'response', 'request', 'config', 'option', 'setting', 'function', 'method', 'class', 'component', 'element', 'node', 'parent', 'child', 'root', 'path', 'file', 'dir', 'folder', 'url', 'link', 'button', 'input', 'form', 'field', 'label', 'text', 'title', 'header', 'footer', 'content', 'body', 'style', 'class', 'id', 'src', 'href', 'alt', 'width', 'height', 'color', 'background', 'border', 'margin', 'padding', 'display', 'flex', 'grid', 'position', 'top', 'left', 'right', 'bottom', 'center', 'middle', 'start', 'end', 'begin', 'beginning', 'end', 'first', 'last', 'next', 'prev', 'previous', 'current', 'selected', 'active', 'disabled', 'enabled', 'visible', 'hidden', 'show', 'hide', 'open', 'close', 'toggle', 'add', 'remove', 'delete', 'update', 'edit', 'save', 'load', 'fetch', 'get', 'set', 'create', 'new', 'old', 'default', 'custom', 'main', 'primary', 'secondary', 'success', 'warning', 'danger', 'info', 'light', 'dark', 'theme', 'mode', 'day', 'night', 'time', 'date', 'year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond', 'timestamp', 'now', 'today', 'yesterday', 'tomorrow', 'week', 'month', 'year', 'age', 'old', 'new', 'fresh', 'recent', 'latest', 'earliest', 'first', 'last', 'next', 'previous', 'current', 'selected', 'active', 'inactive', 'enabled', 'disabled', 'visible', 'hidden', 'shown', 'displayed', 'rendered', 'mounted', 'unmounted', 'created', 'destroyed', 'initialized', 'loaded', 'ready', 'complete', 'finished', 'done', 'success', 'failure', 'error', 'warning', 'info', 'debug', 'log', 'trace', 'warn', 'info', 'error', 'fatal', 'critical', 'severe', 'minor', 'major', 'important', 'urgent', 'priority', 'high', 'medium', 'low', 'normal', 'abnormal', 'regular', 'irregular', 'standard', 'non-standard', 'custom', 'default', 'optional', 'required', 'mandatory', 'necessary', 'sufficient', 'enough', 'adequate', 'inadequate', 'insufficient', 'excessive', 'too', 'much', 'many', 'few', 'little', 'some', 'any', 'all', 'every', 'each', 'both', 'either', 'neither', 'none', 'no', 'yes', 'true', 'false', 'maybe', 'perhaps', 'possibly', 'probably', 'likely', 'unlikely', 'certain', 'uncertain', 'sure', 'unsure', 'definite', 'indefinite', 'clear', 'unclear', 'obvious', 'obscure', 'evident', 'hidden', 'visible', 'invisible', 'transparent', 'opaque', 'solid', 'liquid', 'gas', 'plasma', 'matter', 'energy', 'force', 'power', 'strength', 'weakness', 'ability', 'capability', 'capacity', 'potential', 'actual', 'real', 'virtual', 'physical', 'digital', 'electronic', 'electric', 'magnetic', 'mechanical', 'automatic', 'manual', 'automatic', 'manual', 'human', 'machine', 'robot', 'artificial', 'natural', 'synthetic', 'organic', 'inorganic', 'biological', 'chemical', 'physical', 'mental', 'emotional', 'spiritual', 'intellectual', 'rational', 'irrational', 'logical', 'illogical', 'reasonable', 'unreasonable', 'sensible', 'nonsensical', 'meaningful', 'meaningless', 'significant', 'insignificant', 'important', 'unimportant', 'relevant', 'irrelevant', 'related', 'unrelated', 'connected', 'disconnected', 'linked', 'unlinked', 'attached', 'detached', 'joined', 'separated', 'combined', 'divided', 'merged', 'split', 'united', 'divided', 'together', 'apart', 'close', 'far', 'near', 'distant', 'remote', 'local', 'global', 'universal', 'specific', 'general', 'particular', 'common', 'uncommon', 'rare', 'frequent', 'occasional', 'regular', 'irregular', 'constant', 'variable', 'fixed', 'flexible', 'rigid', 'soft', 'hard', 'solid', 'liquid', 'gas', 'plasma', 'matter', 'energy', 'force', 'power', 'strength', 'weakness', 'ability', 'capability', 'capacity', 'potential', 'actual', 'real', 'virtual', 'physical', 'digital', 'electronic', 'electric', 'magnetic', 'mechanical', 'automatic', 'manual', 'human', 'machine', 'robot', 'artificial', 'natural', 'synthetic', 'organic', 'inorganic', 'biological', 'chemical', 'physical', 'mental', 'emotional', 'spiritual', 'intellectual', 'rational', 'irrational', 'logical', 'illogical', 'reasonable', 'unreasonable', 'sensible', 'nonsensical', 'meaningful', 'meaningless', 'significant', 'insignificant', 'important', 'unimportant', 'relevant', 'irrelevant', 'related', 'unrelated', 'connected', 'disconnected', 'linked', 'unlinked', 'attached', 'detached', 'joined', 'separated', 'combined', 'divided', 'merged', 'split', 'united', 'divided', 'together', 'apart', 'close', 'far', 'near', 'distant', 'remote', 'local', 'global', 'universal', 'specific', 'general', 'particular', 'common', 'uncommon', 'rare', 'frequent', 'occasional', 'regular', 'irregular', 'constant', 'variable', 'fixed', 'flexible', 'rigid', 'soft', 'hard',
]);

// Simple word checker - checks if a word is likely misspelled
// This is a basic implementation. In production, use a proper spell-checking library
const isLikelyMisspelled = (word) => {
  // Remove numbers and special characters for checking
  const cleanWord = word.replace(/[0-9_$]/g, '').toLowerCase();

  // Skip if too short
  if (cleanWord.length < 3) return false;

  // Skip if it's a keyword
  if (KEYWORDS.has(cleanWord)) return false;

  // Skip if it's a common word
  if (COMMON_WORDS.has(cleanWord)) return false;

  // Skip if it matches common variable patterns (likely intentional)
  for (const pattern of Object.values(VARIABLE_PATTERNS)) {
    if (pattern.test(word)) {
      // If it matches a pattern, it's likely intentional (like camelCase)
      return false;
    }
  }

  // Very basic heuristic: if word has unusual character patterns, might be misspelled
  // This is a placeholder - real implementation would use a dictionary
  return false; // For now, we rely on AI to detect spelling errors
};

// Extract words from code for spelling checking
export const extractWordsForSpellingCheck = (code, language) => {
  const words = [];
  const lines = code.split('\n');

  lines.forEach((line, lineIndex) => {
    // Extract variable names (basic regex)
    const variableMatches = line.matchAll(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g);
    for (const match of variableMatches) {
      const word = match[1];
      if (word && !KEYWORDS.has(word.toLowerCase())) {
        words.push({
          word,
          line: lineIndex + 1,
          column: match.index + 1,
          type: 'variable',
        });
      }
    }

    // Extract comments
    const commentRegex = language === 'Python' ? /#\s*(.+)/ : /\/\/\s*(.+)/;
    const commentMatch = line.match(commentRegex);
    if (commentMatch) {
      const commentText = commentMatch[1];
      const commentWords = commentText.match(/\b([a-zA-Z]+)\b/g) || [];
      commentWords.forEach((word) => {
        if (word.length > 2 && !KEYWORDS.has(word.toLowerCase())) {
          words.push({
            word,
            line: lineIndex + 1,
            column: (commentMatch.index || 0) + 1,
            type: 'comment',
          });
        }
      });
    }

    // Extract strings (basic)
    const stringRegex = /["']([^"']+)["']/g;
    let stringMatch;
    while ((stringMatch = stringRegex.exec(line)) !== null) {
      const stringText = stringMatch[1];
      const stringWords = stringText.match(/\b([a-zA-Z]+)\b/g) || [];
      stringWords.forEach((word) => {
        if (word.length > 2 && !KEYWORDS.has(word.toLowerCase())) {
          words.push({
            word,
            line: lineIndex + 1,
            column: (stringMatch.index || 0) + 1,
            type: 'string',
          });
        }
      });
    }
  });

  return words;
};

// Check spelling (placeholder - AI will do the actual checking)
export const checkSpelling = (code, language) => {
  // This is a placeholder function
  // The actual spelling checking is done by the AI in the backend
  // This utility can be extended with a proper dictionary API if needed
  return [];
};

export default {
  extractWordsForSpellingCheck,
  checkSpelling,
  isLikelyMisspelled,
};

