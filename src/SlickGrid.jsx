/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Formatters,
  SlickgridReact,
  Editors,
  FieldType,
  Filters,
  GroupTotalFormatters,
} from "slickgrid-react";
import { SlickCustomTooltip } from "@slickgrid-universal/custom-tooltip-plugin";
import { questions, responses } from "./responses.json";
import ReactDOMServer from "react-dom/server";
import Draggable from "react-draggable";
import FloatingModal from "./FloatingMoadal";
import PivotTable from "./PivotTable";
import { StarSVG } from "./assets/SVG";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogContent,
  Text,
  Checkbox,
  Switch,
} from "@sparrowengg/twigs-react";
import Select from "react-select";
const StarFormatter = (row, cell, value, columnDef, dataContext) => {
  const stars = [];
  for (let i = 0; i < value; i++) {
    stars.push(<StarSVG key={i} />);
  }
  return ReactDOMServer.renderToStaticMarkup(
    <span data-stars={value}>{stars}</span>
  );
};

const RatingFormatter = (row, cell, value, columnDef, dataContext) => {
  return `<span class="opinionScale ${
    value < 5 ? "low" : value >= 5 && value < 8 ? "average" : "high"
  }" data-rating= ${value}>${value}</span>`;
};

const chartSelect = (
  addModal,
  setSelectedValues,
  type,
  setSelectedChartType
) => {
  const selectedRows = document.querySelectorAll(".selected");
  const values = {};
  selectedRows.forEach((row) => {
    let value;
    // if row.innerHTML is "html" sanitize it
    if (
      row.childNodes[0].nodeName === "SPAN" &&
      row.childNodes[0].getAttribute("data-rating")
    ) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(row.innerHTML, "text/html");
      value = doc.body.textContent;
    } else if (
      row.childNodes[0].nodeName === "SPAN" &&
      row.childNodes[0].getAttribute("data-stars")
    ) {
      value = row.childNodes[0].getAttribute("data-stars");
    } else {
      value = row.innerHTML;
    }
    const rowKey = `${row.classList[2]}`;
    if (!values[rowKey]) {
      values[rowKey] = [];
    }
    values[rowKey].push({ value });
  });
  setSelectedChartType(type);
  setSelectedValues(values);
  addModal(type, values);
  console.log(values, "selected rows");
};

const headerFormatter = (row, cell, value, column) => {
  return `<div class="tooltip-2cols-row">${column.params.name}</div>`;
};

const pivotTypes = {
  SUM: "sum",
  AVG: "avg",
  COUNT: "count",
  MAX: "max",
  MIN: "min",
};

