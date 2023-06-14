"use client"
import {useEffect, useState} from "react";
import ControlledEditor from '@monaco-editor/react';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// eslint-disable-next-line react/prop-types
export const Editor = ({code, onChange}) => {
    const [_showDocs, setShowDocs] = useState(false)

    useEffect(() => {
        const handleKeyBinding = (event) => {
            if (event.metaKey && event.key === 's') {
                event.preventDefault();
                saveCode().then(() => {})
            }
        };

        document.addEventListener('keydown', handleKeyBinding);

        return () => {
            document.removeEventListener('keydown', handleKeyBinding);
        };
    }, []);


    const saveCode = async () => {
        try {
            const infoNotification = toast.info('Saving...');
            await fetch('api/config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    value: code
                })
            })

            toast.dismiss(infoNotification);
            toast.success('Saved!', {
                autoClose: 2000
            });
        } catch (e) {
            toast.error('Error, could not save!');
        }
    }

    const showDocs = () => {
        setShowDocs(!_showDocs)
    }


    return (
        <div className={"ide-container"}>
            <div>
                <ToastContainer/>
            </div>
            <div className={"editor-btn-wrapper"}>
                <button onClick={saveCode}>Save Code</button>
                <button onClick={showDocs}>{_showDocs ? "Hide" : "Show"} Chart Docs</button>
                <a href={"https://tradingview.github.io/lightweight-charts/docs"} target="_blank">docs url</a>
            </div>
            <ControlledEditor
                height="60vh"
                width={!_showDocs ? "100vw" : "50vw"}
                language="json"
                theme="vs-dark"
                value={code}
                onChange={(ev) => {
                    onChange(ev)
                }}
                formatOnPaste={true}
                formatOnType={true}
            />

            {
                _showDocs && (
                    <div className={"chart-docs"}>
                        <iframe src="https://tradingview.github.io/lightweight-charts/docs" width={900}
                                height={"auto"}></iframe>
                    </div>
                )
            }
        </div>
    )
}