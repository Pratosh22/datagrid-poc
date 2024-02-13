/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
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
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const newChartData = [];
        const counts = Array.from({length: 11}, () => 0); // Initialize an array of zeros with length 11 (for scale 0-10)
    
        Object.keys(data).forEach(key => {
            data[key].forEach(response => {
                counts[Number(response.value)]++;
            });
        });
    
        counts.forEach((value, index) => {
            newChartData.push({
                name: index.toString(),
                value: value
            });
        });
    
        setChartData(newChartData);
    }, [data]);

    console.log(chartData, "chartData");
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
                        <Line type="monotone" dataKey="value" stroke="#8884d8" />
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                    </LineChart>    
                )}
                {selectedChartType.type === "barchart" && (
                    <>
                        <BarChart width={550} height={300} data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#82ca9d" />
                        </BarChart>
                    </>
                )}
                {selectedChartType.type === "piechart" && (
                    <>
                        <PieChart width={730} height={250}>
                            <Pie data={chartData} dataKey="value" nameKey="name" fill="#8884d8" />
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