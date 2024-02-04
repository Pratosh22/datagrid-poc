import React, { useState, useEffect } from "react";
import { Formatters, SlickgridReact } from "slickgrid-react";
import { questions, responses } from "./responses.json";
const gridOptions2 = {
    gridHeight: 225,
    gridWidth: 800,
    enableAutoResize: false,
};

function SlickGrid() {
    const [columnDefs, setColumnDefs] = useState([]);
    const [rows, setRows] = useState([]);

    const populateColumnData = () => {
        const columnArr = [];
        questions.forEach((question) => {
            const column = {
                id: question.id,
                name: question.rtxt.blocks[0].text,
                question_type: question.type,
                sortable: true,
                minWidth: 100,
            };
            columnArr.push(column);
        });
        console.log(columnArr, "columnArr");
        setColumnDefs(columnArr);
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
                } else {
                  newRow[column.key] = response.submission[key].answer;
                }
              }
            }
            const questionNotAnswered = columnDefs.filter((columnDef) => columnDef.key != 'name' && !Object.keys(response.submission).includes(`question_${columnDef.key}`));
            if (questionNotAnswered.length){
              questionNotAnswered.forEach((questionNotAnswered) => {
                newRow[questionNotAnswered.key] = '--Not Answered--';
              });
            }
          });
          newRows.push(newRow);
        });
        setRows(newRows);
      };

    useEffect(() => {
        populateColumnData();
    },[]);
    
    useEffect(() => {
        populateRowData();
    },[columnDefs]);

    console.log(rows, 'rows');
    return (
        <div>
            {
                !rows ? (
                    <div>Loading...</div>
                ) : (
                    <SlickgridReact
                        gridId="grid1"
                        dataset={rows}
                        columnDefinitions={columnDefs}
                        gridOptions={gridOptions2}
                    />
                )
            }
        </div>
    );
}

export default SlickGrid;
