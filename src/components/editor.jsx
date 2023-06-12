"use client"
import ControlledEditor from '@monaco-editor/react';

// eslint-disable-next-line react/prop-types
export const Editor = ({code, setCode}) => {

    return (
        <>
            <ControlledEditor
                height="400px"
                language="json"
                theme="vs-dark"
                value={code}
                onChange={setCode}
            />
        </>
    )
}