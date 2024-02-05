import { useState, useEffect, useMemo, useCallback } from "react";
import DataGrid, { SelectColumn, textEditor } from "react-data-grid";
import FilterResults from "react-filter-search";
import { questions, responses } from "./responses.json";
import { StarSVG } from "./assets/SVG.jsx";
import "./App.css";
import "react-data-grid/lib/styles.css";

function DataGridEx() {
    const [columnDefs, setColumnDefs] = useState([]);
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [rows, setRows] = useState([]);
    const [sortColumns, setSortColumns] = useState([]);
    const [columnsOrder, setColumnsOrder] = useState([]);
    const [createChartModal, setCreateChartModal] = useState(false);
    const [filters, setFilters] = useState({});
    const [value, setValue] = useState("");

    useEffect(() => {
        setColumnsOrder(columnDefs.map((_, index) => index));
    }, [columnDefs]);

    useEffect(() => {
        console.log(columnDefs, "columnDefs");
    }, [columnDefs, rows]);
    const onSortColumnsChange = useCallback((sortColumns) => {
        setSortColumns(sortColumns.slice(-1));
    }, []);


    const reorderedColumns = useMemo(() => {
        return columnsOrder.map((index) => columnDefs[index]);
    }, [columnsOrder]);

    useEffect(() => {}, [columnDefs]);
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
                    console.log(value, 'vallllll');
                    return (
                        <>
                            <div>
                                <span>{p.column.name}</span>
                                <span>{sortDirection === "ASC" ? "🔽" : sortDirection === "DESC" ? "🔼" : ""}</span>
                            </div>
                            <Inp />
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

    function onColumnsReorder(sourceKey, targetKey) {
        setColumnsOrder((columnsOrder) => {
            const sourceColumnOrderIndex = columnsOrder.findIndex((index) => columnDefs[index].key === sourceKey);
            const targetColumnOrderIndex = columnsOrder.findIndex((index) => columnDefs[index].key === targetKey);
            const sourceColumnOrder = columnsOrder[sourceColumnOrderIndex];
            const newColumnsOrder = columnsOrder.toSpliced(sourceColumnOrderIndex, 1);
            newColumnsOrder.splice(targetColumnOrderIndex, 0, sourceColumnOrder);
            return newColumnsOrder;
        });
    }

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
        console.log(selectedRowsData, "selectedRowsData");
    };
    useEffect(() => {
        getSelectedRows();
    }, [selectedRows]);
    return (
        <>
            <div className="app">
                <button
                    onClick={() => {
                        setCreateChartModal(true);
                    }}
                >
                    Create Chart
                </button>
                <DataGrid
                    rowHeight={50}
                    columnWidth={200}
                    rowKeyGetter={rowKeyGetter}
                    columns={reorderedColumns}
                    sortColumns={sortColumns}
                    onSortColumnsChange={onSortColumnsChange}
                    onColumnsReorder={onColumnsReorder}
                    rows={sortedRows}
                    selectedRows={selectedRows}
                    onRowsChange={setRows}
                    onSelectedRowsChange={setSelectedRows}
                    className="rdg-light fill-grid"
                />
            </div>
        </>
    );
}

export default DataGridEx;


const Inp = () => {
  const [val, setVal] = useState('')

  return (
      <input
          type="text"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onClick={(e) => {
              e.stopPropagation();
          }}
          // onMouseDown={(e) => {
          //     e.stopPropagation();
          // }}
          placeholder="Type to filter.."
      />
  );
}