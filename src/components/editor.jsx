"use client"
import {useEffect, useState, useRef} from "react";
import ControlledEditor from '@monaco-editor/react';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const links = {
    "": "https://tradingview.github.io/lightweight-charts/docs",
    "chartOptions": "https://tradingview.github.io/lightweight-charts/docs/api/interfaces/ChartOptions",
    "layout": "https://tradingview.github.io/lightweight-charts/docs/api/interfaces/LayoutOptions",
    "background": "https://tradingview.github.io/lightweight-charts/docs/time-zones#background",
    "rightPriceScale": "https://tradingview.github.io/lightweight-charts/docs/api/interfaces/ChartOptions#rightpricescale",
    "leftPriceScale": "https://tradingview.github.io/lightweight-charts/docs/api/interfaces/ChartOptions#leftpricescale",
    "grid": "https://tradingview.github.io/lightweight-charts/docs/api/interfaces/GridOptions",
    "horzLines": "https://tradingview.github.io/lightweight-charts/docs/api/interfaces/GridOptions#horzlines",
    "vertLines": "https://tradingview.github.io/lightweight-charts/docs/api/interfaces/GridOptions#vertlines",
    "timeScale": "https://tradingview.github.io/lightweight-charts/docs/api/interfaces/TimeScaleOptions",
    "handleScale": "https://tradingview.github.io/lightweight-charts/docs/api/interfaces/HandleScaleOptions",
    "keneticScroll": "https://tradingview.github.io/lightweight-charts/docs/api/interfaces/KineticScrollOptions",
    "crosshair": "https://tradingview.github.io/lightweight-charts/tutorials/customization/crosshair",
    "vertLine": "https://tradingview.github.io/lightweight-charts/docs/api/interfaces/CrosshairOptions#vertline",
    "localization": "https://tradingview.github.io/lightweight-charts/docs/api/interfaces/LocalizationOptions",
    "areaSeriesOptions": "https://tradingview.github.io/lightweight-charts/docs/api#areaseriesoptions",
    "lineColor": "https://tradingview.github.io/lightweight-charts/docs/api/interfaces/AreaData#linecolor",
    "topColor": "https://tradingview.github.io/lightweight-charts/docs/api/interfaces/AreaStyleOptions#topcolor",
    "bottomColor": "https://tradingview.github.io/lightweight-charts/docs/api/interfaces/AreaStyleOptions#bottomcolor",
    "locale": "https://tradingview.github.io/lightweight-charts/docs/api/interfaces/LocalizationOptions#locale",
    "dateFormat": "https://tradingview.github.io/lightweight-charts/docs/api/interfaces/LocalizationOptions#dateformat",
    "horzLine": "https://tradingview.github.io/lightweight-charts/docs/api/interfaces/CrosshairOptions#horzline",
    "visible": "https://tradingview.github.io/lightweight-charts/docs/api/interfaces/WatermarkOptions#visible",
    "color": "https://tradingview.github.io/lightweight-charts/docs/api/interfaces/WatermarkOptions#color",
    "type": "https://tradingview.github.io/lightweight-charts/docs/api#type-aliases",
    "width": "https://tradingview.github.io/lightweight-charts/docs/api/interfaces/ChartOptions#width",
    "labelVisible": "https://tradingview.github.io/lightweight-charts/docs/api/interfaces/CrosshairLineOptions#labelvisible"
}


// eslint-disable-next-line react/prop-types
export const Editor = ({code, onChange}) => {
    const [_showDocs, setShowDocs] = useState(false)
    const editorRef = useRef(null);
    const [searchLink, setSearchLink] = useState("https://tradingview.github.io/lightweight-charts/docs")

    useEffect(() => {
        const handleKeyBinding = (event) => {
            if (event.metaKey && event.key === 's') {
                event.preventDefault();
                saveCode().then(() => {
                })
            }
        };

        document.addEventListener('keydown', handleKeyBinding);

        return () => {
            document.removeEventListener('keydown', handleKeyBinding);
        };
    }, [code]);


    const saveCode = async () => {
        try {
            JSON.parse(code)

            await fetch('api/config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    value: code
                })
            })

            toast.success('Saved!', {
                autoClose: 2000
            });
        } catch (e) {
            toast.error('Error, could not save, Check your code!');
        }
    }

    const showDocs = () => {
        setShowDocs(!_showDocs)
    }


    useEffect(() => {
        const handleClick = (ev) => {
            if (editorRef.current) {
                const editor = editorRef.current;
                const model = editor.getModel();
                const position = editor.getPosition();
                const lineContent = model.getLineContent(position.lineNumber);
                const keyPair = lineContent.split(":")
                const searchParam = keyPair[0].replace(/"/g, '').trim()

                if (!links[searchParam]) {
                    setSearchLink("https://tradingview.github.io/lightweight-charts/docs")
                    return;
                }

                setSearchLink(links[searchParam])
            }
        };

        document.addEventListener('click', handleClick);
        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [])


    function getIFrameLink(event) {
        const iframe = document.getElementById('window-docs');
        const iframeLink = iframe.src;

        window.open(iframeLink, '_blank');
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
                {_showDocs && (
                    <button
                        style={{
                            position: "absolute",
                            right: 20,
                        }}
                        onClick={getIFrameLink}
                    >Open in a new tab</button>
                )}
            </div>
            <ControlledEditor
                height="60vh"
                width={!_showDocs ? "100vw" : "50vw"}
                language="json"
                theme="vs-dark"
                value={code}
                onChange={(ev) => {
                    console.log("change")
                    onChange(ev)
                }}
                formatOnPaste={true}
                formatOnType={true}
                onMount={(editor) => {
                    editorRef.current = editor;
                }}
            />

            {
                _showDocs && (
                    <div className={"chart-docs"}>
                        <iframe id={"window-docs"} src={searchLink} width={900} onChange={e => console.log(e)}
                                height={"auto"}></iframe>
                    </div>
                )
            }
        </div>
    )
}