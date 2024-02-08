import React, { useState, useEffect } from "react";
import { Formatters, SlickgridReact, Editors, FieldType, Filters, OperatorType } from "slickgrid-react";
import { questions, responses } from "./responses.json";
import ReactDOMServer from 'react-dom/server';
import { StarSVG } from "./assets/SVG";

const StarFormatter = (row, cell, value, columnDef, dataContext) => {
  const stars = [];
  for (let i = 0; i < value; i++) {
      stars.push(<StarSVG key={i} />);
  }
  return ReactDOMServer.renderToStaticMarkup(
    <span data-stars={value}>
      {stars}
    </span>
  );
};

const RatingFormatter = (row, cell, value, columnDef, dataContext) => {
  return `<span class="opinionScale ${value < 5 ? 'low' : value >= 5 && value < 8 ? 'average' : 'high' }" data-rating= ${value}>${value}</span>`;
}

const chartSelect = (setShowModal) => {
    const selectedRows = document.querySelectorAll(".selected");
    const values = [];
    selectedRows.forEach((row) => {
        // if row.innerHTML is "html" sanitize it
        if (row.childNodes[0].nodeName === "SPAN" && row.childNodes[0].getAttribute("data-rating")) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(row.innerHTML, "text/html");
            values.push(doc.body.textContent);
        } else if (row.childNodes[0].nodeName === "SPAN" && row.childNodes[0].getAttribute("data-stars")){
          console.log(row.childNodes, 'ciuld nodes');
            values.push(row.childNodes[0].getAttribute("data-stars"));
        } else{
            values.push(row.innerHTML);
        }
    });
    setShowModal(true);
    console.log(values, "selected rows");
};
  

function SlickGrid() {
    const [columnDefs, setColumnDefs] = useState([]);
    const [rows, setRows] = useState([]);
    const [chartType, selectedChartType] = useState(null);
    const [loading, setLoading] = useState(true);
    const gridOptions = {
        enableAutoResize:true,
        enableCellNavigation:true,
        cellSelection:true,
        editable: true,
        rowHeight: 70,
        enableHeaderMenu: false,
        enableGridMenu: true,
        gridMenu: {
            iconCssClass: "fa-solid fa-bars",
            menuWidth: 37,
            subItemChevronClass: "fa-solid fa-chevron-right",
        },
        enableExcelCopyBuffer: true,
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
                      { option: "line-chart", title: "Line Chart", iconCssClass: "fa-solid fa-chart-line", action: () => chartSelect() },
                      { option: "bar-chart", title: "Bar Chart", iconCssClass: "fa-solid fa-chart-bar", action: () => chartSelect() },
                      { option: "pie-chart", title: "Pie Chart", iconCssClass: "fa-solid fa-chart-pie", action: () => chartSelect() },
                  ],
              },
              { divider: true, command: "", positionOrder: 60 },
              {
                  option: true,
                  title: "Copy",
                  iconCssClass: "fa-solid fa-copy",
                  action: (e, args) => {
                      console.log("copied");
                      document.execCommand("copy");
                  },
              },
          ],
        },
        // enableFiltering: true,
      };
    const populateColumnData = () => {
        const columnArr = [];
        questions.forEach((question) => {
            const column = {
                id: question.id,
                field:question.id.toString(),
                name: question.rtxt.blocks[0].text.length > 20 ? question.rtxt.blocks[0].text.substring(0, 20) + "..." : question.rtxt.blocks[0].text,
                filterable:true,
                filter: {
                  model: Filters.input,
                  operator: OperatorType.rangeInclusive,// defaults to exclusive
            
                  // // or use the string (case sensitive)
                  // operator: 'RangeInclusive', // defaults to exclusive
                },
                sortable: true,
                params:{
                  choices: question.choices
                },
                type: question.type === 'OpinionScale' || question.type === 'Rating' ? FieldType.number : FieldType.string,
                minWidth: 200,
                formatter: question.type === 'Rating' ? StarFormatter : question.type === 'OpinionScale' ? RatingFormatter : question.type === 'Dropdown' || question.type === 'MultiChoice' ? Formatters.text : null,
                editor: {
                  model: question.type === 'OpinionScale' || question.type === 'Rating' ? Editors.integer : question.type === 'Dropdown' || question.type === 'MultiChoice' ? Editors.singleSelect : Editors.text,
                  placeholder: 'Enter text',
                  collection: question.type === 'Dropdown' || question.type === 'MultiChoice' ? question.choices.map((choice)=>{
                    return {
                      value:choice.txt,
                      label:choice.txt
                    }
                  }) : [],
                },
                onCellChange: (e, args) => {
                  console.log(e, args, "cell change");
                }
            };
            columnArr.push(column);
        });
        populateRowData(columnArr);
        setColumnDefs(columnArr);
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
              const column = columnArr.find((columnDef) => columnDef.id == `${questionId}`);
              if (column) {
                if (response.submission[key].skipped) {
                  newRow[column.id] = "--Skipped--";
                } else if (response.submission[key].answer_choice_id) {
                  const choices = column.params.choices;
                  const choice = choices.find((choice) => choice.id === response.submission[key].answer_choice_id);
                  newRow[column.id] = choice.txt;
              }  else {
                  newRow[column.id] = response.submission[key].answer;
                }
              }
            }
            const questionNotAnswered = columnArr.filter((columnDef) => columnDef.id != 'name' && !Object.keys(response.submission).includes(`question_${columnDef.id}`));
            if (questionNotAnswered.length){
              questionNotAnswered.forEach((questionNotAnswered) => {
                newRow[questionNotAnswered.key] = '--Not Answered--';
              });
            }
          });
          newRows.push(newRow);
        });
        setRows(newRows);
        setLoading(false);
      };
      
      useEffect(() => {
        populateColumnData();
      },[]);

    console.log(columnDefs, "columndefs");
    console.log(rows, 'rows');
    return (
        <div>
            {
                loading ? (
                    <div>Loading...</div>
                ) : (
                    <SlickgridReact
                        gridId="grid1"
                        dataset={rows}
                        columnDefinitions={columnDefs}
                        gridOptions={gridOptions}
                        onReactGridCreated={
                          ()=>{
                            console.log('grid created');
                          }
                        }
                    />
                )
            }
        </div>
    );
}

export default SlickGrid;
