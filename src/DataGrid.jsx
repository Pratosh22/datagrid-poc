/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import DataGrid, { SelectColumn, textEditor } from "react-data-grid";
import { questions, responses } from "./responses.json";
import { StarSVG } from "./assets/SVG.jsx";
import "./App.css";
import "react-data-grid/lib/styles.css";


const filterRows = (rows, column, value) => {
  const lowercaseValue = value.toLowerCase();
  return rows.filter((row) => {
    const cellValue = row[column.key];
    const cellValueStr = typeof cellValue === 'number' ? cellValue.toString() : cellValue;
    return cellValueStr.toLowerCase().includes(lowercaseValue);
  });
};

function DataGridEx() {
  console.log('rerender');
    const gridRef = useRef();
    const [columnDefs, setColumnDefs] = useState([]);
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [rows, setRows] = useState([]);
    const [originalRows, setOriginalRows] = useState([]);
    const [sortColumns, setSortColumns] = useState([]);
    const [createChartModal, setCreateChartModal] = useState(false);
    const [filterValue, setFilterValue] = useState('');
    const [filterColumn, setFilterColumn] = useState('');

    const onSortColumnsChange = useCallback((sortColumns) => {
        setSortColumns(sortColumns.slice(-1));
    }, []);
    const populateColumnData = () => {
        const columnDefs = [SelectColumn];
        questions.forEach((question) => {
            const column = {
                key: question.id,
                name: question.rtxt.blocks[0].text.length > 20 ? question.rtxt.blocks[0].text.substring(0, 25) + "..." : question.rtxt.blocks[0].text,
                question_type: question.type,
                resizable: true,
                sortable: true,
                width: 200,
                choices: question.choices,
                headerCellClass: "header-cell",
                renderEditCell: (p) => {
                    if (p.column.question_type !== "TextInput" && p.column.question_type !== "MultiChoice" && p.column.question_type !== "Dropdown") {
                        return <input type="number" autoFocus value={p.row[p.column.key]} onChange={(e) => p.onRowChange({ ...p.row, [p.column.key]: e.target.value })} />;
                    } else if (p.column.question_type === "MultiChoice" || p.column.question_type === "Dropdown") {
                        return (
                            <select autoFocus value={p.row[p.column.key]} onChange={(e) => p.onRowChange({ ...p.row, [p.column.key]: e.target.value }, true)}>
                                {p.column.choices.map((choice) => (
                                    <option key={choice.id}>{choice.txt}</option>
                                ))}
                            </select>
                        );
                    }
                    return textEditor(p);
                },
                renderCell: (p) => {
                    if (p.column.question_type === "Rating") {
                        return (
                            <span>
                                {Array.from({ length: p.row[p.column.key] }, (_, i) => i).map((i) => (
                                    <StarSVG key={i} />
                                ))}
                            </span>
                        );
                    } else if (p.column.question_type === "OpinionScale") {
                        return (
                            <center>
                                <div className={`opinionScale ${p.row[p.column.key] <= 5 ? "low" : p.row[p.column.key] > 5 && p.row[p.column.key] <= 8 ? "average" : "high"}`}>
                                    {p.row[p.column.key]}
                                </div>
                            </center>
                        );
                    } else if (p.column.question_type === "MultiChoice" || p.column.question_type === "Dropdown") {
                        return <span>{p.row[p.column.key]}</span>;
                    } else {
                        return <span>{p.row[p.column.key]}</span>;
                    }
                },
                renderHeaderCell: (p) => {
                    const sortDirection = p.sortDirection;
                    return (
                        <>
                            <div className="title">
                                <span>{p.column.name}</span>
                                <span>{sortDirection === "ASC" ? "🔽" : sortDirection === "DESC" ? "🔼" : ""}</span>
                            </div>
                            <Inp columnId={p.column.key} columnDefs={columnDefs} rows={rows} setFilterValue={setFilterValue} setFilterColumn={setFilterColumn} deselectCell={deselectCell}/>
                        </>
                    );
                },
            };
            columnDefs.push(column);
        });
        setColumnDefs(columnDefs);
    };

    const populateRowData = () => {
        const newRows = [];
        responses.forEach((response) => {
            const newRow = {
                id: response.id,
            };
            Object.keys(response.submission).forEach((key) => {
                if (key.startsWith("question_")) {
                    const questionId = key.split("_")[1];
                    const column = columnDefs.find((columnDef) => columnDef.key == `${questionId}`);
                    if (column) {
                        if (response.submission[key].skipped) {
                            newRow[column.key] = "--Skipped--";
                        } else if (response.submission[key].answer_choice_id) {
                            const choices = column.choices;
                            const choice = choices.find((choice) => choice.id === response.submission[key].answer_choice_id);
                            newRow[column.key] = choice.txt;
                        } else {
                            newRow[column.key] = response.submission[key].answer;
                        }
                    }
                }
                const questionNotAnswered = columnDefs.filter((columnDef) => columnDef.key != "name" && !Object.keys(response.submission).includes(`question_${columnDef.key}`));
                if (questionNotAnswered.length) {
                    questionNotAnswered.forEach((questionNotAnswered) => {
                        newRow[questionNotAnswered.key] = "--Not Answered--";
                    });
                }
            });
            newRows.push(newRow);
        });
        setOriginalRows(newRows);
        setRows(newRows);
    };

    const sortedRows = useMemo(() => {
        if (sortColumns.length === 0) return rows;
        const { columnKey, direction } = sortColumns[0];
        let sortedRows = [...rows];
        // Check if the data is a number or text
        if (isNaN(sortedRows[0][columnKey])) {
            // Sort text in ascending order
            sortedRows.sort((a, b) => a[columnKey].localeCompare(b[columnKey]));
        } else {
            // Sort numbers in ascending order
            sortedRows.sort((a, b) => a[columnKey] - b[columnKey]);
        }

        return direction === "DESC" ? sortedRows.reverse() : sortedRows;
    }, [rows, sortColumns]);

    const rowKeyGetter = (row) => {
        //return full row data
        return row.id;
    };

    useEffect(() => {
        populateColumnData();
    }, []);

    useEffect(() => {
        populateRowData();
    }, [columnDefs]);

    const getSelectedRows = () => {
        const selectedRowsData = [];
        if (selectedRows.size === 0) return;
        selectedRows.forEach((id) => {
            const row = rows.find((row) => row.id === id);
            selectedRowsData.push(row);
        });
    };
    useEffect(() => {
        getSelectedRows();
    }, [selectedRows]);

    useEffect(() => {
      if (filterValue && filterColumn) {
        const newRows = filterRows(originalRows, filterColumn, filterValue);
        setRows(newRows);
      } else {
        setRows(originalRows);
      }
    }, [filterValue, filterColumn, originalRows]);

    const deselectCell = () => {
      //TODO: Deselect cell
    };

    return (
        <>
            <div className="app">
              <div className="btns">
                  <button
                      onClick={() => {
                          setCreateChartModal(true);
                      }}
                  >
                      Create Chart
                  </button>
                  
              </div>
                <DataGrid
                    rowHeight={70}
                    columnWidth={200}
                    columns={columnDefs}
                    rowKeyGetter={rowKeyGetter}
                    sortColumns={sortColumns}
                    onSortColumnsChange={onSortColumnsChange}
                    rows={sortedRows}
                    selectedRows={selectedRows}
                    onRowsChange={setRows}
                    onSelectedRowsChange={setSelectedRows}
                    className="rdg-light"
                    ref={gridRef}
                />
            </div>
        </>
    );
}

export default DataGridEx;


const Inp = ({ columnId, columnDefs, setFilterColumn, setFilterValue, deselectCell  }) => {
  const [val, setVal] = useState('')
  const filterColumn = columnDefs.find((column)=>
    column.key === columnId
  );
  //filter rows based on the column and value
  useEffect(() => {
    setFilterValue(val);
  }, [val,setFilterValue]);

  return (
      <input
          type="text"
          value={val}
          onChange={(e) => {
              setVal(e.target.value);
              setFilterColumn(filterColumn);
          }}
          onClick={(e) => {
              e.stopPropagation();
              deselectCell();
          }}
          placeholder="Type to filter.."
      />
  );
}