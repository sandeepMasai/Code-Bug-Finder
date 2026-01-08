import React, { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({
    code,
    improvedCode,
    language,
    activeTab,
    errors,
    onCodeChange,
    onTabChange,
    height = '600px',
}) => {
    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const decorationsRef = useRef([]);

    const [currentCode, setCurrentCode] = useState(code);

    // Language options mapping
    const languageMap = {
        JavaScript: 'javascript',
        Python: 'python',
        Java: 'java',
        React: 'javascript',
        'Node.js': 'javascript',
    };

    const monacoLanguage = languageMap[language] || 'javascript';

    // Handle editor mount
    const handleEditorDidMount = (editor, monacoInstance) => {
        editorRef.current = editor;
        monacoRef.current = monacoInstance;

        // Configure Monaco theme
        monacoInstance.editor.defineTheme('dark-theme', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {
                'editor.background': '#1e1e1e',
            },
        });
        monacoInstance.editor.setTheme('dark-theme');
    };

    // Update code when tab changes
    useEffect(() => {
        if (activeTab === 'original') {
            setCurrentCode(code);
            if (editorRef.current) {
                editorRef.current.updateOptions({ readOnly: false });
            }
        } else {
            setCurrentCode(improvedCode || code);
            if (editorRef.current) {
                editorRef.current.updateOptions({ readOnly: true });
            }
        }
    }, [activeTab, code, improvedCode]);

    // Apply error decorations
    useEffect(() => {
        if (!editorRef.current || !monacoRef.current || activeTab !== 'original') {
            clearDecorations();
            return;
        }

        if (errors && errors.length > 0) {
            applyErrorDecorations();
        } else {
            clearDecorations();
        }
    }, [errors, activeTab]);

    const applyErrorDecorations = () => {
        if (!editorRef.current || !monacoRef.current || !errors) return;

        const newDecorations = errors.map((error) => {
            const line = error.line || 1;
            const startCol = 1;
            const endCol = 1000; // End of line

            // Determine decoration style based on error type
            let className = 'error-underline-bug';
            if (error.type === 'spelling') {
                className = 'error-underline-spelling';
            } else if (error.type === 'warning') {
                className = 'error-underline-warning';
            }

            return {
                range: new monacoRef.current.Range(line, startCol, line, endCol),
                options: {
                    inlineClassName: className,
                    hoverMessage: {
                        value: `[${error.type.toUpperCase()}] ${error.message}${error.suggestion ? `\n\nSuggestion: ${error.suggestion}` : ''}`,
                    },
                    glyphMarginClassName: 'error-glyph',
                },
            };
        });

        decorationsRef.current = editorRef.current.deltaDecorations(
            decorationsRef.current,
            newDecorations
        );
    };

    const clearDecorations = () => {
        if (editorRef.current && decorationsRef.current.length > 0) {
            editorRef.current.deltaDecorations(decorationsRef.current, []);
            decorationsRef.current = [];
        }
    };

    const handleCodeChange = (value) => {
        setCurrentCode(value || '');
        if (activeTab === 'original') {
            onCodeChange(value || '');
        }
    };

    return (
        <div className="h-full flex flex-col">
            <Editor
                height={height}
                language={monacoLanguage}
                value={currentCode}
                theme="dark-theme"
                onChange={handleCodeChange}
                onMount={handleEditorDidMount}
                options={{
                    minimap: { enabled: true },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    readOnly: activeTab === 'improved',
                    wordWrap: 'on',
                    formatOnPaste: true,
                    formatOnType: true,
                }}
            />
        </div>
    );
};

export default CodeEditor;

