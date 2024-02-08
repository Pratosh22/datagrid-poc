/* eslint-disable react/prop-types */
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogDescription,
    DialogContent,
    Text,
} from "@sparrowengg/twigs-react";
import { CloseSVG, BarChartSVG, WordCloudSVG, LineChartSVG, PieChartSVG, BackSVG } from './assets/SVG';
import { useEffect, useState } from "react";
import Select from 'react-select';
import './CreateChartModal.css';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, BarChart,Bar, Tooltip, PieChart, Pie} from 'recharts';
import ReactWordcloud from 'react-wordcloud';

const chartTypeScreen = {
    CHOOSE_CHART: 'chooseChart',
    CHOOSE_QUESTION: 'chooseQuestion',
    VIEW_CHART: 'viewChart'
 };

const chartTypes = [
  { type: 'barchart', Component: BarChartSVG, label: 'Bar Chart' },
  { type: 'linechart', Component: LineChartSVG, label: 'Line Chart' },
  { type: 'piechart', Component: PieChartSVG, label: 'Pie Chart' },
  { type: 'wordcloud', Component: WordCloudSVG, label: 'Word cloud' },
];

function ChartTypeOption({ type, Component, label, onSelect }) {
  return (
    <Box onClick={() => onSelect(type)} size="md" css={{
      color:"$secondary",
      border: "1px solid #EDEDED",
      padding:"$5"
    }}>
      <Component />
      <Text size='md'>{label}</Text>
    </Box>
  );
}

function CreateChartModal({ onClose, open, selectedRowsData, columnDefs }) {
 const [screen, setScreen] = useState(chartTypeScreen.CHOOSE_CHART);
 const [selectedChart, setSelectedChart] = useState(null);
 const [selectedOption, setSelectedOption] = useState(null);
 const [validColumns, setValidColumns] = useState([]);



  const handleChartTypeSelect = (type) => {
    setSelectedChart(type);
    setScreen(chartTypeScreen.CHOOSE_QUESTION);
  }

  useEffect(() => {
      //unmount
      return () => {
          setSelectedChart(null);
          setScreen(chartTypeScreen.CHOOSE_CHART);
      };
  }, [open]);


  const getQuestions = () => {
    const validColumn = columnDefs.filter((column) => column.question_type === "OpinionScale" || column.question_type === "Rating");
    setValidColumns(validColumn);
  }

  useEffect(() => {
    getQuestions();
  }, [columnDefs]);

  return (
      <Box>
          {screen === chartTypeScreen.CHOOSE_CHART && (
              <Dialog title="Select Chart Type" onClose={onClose} open={open} size="md">
                  <DialogContent>
                      <DialogTitle css={{ color: "$secondary" }}>
                          <Box
                              css={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  width: "100%",
                              }}
                          >
                              Select Chart Type
                              <CloseSVG size={20} color="currentColor" onClick={onClose} extraClass={"closeSvg"} />
                          </Box>
                      </DialogTitle>
                      <DialogDescription css={{ color: "$neutral600", fontSize: "$sm", marginTop: "$7" }}>Select a following graph type to create a chart.</DialogDescription>
                      <div className="charts-wrapper">
                          {chartTypes.map((chart) => (
                              <ChartTypeOption key={chart.type} type={chart.type} Component={chart.Component} label={chart.label} onSelect={handleChartTypeSelect} />
                          ))}
                      </div>
                  </DialogContent>
              </Dialog>
          )}
          {screen === chartTypeScreen.CHOOSE_QUESTION && (
              <Dialog title="Select Question" onClose={onClose} open={open} size="md">
                  <DialogContent
                      css={{
                          height: "350px",
                      }}
                  >
                      <DialogTitle css={{ color: "$secondary" }}>
                          <Box
                              css={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  width: "100%",
                              }}
                          >
                              Select Question
                              <div>
                                  <BackSVG size={20} color="currentColor" onClick={() => setScreen(chartTypeScreen.CHOOSE_CHART)} extraClass={"closeSvg"} />
                                  <CloseSVG size={20} color="currentColor" onClick={onClose} extraClass={"closeSvg"} />
                              </div>
                          </Box>
                      </DialogTitle>
                      <DialogDescription>
                          <Select
                              value={selectedOption}
                              onChange={(option) => {
                                  setSelectedOption(option);
                              }}
                              //   options={validColumns.map((column) => ({
                              //       value: column.key,
                              //       label: column.name,
                              //   }))}
                              options={
                                selectedChart !== "wordcloud"
                                  ? validColumns.map((column) => ({
                                      value: column.key,
                                      label: column.name,
                                    }))
                                  : columnDefs
                                      .filter(column => column.question_type !== "OpinionScale" && column.question_type !== "Rating")
                                      .map((column) => ({
                                        value: column.key,
                                        label: column.name,
                                      }))
                              }
                              placeholder="Select a question"
                              menuPlacement="bottom"
                              styles={{
                                  control: (styles) => ({
                                      ...styles,
                                      border: "1px solid #EDEDED",
                                      borderRadius: "5px",
                                      padding: "5px",
                                  }),
                                  option: (styles, { isFocused }) => ({
                                      ...styles,
                                      backgroundColor: isFocused ? "#F5F5F5" : "white",
                                      color: isFocused ? "#0052CC" : "black",
                                      cursor: "pointer",
                                  }),
                              }}
                          />
                          <Button
                              size="md"
                              css={{
                                  width: "fit-content",
                              }}
                              onClick={() => {
                                  setScreen(chartTypeScreen.VIEW_CHART);
                              }}
                          >
                              View Chart
                          </Button>
                      </DialogDescription>
                  </DialogContent>
              </Dialog>
          )}
          {screen === chartTypeScreen.VIEW_CHART && <ShowChart selectedChartType={selectedChart} selectedOption={selectedOption} selectedRowsData={selectedRowsData} onClose={onClose} open={open} />}
      </Box>
  );
}

