"use client"
import {useEffect} from "react";
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api.js';
import ControlledEditor from '@monaco-editor/react';


// eslint-disable-next-line react/prop-types
export const Editor = ({code, setCode}) => {

    const registerJavaScriptLanguage = () => {
        monacoEditor.languages.register({id: 'javascript'});
        monacoEditor.languages.setMonarchTokensProvider('javascript', {
            tokenizer: {
                root: [
                    // Add your syntax highlighting rules here
                    [/\b(if|else|while|for|function)\b/, 'keyword'],
                    [/\b(const|let|var)\b/, 'declaration'],
                    [/\b(true|false|null|undefined)\b/, 'constant'],
                    [/\b[A-Z][A-Za-z0-9_]*\b/, 'type'],
                ],
            },
        });
    };

    useEffect(() => {
        registerJavaScriptLanguage();
    }, []);

    return (
        <>
            <ControlledEditor
                height="400px"
                language="javascript"
                theme="vs-dark"
                value={code}
                onChange={setCode}
            />
        </>
    )
}