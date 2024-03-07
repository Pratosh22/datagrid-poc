"use strict";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import React, {
  StrictMode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { responses, questions } from "./responses.json";
import { RatingiconstarSVG } from "./assets/SVG";
import { createRoot } from "react-dom/client";
import { generateFakeData } from "../fakedata";
import { Button, CircleLoader } from "@sparrowengg/twigs-react";

const AgGrid = () => {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100vh", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [loader, setLoader] = useState(false);
  const [columnDefs, setColumnDefs] = useState([]);

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 150,
    };
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      minWidth: 250,
    };
  }, []);

  const populateColumnData = () => {
    const newColumnDefs = [
      {
        headerName: "Name",
        field: "name",
        headerCheckboxSelection: true,
        checkboxSelection: true,
      },
    ];
    questions.forEach((question) => {
      const columnDef = {
        headerName: question.rtxt.blocks[0].text,
        field: `${question.id}`,
        filter: true,
        resizable: true,
        width: 200,
        searchable: true,
        editable: true,
        params: { choices: question.choices },
        enableRowGroup: true,
        cellRenderer:
          question.type === "Rating"
            ? ratingCellRenderer
            : question.type === "MultipleChoice"
            ? multipleChoiceCellRenderer
            : question.type === "OpinionScale"
            ? opinionScaleRenderer
            : null,
        enablePivot: true,
        enableValue: true,
      };
      newColumnDefs.push(columnDef);
    });
    console.log("newColumnDefs", newColumnDefs);
    setColumnDefs(newColumnDefs);
    return newColumnDefs;
  };

  const populateRowData = (columnDefs) => {
    const newRows = [];
    // const questionsAnswered = responses
    //   .map((response) => Object.keys(response.submission).filter((key) => key.startsWith('question_')))
    //   .flat();
    // const questionsNotAnsweredIds = columnDefs.filter((columnDef) => !questionsAnswered.includes(columnDef.field)).map((columnDef) => columnDef.field);
    responses.forEach((response) => {
      const newRow = {};
      if (columnDefs.find((columnDef) => columnDef.field === "name")) {
        newRow["name"] =
          response.contactfullname.trim() !== ""
            ? response.contactfullname
            : "Anonymous";
      }
      Object.keys(response.submission).forEach((key) => {
        if (key.startsWith("question_")) {
          const questionId = key.split("_")[1];
          const column = columnDefs.find(
            (columnDef) => columnDef.field === `${questionId}`
          );
          if (column) {
            if (response.submission[key].skipped) {
              newRow[column.field] = "--Skipped--";
            } else if (response.submission[key].answer_choice_id) {
              const choices = column.params.choices;
              const choice = choices.find(
                (choice) =>
                  choice.id === response.submission[key].answer_choice_id
              );
              newRow[column.field] = choice?.txt;
            } else {
              newRow[column.field] = response.submission[key].answer;
            }
          }
        }
        const questionNotAnswered = columnDefs.filter(
          (columnDef) =>
            columnDef.field !== "name" &&
            !Object.keys(response.submission).includes(
              `question_${columnDef.field}`
            )
        );
        if (questionNotAnswered.length) {
          questionNotAnswered.forEach((questionNotAnswered) => {
            newRow[questionNotAnswered.field] = "--Not Answered--";
          });
        }
      });
      newRows.push(newRow);
    });
    // console.log('questionsAnswered', questionsAnswered);
    // console.log('questionsNotAnsweredIds', questionsNotAnsweredIds);
    console.log("newRows", newRows);

    setRowData(newRows);
  };
  const generateFake = () => {
    console.log("generateFake");
    console.log(loader, "loader")
    let data = [];
    let rows = [];
    gridRef.current.api.showLoadingOverlay();
    for (let i = 0; i < 100000; i++) data.push(generateFakeData());
    data.forEach((response) => {
      const newRow = {};
      Object.keys(response).forEach((key) => {
        if (key.startsWith("question_")) {
          const questionId = key.split("_")[1];
          const column = columnDefs.find(
            (columnDef) => columnDef.field === `${questionId}`
          );
          if (column) {
            if (response[key].skipped) {
              newRow[column.field] = "--Skipped--";
            } else if (response[key].answer_choice_id) {
              const choices = column.params.choices;
              const choice = choices.find(
                (choice) => choice.id === response[key].answer_choice_id
              );
              if (!choice) {
                return;
              }
              newRow[column.field] = choice.txt;
            } else {
              newRow[column.field] = response[key].answer;
            }
          }
        }
      });
      rows.push(newRow);
    });
    setRowData((prev) => {
      return [...prev, ...rows];
    });
    setLoader(false);
    console.log("rows", rows);
  };

  useEffect(() => {
    const columnDefs = populateColumnData(responses);
    populateRowData(columnDefs);
  }, []);
  
  return (
    loader ? (
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <CircleLoader size={100} />
      </div>
    ) : (
      <div style={containerStyle}>
        <Button onClick={generateFake} size={'md'} css={{
          width:'fit-content',
          margin:'10px'
        }}>Populate 100k</Button>
        <div style={gridStyle} className={"ag-theme-quartz-dark"}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            sideBar={"columns"}
            enableRangeSelection={true}
            enableCharts={true}
            rowGroupPanelShow="always"
            overlayLoadingTemplate={
              '<div aria-live="polite" aria-atomic="true" style="height:100px; width:100px; background: url(https://ag-grid.com/images/ag-grid-loading-spinner.svg) center / contain no-repeat; margin: 0 auto;" aria-label="loading"></div>'
            }
          />
        </div>
      </div>
    )
  );
};

export default AgGrid;
const ratingCellRenderer = (params) => {
  if (!params.data) {
    if(params.colDef.cellRenderer){
      return params.value.value || params.value
    }else{
      return params.value
    }
  }
  const { value } = params;
  const stars = [];
  for (let i = 0; i < value; i++) {
    stars.push(<RatingiconstarSVG key={i} />);
  }
  console.log(params)
  return <div>{stars}</div>;
};

const opinionScaleRenderer = (params) => {
  const { value } = params;
  if (!params.data) {
    if(params.colDef.cellRenderer){
      return params.value.value || params.value
    }else{
      return params.value
    }
  }
  return <div>{value}</div>;
};

const multipleChoiceCellRenderer = (params) => {
  const { value } = params;
  if (!params.data) {
    if(params.colDef.cellRenderer){
      return params.value.value || params.value
    }else{
      return params.value
    }
  }
  return <div>{value}</div>;
};