function SlickGridR() {
  const [columnDefs, setColumnDefs] = useState([]);
  const [rows, setRows] = useState([]);
  const [selectedChartType, setSelectedChartType] = useState(null);
  const [modals, setModals] = useState([]);
  const [gridObj, setGridObj] = useState(null);
  const [dataViewObj, setDataViewObj] = useState(null);
  const [slickgrid, setSlickgrid] = useState(null);
  const [pivotTable, setPivotTable] = useState(false);
  const [columnList, setColumnList] = useState(false);
  const [initialRows, setInitialRows] = useState([]);
  const [pivotType, setPivotType] = useState(pivotTypes.SUM);
  const addModal = (chartType, data) => {
    setModals((prevModals) => [...prevModals, { chartType, data }]);
  };

  const removeModal = (index) => {
    setModals((prevModals) => prevModals.filter((_, i) => i !== index));
  };

  const [loading, setLoading] = useState(true);
  const [selectedValues, setSelectedValues] = useState([]);
  const [pivotMode, setPivotMode] = useState([]);

  const gridOptions = {
    enableAutoResize: true,
    autoResize: {
      container: "#grid1",
    },
    enableCellNavigation: true,
    gridWidth: 1450,
    cellSelection: true,
    editable: true,
    rowHeight: 50,
    headerRowHeight: 70,
    enableHeaderMenu: false,
    enableGridMenu: true,
    filterTypingDebounce: 250,
    createPreHeaderPanel: true,
    showPreHeaderPanel: true,
    preHeaderPanelHeight: 30,
    gridMenu: {
      iconCssClass: "fa-solid fa-bars",
      menuWidth: 37,
      subItemChevronClass: "fa-solid fa-chevron-right",
    },
    enableExcelCopyBuffer: true,
    excelCopyBufferOptions: {
      onCopyCells: (e, args) => console.log("onCopyCells", e, args),
      onPasteCells: (e, args) => console.log("onPasteCells", e, args),
      onCopyCancelled: (e, args) => console.log("onCopyCancelled", e, args),
    },
    exportOptions: {
      // set at the grid option level, meaning all column will evaluate the Formatter (when it has a Formatter defined)
      exportWithFormatter: true,
    },
    contextMenu: {
      hideCopyCellValueCommand: true,
      optionItems: [
        {
          option: true,
          title: "Create Chart",
          iconCssClass: "fa-solid fa-chart-simple",
          optionItems: [
            {
              option: "line-chart",
              title: "Line Chart",
              iconCssClass: "fa-solid fa-chart-line",
              action: () =>
                chartSelect(
                  addModal,
                  setSelectedValues,
                  "linechart",
                  setSelectedChartType
                ),
            },
            {
              option: "bar-chart",
              title: "Bar Chart",
              iconCssClass: "fa-solid fa-chart-bar",
              action: () =>
                chartSelect(
                  addModal,
                  setSelectedValues,
                  "barchart",
                  setSelectedChartType
                ),
            },
            {
              option: "pie-chart",
              title: "Pie Chart",
              iconCssClass: "fa-solid fa-chart-pie",
              action: () =>
                chartSelect(
                  addModal,
                  setSelectedValues,
                  "piechart",
                  setSelectedChartType
                ),
            },
            {
              option: "pivot-table",
              title: "Pivot Table",
              iconCssClass: "fa-solid fa-table",
              action: () => {
                getPivotColumnsAndRows();
                setPivotTable(true);
              },
            },
          ],
        },
        { divider: true, command: "", positionOrder: 60 },
        {
          option: true,
          title: "Copy",
          iconCssClass: "fa-solid fa-copy",
          action: (e, args) => {
            console.log(e, args, "copy");
            document.execCommand("copy");
          },
        },
      ],
    },
    enableFiltering: true,
    enableGrouping: true,
    // enableDraggableGrouping: true,
    // draggableGrouping: {
    //   dropPlaceHolderText: 'Drop a column header here to group by the column',
    //   // groupIconCssClass: 'fa fa-outdent',
    //   deleteIconCssClass: 'fa fa-times',
    //   // onGroupChanged: (_e, args) => this.onGroupChanged(args),
    //   // onExtensionRegistered: (extension) => this.draggableGroupingPlugin = extension,
    // },
    enablePagination: true,
    pagination: {
      pageSizes: [5, 10, 15, 20, 25, 30, 40, 50, 75, 100, 250, 500],
      pageSize: 20,
    },
    externalResources: [new SlickCustomTooltip()],
    customTooltip: {
      headerFormatter: headerFormatter,
    },
  };
  const populateColumnData = () => {
    const columnArr = [];
    questions.forEach((question, idx) => {
      const column = {
        id: Math.random().toString(36).substring(7),
        field: question.id.toString(),
        filterable: true,
        excludeFromHeaderMenu: true,
        name:
          question.rtxt.blocks[0].text.length > 20
            ? question.rtxt.blocks[0].text.substring(0, 20) + "..."
            : question.rtxt.blocks[0].text,
        sortable: true,
        params: {
          choices: question.choices,
          id: question.id,
          index: idx,
          name: question.rtxt.blocks[0].text,
          type: question.type,
        },
        type:
          question.type === "OpinionScale" || question.type === "Rating"
            ? FieldType.number
            : FieldType.string,
        minWidth: 200,
        formatter:
          question.type === "Rating"
            ? StarFormatter
            : question.type === "OpinionScale"
            ? RatingFormatter
            : question.type === "Dropdown" || question.type === "MultiChoice"
            ? Formatters.text
            : null,
        editor: {
          model:
            question.type === "OpinionScale" || question.type === "Rating"
              ? Editors.integer
              : question.type === "Dropdown" || question.type === "MultiChoice"
              ? Editors.singleSelect
              : Editors.text,
          placeholder: "Enter text",
          collection:
            question.type === "Dropdown" || question.type === "MultiChoice"
              ? question.choices.map((choice) => {
                  return {
                    value: choice?.txt,
                    label: choice?.txt,
                  };
                })
              : [],
        },
        onCellChange: (e, args) => {
          console.log(e, args, "cell change");
        },
        filter: {
          model:
            question.type === "Dropdown" || question.type === "MultiChoice"
              ? Filters.singleSelect
              : Filters.input,
          collection:
            question.type === "Dropdown" || question.type === "MultiChoice"
              ? question.choices.map((choice) => {
                  return {
                    value: choice?.txt,
                    label: choice?.txt,
                  };
                })
              : [],
        },
        groupTotalsFormatter:
          question.type === "Rating"
            ? GroupTotalFormatters.avgTotals
            : question.type === "OpinionScale"
            ? GroupTotalFormatters.avgTotals
            : null,
        // grouping: {
        //   getter: question.id.toString(),
        //   formatter: (g) => `Title: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        //   // aggregators: [
        //   //   new Aggregators.Avg(`${question.type === 'Rating' ? question.id.toString() : question.id.toString()}`),
        //   // ],
        //   aggregateCollapsed: true,
        //   collapsed: true
        // }
      };
      columnArr.push(column);
    });
    populateRowData(columnArr);
    setColumnDefs(columnArr);
    setPivotMode(columnArr);
  };

  const populateRowData = (columnArr) => {
    const newRows = [];
    responses.forEach((response) => {
      const newRow = {
        id: response.id,
      };
      Object.keys(response.submission).forEach((key) => {
        if (key.startsWith("question_")) {
          const questionId = key.split("_")[1];
          const column = columnArr.find(
            (columnDef) => columnDef.params.id == `${questionId}`
          );
          if (column) {
            if (response.submission[key].skipped) {
              newRow[column.params.id] = "--Skipped--";
            } else if (response.submission[key].answer_choice_id) {
              const choices = column.params.choices;
              const choice = choices.find(
                (choice) =>
                  choice.id === response.submission[key].answer_choice_id
              );
              newRow[column.params.id] = choice?.txt;
            } else {
              newRow[column.params.id] = response.submission[key].answer;
            }
          }
        }
        const questionNotAnswered = columnArr.filter(
          (columnDef) =>
            columnDef.id != "name" &&
            !Object.keys(response.submission).includes(
              `question_${columnDef.params.id}`
            )
        );
        if (questionNotAnswered.length) {
          questionNotAnswered.forEach((questionNotAnswered) => {
            newRow[questionNotAnswered.key] = "--Not Answered--";
          });
        }
      });
      newRows.push(newRow);
    });
    setRows(newRows);
    setInitialRows(newRows);
    setLoading(false);
  };

  useEffect(() => {
    populateColumnData();
  }, []);

  const reactGridReady = (reactGridInstance) => {
    setGridObj(reactGridInstance);
    setDataViewObj(reactGridInstance.dataView);
    setSlickgrid(reactGridInstance.slickGrid);
  };

  // useEffect(() => {
  //   console.log(gridObj, "gridObj");
  //   setGridObj(gridObj);
  // }, [gridObj]);

  const setChevron = () => {
    const chevron = document.getElementsByClassName("sub-item-chevron");
    chevron[0].innerHTML = "";
    chevron[0].classList.add("fa-solid", "fa-chevron-right");
  };

  const getPivotColumnsAndRows = () => {
    console.log(slickgrid);
    const selectedCells = document.querySelectorAll(".selected");
    //cells have column name with l{columnname} loop selectedcells and get column names

    const selectedColumns = [];
    selectedCells.forEach((cell) => {
      const columnName = cell.classList[1];
      if (!selectedColumns.includes(columnName)) {
        selectedColumns.push(columnName);
      }
    });
    //get selectedColumns from columnDefs with id l{index}
    const pivotColumns = [];

    selectedColumns.forEach((column) => {
      // Remove the leading 'l' and convert to integer
      const columnIndex = parseInt(column.replace("l", ""), 10);
      const selectedColumn = columnDefs.find(
        (columnDef) => columnDef.params.index === columnIndex
      );
      pivotColumns.push(selectedColumn);
    });
    const pivotRows = [pivotColumns.length - 1];
    pivotColumns.pop();
    const pivotRowsData = [];

    rows.forEach((row) => {
      const pivotRow = [];
      pivotColumns.forEach((column) => {
        pivotRow.push(row[column.field]);
      });
      pivotRowsData.push(pivotRow);
    });
    console.log(pivotRowsData, "pivotColumns");
  };

  useEffect(() => {
    if (columnList) {
      setColumnDefs([]);
    } else {
      populateColumnData();
    }
  }, [columnList]);

  const handleCheckboxChange = (index, column, value) => {
    let field = "";
    console.log(column);
    const tempColumnDefs = [];
    //2nd time
    if (columnDefs.length >= 1) {
      const newColumnDef = {
        ...column,
      };
      const field = newColumnDef.field;
      //get all unique values of rows with field
      const values = [];
      initialRows.forEach((row) => {
        if (row[field] && !values.includes(row[field])) {
          values.push(row[field]);
        }
      });
      //sort values
      values.sort();
      if (value) {
        if (pivotType === pivotTypes.AVG) {
          const newColumn = {
            id: Math.random().toString(36).substring(7),
            name: `${"avg"}(${newColumnDef.name})`,
            field: `${"avg"}-${newColumnDef.field}`,
            sortable: true,
            params: {
              ...newColumnDef.params,
            },
          };
          pivotMode.forEach((columnDef, i) => {
            if (columnDef.field === column.field) {
              setColumnDefs((prevColumnDefs) => [...prevColumnDefs, newColumn]);
            }
          });
          tempColumnDefs.push(newColumn);
        } else if (
          pivotType === pivotTypes.MAX ||
          pivotType === pivotTypes.MIN
        ) {
          console.log('in');
          const newColumn = {
            id: Math.random().toString(36).substring(7),
            name: `${pivotType === pivotTypes.MAX ? "max" : "min"}(${
              newColumnDef.name
            })`,
            field: `${pivotType === pivotTypes.MAX ? "max" : "min"}-${
              newColumnDef.field
            }`,
            sortable: true,
            params: {
              ...newColumnDef.params,
            },
          };
          pivotMode.forEach((columnDef, i) => {
            if (columnDef.field === column.field) {
              setColumnDefs((prevColumnDefs) => [...prevColumnDefs, newColumn]);
            }
          });
          tempColumnDefs.push(newColumn);
        } else if (
          pivotType === pivotTypes.COUNT ||
          pivotType === pivotTypes.SUM
        ) {
          const newColumn = {
            id: Math.random().toString(36).substring(7),
            name: `${
              pivotType === pivotTypes.SUM
                ? "sum"
                : pivotType === pivotTypes.AVG
                ? "avg"
                : pivotType === pivotTypes.COUNT
                ? "count"
                : ""
            }(${value})`,
            field: `${value}-${newColumnDef.field}`,
            sortable: true,
            params: {
              ...newColumnDef.params,
              value,
              parentColumn: newColumnDef.field,
            },
            columnGroup: `${newColumnDef.name}`,
          };
          setColumnDefs((prevColumnDefs) => [...prevColumnDefs, newColumn]);
          tempColumnDefs.push(newColumn);
        }
      } else {
        values.forEach((value) => {
          const newColumn = {
            id: Math.random().toString(36).substring(7),
            name: `${pivotType === pivotTypes.SUM ? "sum" : "avg"}(${value})`,
            field: `${value}-${newColumnDef.field}`,
            sortable: true,
            params: {
              ...newColumnDef.params,
              value,
              parentColumn: newColumnDef.field,
            },
            columnGroup: `${newColumnDef.name}`,
          };
          setColumnDefs((prevColumnDefs) => [...prevColumnDefs, newColumn]);
          tempColumnDefs.push(newColumn);
        });
        // gridObj.dataView.setGrouping([]);
      }
    }
    //1st time
    pivotMode.forEach((columnDef, i) => {
      if (columnDef.field === column.field && columnDefs.length === 0) {
        field = columnDef.field;
        const values = [];
        const valueCounts = {}; // object to store counts of each value
        rows.forEach((row) => {
          if (row[field] && !values.includes(row[field])) {
            values.push(row[field]);
          }
          if (row[field]) {
            // increment count of value in valueCounts, or set to 1 if not yet present
            valueCounts[row[field]] = (valueCounts[row[field]] || 0) + 1;
          }
        });
        // remove duplicate values in rows which match field and add value counts
        setRows((prevRows) => {
          // keep only rows where the field property is unique
          return prevRows.filter(
            (row, index, self) =>
              index === self.findIndex((r) => r[field] === row[field])
          );
        });
        setColumnDefs((prevColumnDefs) => [...prevColumnDefs, columnDef]);
        tempColumnDefs.push(columnDef);
      }
    });
    console.log(tempColumnDefs, "tempColumnDefs");
    const firstColumn = columnDefs[0]?.field;
    const secondColumn = tempColumnDefs[0]?.params.id;
    console.log(firstColumn, secondColumn, "firstColumn, secondColumn");
    if (
      firstColumn &&
      secondColumn &&
      (pivotType === pivotTypes.SUM || pivotType === pivotTypes.COUNT)
    ) {
      let sum = [];
      let count = [];
      initialRows.forEach((row) => {
        const value = row[firstColumn];
        let value2 = row[secondColumn];
        if (value && value2) {
          let parsedValue2 = parseInt(value2);
          if (isNaN(parsedValue2)) {
            // If value2 cannot be parsed to a number, treat it as a string
            parsedValue2 = value2;
          }
          //create object with value as key , parsedValue2 as another key and sum of parsedValue2
          if (!sum[value]) {
            sum[value] = {};
            count[value] = {};
          }
          if (!sum[value][parsedValue2]) {
            sum[value][parsedValue2] = isNaN(parsedValue2) ? value2 : 0; // Initialize as 0 for numbers and value2 for strings
            count[value][parsedValue2] = 0;
          }
          // Increment the sum and count
          if (!isNaN(parsedValue2)) {
            sum[value][parsedValue2] += parsedValue2;
          }
          count[value][parsedValue2]++;
        }
      });
      console.log(sum, "sum");
      console.log(count, "count");
      let resultRows = rows.map((row) => {
        Object.entries(sum).forEach(([key, value]) => {
          if (row[firstColumn] === key) {
            Object.entries(value).forEach(([k, v]) => {
              // Calculate the average, sum or count based on pivotType
              if (pivotType === pivotTypes.AVG) {
                row[k + `-${column.field}`] = v / count[key][k];
              } else if (pivotType === pivotTypes.SUM) {
                //if value is string, set sum as count[key][k]
                if (isNaN(k)) {
                  row[k + `-${column.field}`] = count[key][k];
                } else {
                  row[k + `-${column.field}`] = sum[key][k];
                }
              } else if (pivotType === pivotTypes.COUNT) {
                row[k + `-${column.field}`] = count[key][k];
              }
            });
          }
        });
        return row;
      });
      console.log(resultRows, "resultRows");
    } else if (
      firstColumn &&
      secondColumn &&
      (pivotType === pivotTypes.MAX || pivotType === pivotTypes.MIN)
    ) {
      let max = {};
      let min = {};
      let count = {};
      initialRows.forEach((row) => {
        const value = row[firstColumn];
        let value2 = row[secondColumn];
        if (value && value2) {
          let parsedValue2 = parseInt(value2);
          if (isNaN(parsedValue2)) {
            // If value2 cannot be parsed to a number, treat it as a string
            parsedValue2 = value2;
          }
          //create object with value as key , parsedValue2 as another key and sum of parsedValue2
          if (!max[value]) {
            max[value] = {};
            min[value] = {};
            count[value] = {};
          }
          if (!count[value][parsedValue2]) {
            count[value][parsedValue2] = 1;
          } else {
            // Increment the count
            count[value][parsedValue2]++;
          }
        }
      });
      
      // After the forEach loop, find the maximum and minimum count and assign them to max[value] and min[value] respectively
      Object.keys(count).forEach((key) => {
        const entries = Object.entries(count[key]);
        max[key] = entries.reduce((a, b) => (b[1] > a[1] ? b : a))[0];
        min[key] = entries.reduce((a, b) => (b[1] < a[1] ? b : a))[0];
      });
    
      let resultRows = rows.map((row) => {
        Object.entries(pivotType === pivotTypes.MAX ? max : min).forEach(([key, value]) => {
          if (row[firstColumn] === key) {
            row[`${pivotType}` + `-${column.field}`] = value;
          }
        });
        return row;
      });
      console.log(resultRows, "resultRows");
      console.log(min, 'min');
      console.log(max,' max');
      console.log(count, 'count');
    } else {
      let total = [];
      let count = [];
      initialRows.forEach((row) => {
        const value = row[firstColumn];
        let value2 = row[secondColumn];
        if (value && value2) {
          let parsedValue2 = parseInt(value2);
          if (isNaN(parsedValue2)) {
            // If value2 cannot be parsed to a number, treat it as a string
            parsedValue2 = value2;
          }
          //create object with value as key , parsedValue2 as another key and sum of parsedValue2
          if (!total[value]) {
            total[value] = {};
            count[value] = {};
          }
          if (!total[value][parsedValue2]) {
            total[value][parsedValue2] = isNaN(parsedValue2) ? value2 : 0; // Initialize as 0 for numbers and value2 for strings
            count[value][parsedValue2] = 0;
          }
          // Increment the sum and count
          if (!isNaN(parsedValue2)) {
            total[value][parsedValue2] += parsedValue2;
          }
          count[value][parsedValue2]++;
        }
      });

      let resultRows = rows.map((row) => {
        Object.entries(total).forEach(([key, value]) => {
          if (row[firstColumn] === key) {
            Object.entries(value).forEach(([k, v]) => {
              let totalSum = 0;
              let totalCount = 0;
              Object.entries(count[key]).forEach(([rating, ratingCount]) => {
                totalSum += Number(rating) * ratingCount;
                totalCount += ratingCount;
              });
              row["avg" + `-${column.field}`] = (totalSum / totalCount).toFixed(
                2
              );
            });
          }
        });
        return row;
      });
    }
  };
  useEffect(() => {
    const el = document.querySelectorAll(".slick-group-level-1");
    el.forEach((e) => {
      e.style.pointerEvents = "none";
    });
  }, []);

  const handleCheckboxUncheck = (index, column, value) => {
    if (value && ( pivotType === pivotTypes.SUM || pivotType === pivotTypes.COUNT ) && columnDefs.length > 1) {
      setColumnDefs((prevColumnDefs) =>
        prevColumnDefs.filter(
          (columnDef) => columnDef.field !== `${value}-${column.field}`
        )
      );
    } else if (value && ( pivotType === pivotTypes.MAX || pivotType === pivotTypes.MIN ) && columnDefs.length > 1) {
      setColumnDefs((prevColumnDefs) =>
        prevColumnDefs.filter(
          (columnDef) => columnDef.field !== `${pivotType === pivotTypes.MAX ? "max" : "min"}-${column.field}`
        )
      );
    
    } else if (value && pivotType === pivotTypes.AVG && columnDefs.length > 1) {
      setColumnDefs((prevColumnDefs) =>
        prevColumnDefs.filter(
          (columnDef) => columnDef.field !== `${"avg"}-${column.field}`
        )
      );
    } else {
      console.log(column, "column");
      setColumnDefs((prevColumnDefs) =>
        prevColumnDefs.filter(
          (columnDef) => columnDef.params.id != column.field
        )
      );
    }
  };

  return (
    <div>
      {modals.map((modal, index) => (
        <Draggable key={index}>
          <div
            style={{
              position: "absolute",
              top: `calc(50% + ${index * 20}px)`,
              left: `calc(50% + ${index * 20}px)`,
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              zIndex: 1000,
            }}
          >
            <FloatingModal
              chartType={modal.chartType}
              data={modal.data}
              onClose={() => removeModal(index)}
            />
          </div>
        </Draggable>
      ))}
      {pivotTable && (
        <Dialog size="md" open={pivotTable}>
          <DialogContent
            css={{
              width: "max-content",
              padding: 0,
              maxHeight: "inherit",
            }}
          >
            <DialogTitle>
              <Box
                css={{
                  display: "flex",
                  alignSelf: "flex-end",
                  background: "#ededed",
                }}
              >
                <i
                  className="fa-solid fa-close"
                  onClick={() => {
                    setPivotTable(false);
                  }}
                  style={{
                    paddingTop: "6px",
                    paddingLeft: "8px",
                  }}
                />
              </Box>
            </DialogTitle>
            <DialogDescription
              css={{
                margin: 0,
              }}
            >
              <PivotTable
                data={[
                  [
                    "id",
                    "Where are you living in?",
                    "Which part of the city do you live in?",
                    "Are you male or female?",
                    "Are you married or single?",
                    "value",
                  ],
                  ["id1", "Kochi", "East", "Male", "Married", 2000],
                  ["id2", "Kochi", "West", "Female", "Single", 1000],
                  ["id3", "Kochi", "North", "Female", "Married", 3000],
                  ["id4", "Kochi", "South", "Male", "Single", 4000],
                  ["id5", "Chennai", "East", "Male", "Married", 2030],
                  ["id6", "Chennai", "West", "Female", "Married", 402],
                  ["id7", "Chennai", "North", "Female", "Single", 2334],
                  ["id8", "Chennai", "South", "Male", "Married", 5467],
                  ["id9", "Chennai", "East", "Male", "Single", 232],
                  ["idn", "Chennai", "East", "Male", "Single", 2323],
                ]}
                rows={[
                  "Where are you living in?",
                  "Which part of the city do you live in?",
                ]}
                cols={["Are you male or female?", "Are you married or single?"]}
                aggregatorName="Sum"
                vals={["value", "value"]}
              />
            </DialogDescription>
          </DialogContent>
        </Dialog>
      )}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Box
          css={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <SlickgridReact
            gridId="grid1"
            dataset={rows}
            columnDefinitions={columnDefs}
            gridOptions={gridOptions}
            onReactGridCreated={($event) => reactGridReady($event.detail)}
            onColumnsDrag={(_e, args) => {
              console.log("columns dragged", args);
            }}
            customDataView={dataViewObj}
            onContextMenu={() => {
              setChevron();
            }}
            // onGridStateChanged={() => {
            //   console.log(gridObj);
            // }}
            onDrag={(_e, args) => {
              console.log("drag", args);
            }}
          />
          <Box
            css={{
              paddingBottom: "20px",
              borderLeft: "1px solid #e0e0e0",
            }}
          >
            <Box
              id="pivotOption"
              css={{
                textAlign: "justify",
                paddingLeft: "20px",
                width: "300px",
                height: "fit-content",
                maxHeight: "100vh",
                overflowY: "scroll",
                "::-webkit-scrollbar": "hidden",
              }}
            >
              <Box
                css={{
                  gap: "26px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box
                  css={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row-reverse",
                    justifyContent: "flex-end",
                    gap: "8px",
                    marginTop: "$10",
                    marginBottom: "$10",
                  }}
                >
                  <Switch
                    id="pivotSwitch"
                    label="Pivot Table"
                    onChange={(e) => {
                      if (e) {
                        setColumnList(e);
                      } else {
                        setColumnList(e);
                      }
                    }}
                    size="md"
                  />
                  <Text css={{ fontSize: "16px", margin: "0" }}>
                    Pivot Mode
                  </Text>
                </Box>
                <Select
                  options={[
                    { value: pivotTypes.SUM, label: "Sum" },
                    { value: pivotTypes.AVG, label: "Average" },
                    { value: pivotTypes.COUNT, label: "Count" },
                    { value: pivotTypes.MAX, label: "Max" },
                    { value: pivotTypes.MIN, label: "Min" },
                  ]}
                  defaultValue={{ value: pivotTypes.SUM, label: "Sum" }}
                  onChange={(e) => {
                    setPivotType(e.value);
                  }}
                />
              </Box>
              <Box
                css={{
                  marginTop: "32px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "32px",
                }}
              >
                {columnList &&
                  pivotMode.map((columnDef, index) => (
                    <Box
                      key={index}
                      css={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      {columnDef.params.type === "TextInput" ? (
                        <CheckboxWithText
                          index={index}
                          handleCheckboxChange={handleCheckboxChange}
                          handleCheckboxUncheck={handleCheckboxUncheck}
                          text={columnDef.name}
                          columnDef={columnDef}
                          css={{
                            display: "flex",
                            gap: "8px",
                            alignItems: "center",
                          }}
                        />
                      ) : columnDef.params.type === "MultiChoice" ? (
                        <Dropdown
                          columnDef={columnDef}
                          index={index}
                          pivotType={pivotType}
                          handleCheckboxChange={handleCheckboxChange}
                          handleCheckboxUncheck={handleCheckboxUncheck}
                        />
                      ) : columnDef.params.type === "Rating" ? (
                        <Rating
                          columnDef={columnDef}
                          index={index}
                          pivotType={pivotType}
                          handleCheckboxChange={handleCheckboxChange}
                          handleCheckboxUncheck={handleCheckboxUncheck}
                        />
                      ) : columnDef.params.type === "OpinionScale" ? (
                        <OpinionScale
                          columnDef={columnDef}
                          index={index}
                          pivotType={pivotType}
                          handleCheckboxChange={handleCheckboxChange}
                          handleCheckboxUncheck={handleCheckboxUncheck}
                        />
                      ) : null}
                    </Box>
                  ))}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </div>
  );
}

export default SlickGridR;

const CheckboxWithText = ({
  index,
  handleCheckboxChange,
  text,
  columnDef,
  value,
  handleCheckboxUncheck,
  css = {
    display: "flex",
    gap: "8px",
  },
}) => (
  <Box css={css}>
    <Checkbox
      size="md"
      css={{ padding: "0" }}
      itemID={index}
      onChange={(e) => {
        if (e) {
          handleCheckboxChange(index, columnDef, value);
        } else {
          handleCheckboxUncheck(index, columnDef, value);
        }
      }}
    />
    <Text css={{ cursor: "pointer", margin: "0" }}>{text}</Text>
  </Box>
);

const Dropdown = ({
  columnDef,
  index,
  handleCheckboxChange,
  handleCheckboxUncheck,
  pivotType,
}) => {
  const [showCheckboxes, setShowCheckboxes] = useState(false);

  return (
    <Box
      css={{
        display: "flex",
        flexDirection: "column",
        gap: "$3",
      }}
    >
      <Box
        css={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        {pivotType !== pivotTypes.AVG ? (
          <>
            <i
              className={`fa-solid ${
                !showCheckboxes ? "fa-chevron-right" : "fa-chevron-down"
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => setShowCheckboxes(!showCheckboxes)}
            ></i>
            <Text css={{ cursor: "pointer", margin: "0" }}>
              {columnDef.name}
            </Text>
          </>
        ) : (
          <CheckboxWithText
            index={index}
            handleCheckboxChange={handleCheckboxChange}
            handleCheckboxUncheck={handleCheckboxUncheck}
            text={columnDef.name}
            columnDef={columnDef}
          />
        )}
      </Box>
      {showCheckboxes &&
        pivotType !== pivotTypes.AVG &&
        pivotType !== pivotTypes.MAX &&
        pivotType !== pivotTypes.MIN && (
          <Box
            css={{
              display: "flex",
              flexDirection: "column",
              gap: "$4",
            }}
          >
            {columnDef.params?.choices.map((choice, index) => (
              <CheckboxWithText
                key={index}
                index={index}
                handleCheckboxChange={handleCheckboxChange}
                columnDef={columnDef}
                value={choice.txt}
                handleCheckboxUncheck={handleCheckboxUncheck}
                text={choice.txt}
              />
            ))}
          </Box>
        )}
    </Box>
  );
};

const Rating = ({
  columnDef,
  index,
  handleCheckboxChange,
  handleCheckboxUncheck,
  pivotType,
}) => {
  const [showCheckboxes, setShowCheckboxes] = useState(false);

  return (
    <Box
      css={{
        display: "flex",
        flexDirection: "column",
        gap: "$3",
      }}
    >
      <Box
        css={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <i
          className={`fa-solid ${
            !showCheckboxes ? "fa-chevron-right" : "fa-chevron-down"
          }`}
          style={{ cursor: "pointer" }}
          onClick={() => setShowCheckboxes(!showCheckboxes)}
        ></i>
        <Text css={{ cursor: "pointer", margin: "0" }}>{columnDef.name}</Text>
      </Box>
      {showCheckboxes && (
        <Box
          css={{
            display: "flex",
            flexDirection: "column",
            gap: "$4",
          }}
        >
          {((pivotType === pivotTypes.AVG || pivotType === pivotTypes.MAX || pivotType === pivotTypes.MIN )
            ? ["Select all"]
            : [1, 2, 3, 4, 5]
          ).map((value, index) => (
            <CheckboxWithText
              key={index}
              index={index}
              columnDef={columnDef}
              value={value}
              handleCheckboxChange={handleCheckboxChange}
              handleCheckboxUncheck={handleCheckboxUncheck}
              text={value}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

const OpinionScale = ({
  columnDef,
  index,
  handleCheckboxChange,
  handleCheckboxUncheck,
  pivotType,
}) => {
  const [showCheckboxes, setShowCheckboxes] = useState(false);

  return (
    <Box
      css={{
        display: "flex",
        flexDirection: "column",
        gap: "$3",
      }}
    >
      <Box
        css={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <i
          className={`fa-solid ${
            !showCheckboxes ? "fa-chevron-right" : "fa-chevron-down"
          }`}
          style={{ cursor: "pointer" }}
          onClick={() => setShowCheckboxes(!showCheckboxes)}
        ></i>
        <Text css={{ cursor: "pointer", margin: "0" }}>{columnDef.name}</Text>
      </Box>
      {showCheckboxes && (
        <Box
          css={{
            display: "flex",
            flexDirection: "column",
            gap: "$4",
          }}
        >
          {((pivotType === pivotTypes.AVG || pivotType === pivotTypes.MAX || pivotType === pivotTypes.MIN )
            ? ["Select all"]
            : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
          ).map((value, index) => (
            <CheckboxWithText
              key={index}
              columnDef={columnDef}
              index={index}
              value={value}
              handleCheckboxChange={handleCheckboxChange}
              handleCheckboxUncheck={handleCheckboxUncheck}
              text={value}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
