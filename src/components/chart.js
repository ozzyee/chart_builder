import {createChart, ColorType} from 'lightweight-charts';
import React, {useEffect, useRef, useState} from 'react';
import data from "./data.json"

export const ChartComponent = props => {
    const {
        data,
        code,
        colors: {
            backgroundColor = 'white',
            lineColor = '#2962FF',
            textColor = 'black',
            areaTopColor = '#2962FF',
            areaBottomColor = 'rgba(41, 98, 255, 0.28)',
        } = {},
    } = props;

    const chartContainerRef = useRef();

    useEffect(
        () => {
            console.log(code)
            const handleResize = () => {
                chart.applyOptions({width: chartContainerRef.current.clientWidth});
            };

            const chart = createChart(chartContainerRef.current, {
                layout: {
                    background: {type: ColorType.Solid, color: backgroundColor},
                    textColor,
                },
                width: chartContainerRef.current.clientWidth,
                height: 300,
                ...code.chartOptions
            });
            chart.timeScale().fitContent();

            const newSeries = chart.addAreaSeries(code.areaSeriesOptions);
            newSeries.setData(data);

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);

                chart.remove();
            };
        },
        [data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor, code]
    );

    return (
        <div
            ref={chartContainerRef}
        />
    );
};

export function Chart(props) {
    const [code, setCode] = useState({});

    useEffect(() => {
        try {
            setCode(JSON.parse(props.code))
        } catch (error) {
            console.log(error)
        }
    }, [props.code]);

    return (
        <ChartComponent {...props} data={data} code={code}></ChartComponent>
    );
}