export default CreateChartModal;

const ShowChart = ({ selectedChartType, selectedOption, selectedRowsData, onClose, open }) => {
    const selectedOptionId = selectedOption.value;
    const values = selectedRowsData
    .map((row) => row[selectedOptionId])
    .filter((value) => value !== undefined);
    const chartData = values.map((value, index) => ({ name: index, uv: value }));
    const occurences = {};
    values.forEach((value) => {
      occurences[value] = (occurences[value] || 0) + 1;
    });
    const occurencesArray = Object.entries(occurences).map(([rating, count]) => ({ rating, count }));
    const worldCloudOccurences = values.reduce((acc, value) => {
        acc[value] = (acc[value] || 0) + 1;
        return acc;
    }, {});
    console.log(worldCloudOccurences, "worldCloudOccurences");
    console.log(occurencesArray, "occurencesArray");
    return (
        <Box>
            <Dialog title="View Chart" onClose={onClose} open={open} size="md">
                <DialogContent
                    css={{
                        height: "450px",
                    }}
                >
                    <DialogTitle css={{ color: "$secondary" }}>
                        <Box
                            css={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            View Chart
                            <CloseSVG size={20} color="currentColor" onClick={onClose} extraClass={"closeSvg"} />
                        </Box>
                    </DialogTitle>
                    <DialogDescription>
                        {selectedChartType === "linechart" && (
                            <LineChart width={550} height={300} data={chartData}>
                                <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                                <CartesianGrid stroke="#ccc" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                            </LineChart>
                        )}
                        {selectedChartType === "barchart" && (
                            <>
                                <BarChart width={550} height={300} data={occurencesArray}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="rating" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#82ca9d" />
                                </BarChart>
                            </>
                        )}
                        {selectedChartType === "piechart" && (
                            <>
                                <PieChart width={730} height={250}>
                                    <Pie data={occurencesArray} dataKey="count" nameKey="rating" fill="#8884d8" />
                                    <Tooltip />
                                </PieChart>
                            </>
                        )}
                        {selectedChartType === "wordcloud" && (
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
                        )}
                    </DialogDescription>
                </DialogContent>
            </Dialog>
        </Box>
    );
  };
