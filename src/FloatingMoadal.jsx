/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, BarChart,Bar, Tooltip, PieChart, Pie} from 'recharts';
import './FloatingModal.css';
const chartTypes = [
    { type: 'barchart', label: 'Bar Chart' },
    { type: 'linechart', label: 'Line Chart' },
    { type: 'piechart', label: 'Pie Chart' },
    { type: 'wordcloud', label: 'Word cloud' },
];

function FloatingModal({ chartType, data, onClose }) {
    const selectedChartType = chartTypes.find((type) => type.type === chartType);
    console.log(data);
    console.log(selectedChartType, "selectedChartType");
    const chartData = data.map((val, idx) => {
        return {
            name: idx,
            response: parseInt(val),
        };
    });
    return (
        <div className="chart-modal">
            <div className="chart-title-bar">
                <h2>{selectedChartType.label}</h2>
                <i className="fa-solid fa-xmark fa-lg" onClick={()=>{
                    onClose();
                }}></i>
            </div>
            <div className="chart-container">
                { selectedChartType.type === "linechart" && (
                    <LineChart width={550} height={300} data={chartData}>
                        <Line type="monotone" dataKey="response" stroke="#8884d8" />
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                    </LineChart>
                )}
                {selectedChartType.type === "barchart" && (
                    <>
                        <BarChart width={550} height={300} data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="rating" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#82ca9d" />
                        </BarChart>
                    </>
                )}
                {selectedChartType.type === "piechart" && (
                    <>
                        <PieChart width={730} height={250}>
                            <Pie data={data} dataKey="count" nameKey="rating" fill="#8884d8" />
                            <Tooltip />
                        </PieChart>
                    </>
                )}
                {/* {selectedChartType.type === "wordcloud" && (
                    <>
                        <ReactWordcloud
                            words={[...new Set(values)].map((value) => {
                                return {
                                    text: value,
                                    value: worldCloudOccurences[value],
                                };
                            })}
                        />
                    </>
                )} */}
            </div>
        </div>
    );
}

export default FloatingModal;