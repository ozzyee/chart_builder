"use client"
import {useEffect, useState} from "react";
import ControlledEditor from '@monaco-editor/react';
import jsonStringify from 'json-stable-stringify';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// eslint-disable-next-line react/prop-types
export const Editor = ({code, onChange}) => {
    const [_code, setCode] = useState("")
    const [_showDocs, setShowDocs] = useState(false)

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

    const _formatCode = async () => {
        setCode("")

        setTimeout(() => {
            const formatted = formatCode(code)
            setCode(formatted)
            saveCode()
        }, 50)
    }

    const showDocs = () => {
        setShowDocs(!_showDocs)
    }

    useEffect(() => {
        if (!code) return

        try {
            setCode(formatCode(code))
        } catch (error) {
        }
    }, [code])

    return (
        <div className={"ide-container"}>
            <div>
                <ToastContainer/>
            </div>
            <div className={"editor-btn-wrapper"}>
                <button onClick={saveCode}>Save Code</button>
                <button onClick={_formatCode}>Format Code</button>
                <button onClick={showDocs}>{_showDocs ? "Hide" : "Show"} Chart Docs</button>
                <a href={"https://tradingview.github.io/lightweight-charts/docs"} target="_blank">docs url</a>
            </div>
            <ControlledEditor
                height="60vh"
                width={!_showDocs ? "100vw" : "50vw"}
                language="json"
                theme="vs-dark"
                value={_code}
                onChange={(ev) => {
                    onChange(ev);
                }}
                formatOnPaste={true}
                formatOnType={true}
            />

            {
                _showDocs && (
                    <div className={"chart-docs"}>
                        <iframe src="https://tradingview.github.io/lightweight-charts/docs" width={900} height={"auto"}></iframe>
                    </div>
                )
            }
        </div>
    )
}

const formatCode = (code) => {
    return jsonStringify(JSON.parse(code), {space: 2})
}