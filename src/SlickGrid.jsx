import React, { useState, useEffect,useRef } from "react";
import { Formatters, SlickgridReact, Editors, FieldType, Filters, GroupTotalFormatters, Aggregators, SlickDataView, SlickGrid  } from "slickgrid-react";
import { questions, responses } from "./responses.json";
import ReactDOMServer from 'react-dom/server';
import Draggable from 'react-draggable'
import FloatingModal from "./FloatingMoadal";
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

const chartSelect = (addModal, setSelectedValues, type, setSelectedChartType) => {
  const selectedRows = document.querySelectorAll(".selected");
  const values = {};
  selectedRows.forEach((row) => {
    let value;
    // if row.innerHTML is "html" sanitize it
    if (row.childNodes[0].nodeName === "SPAN" && row.childNodes[0].getAttribute("data-rating")) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(row.innerHTML, "text/html");
      value = doc.body.textContent;
    } else if (row.childNodes[0].nodeName === "SPAN" && row.childNodes[0].getAttribute("data-stars")){
      value = row.childNodes[0].getAttribute("data-stars");
    } else{
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
  

function SlickGridR() {

    const [columnDefs, setColumnDefs] = useState([]);
    const [rows, setRows] = useState([]);
    const [selectedChartType,setSelectedChartType] = useState(null);
    const [modals, setModals] = useState([]);
    const [gridObj, setGridObj] = useState(null);
    const [dataViewObj, setDataViewObj] = useState(null);
    const [slickgrid, setSlickgrid] = useState(null);
    const addModal = (chartType, data) => {
      setModals(prevModals => [...prevModals, { chartType, data }]);
    };
  
    const removeModal = (index) => {
      setModals(prevModals => prevModals.filter((_, i) => i !== index));
    };
  
    const [loading, setLoading] = useState(true);
    const [selectedValues, setSelectedValues] = useState([]);

    const gridOptions = {
        enableAutoResize:true,
        enableCellNavigation:true,
        cellSelection:true,
        editable: true,
        rowHeight: 50,
        headerRowHeight: 30,
        enableHeaderMenu: false,
        enableGridMenu: true,
        filterTypingDebounce: 250,
        createPreHeaderPanel: true,
        showPreHeaderPanel: true,
        preHeaderPanelHeight: 70,
        gridMenu: {
            iconCssClass: "fa-solid fa-bars",
            menuWidth: 37,
            subItemChevronClass: "fa-solid fa-chevron-right",
        },
        enableExcelCopyBuffer: true,
        excelCopyBufferOptions: {
          onCopyCells: (e,args) => console.log('onCopyCells', e, args),
          onPasteCells: (e,args) => console.log('onPasteCells', e, args),
          onCopyCancelled: (e, args) => console.log('onCopyCancelled', e, args),
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
                      { option: "line-chart", title: "Line Chart", iconCssClass: "fa-solid fa-chart-line", action: () => chartSelect(addModal,setSelectedValues, 'linechart', setSelectedChartType) },
                      { option: "bar-chart", title: "Bar Chart", iconCssClass: "fa-solid fa-chart-bar", action: () => chartSelect(addModal,setSelectedValues, 'barchart', setSelectedChartType) },
                      { option: "pie-chart", title: "Pie Chart", iconCssClass: "fa-solid fa-chart-pie", action: () => chartSelect(addModal,setSelectedValues, 'piechart', setSelectedChartType) },
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
        enableFiltering: true,
        enableGrouping: true,    
        enableDraggableGrouping: true,
        draggableGrouping: {
          dropPlaceHolderText: 'Drop a column header here to group by the column',
          // groupIconCssClass: 'fa fa-outdent',
          deleteIconCssClass: 'fa fa-times',
          // onGroupChanged: (_e, args) => this.onGroupChanged(args),
          // onExtensionRegistered: (extension) => this.draggableGroupingPlugin = extension,
        }, 
      };
    const populateColumnData = () => {
        const columnArr = [];
        questions.forEach((question, idx) => {
            const column = {
                id:Math.random().toString(36).substring(7),
                field:question.id.toString(),
                filterable: true,
                excludeFromHeaderMenu: true,
                name: question.rtxt.blocks[0].text.length > 20 ? question.rtxt.blocks[0].text.substring(0, 20) + "..." : question.rtxt.blocks[0].text,
                sortable: true,
                params:{
                  choices: question.choices,
                  id:question.id,
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
                },
                filter:{
                  model: question.type === 'Dropdown' || question.type === 'MultiChoice' ? Filters.singleSelect : Filters.input,
                  collection: question.type === 'Dropdown' || question.type === 'MultiChoice' ? question.choices.map((choice)=>{
                    return {
                      value:choice.txt,
                      label:choice.txt
                    }
                  }) : [],
                },
                groupTotalsFormatter: question.type === 'Rating' ? GroupTotalFormatters.avgTotals : question.type === 'OpinionScale' ? GroupTotalFormatters.avgTotals : null,
                grouping: {
                  getter: question.id.toString(),
                  formatter: (g) => `Title: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                  aggregators: [
                    new Aggregators.Max(`${question.type === 'Rating' ? question.id.toString() : question.id.toString()}`),
                  ],
                  // aggregateCollapsed: true,
                  collapsed: true
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
              const column = columnArr.find((columnDef) => columnDef.params.id == `${questionId}`);
              if (column) {
                if (response.submission[key].skipped) {
                  newRow[column.params.id] = "--Skipped--";
                } else if (response.submission[key].answer_choice_id) {
                  const choices = column.params.choices;
                  const choice = choices.find((choice) => choice.id === response.submission[key].answer_choice_id);
                  newRow[column.params.id] = choice.txt;
              }  else {
                  newRow[column.params.id] = response.submission[key].answer;
                }
              }
            }
            const questionNotAnswered = columnArr.filter((columnDef) => columnDef.id != 'name' && !Object.keys(response.submission).includes(`question_${columnDef.params.id}`));
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

   
  const reactGridReady = (reactGridInstance) => {
    console.log("reactGridReady", reactGridInstance);
    setGridObj(reactGridInstance);
    setDataViewObj(reactGridInstance.dataView);
    setSlickgrid(reactGridInstance.slickGrid);
  };

    console.log(columnDefs, "columndefs");
    console.log(rows, 'rows');
    return (
        <div>
            {modals.map((modal, index) => (
                <Draggable key={index}>
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "white",
                            zIndex: 1000,
                        }}
                    >
                        <FloatingModal chartType={modal.chartType} data={modal.data} onClose={() => removeModal(index)} />
                    </div>
                </Draggable>
            ))}
            {loading ? (
                <div>Loading...</div>
            ) : (
                <SlickgridReact
                    gridId="grid1"
                    dataset={rows}
                    columnDefinitions={columnDefs}
                    gridOptions={gridOptions}
                    onReactGridCreated={$event => reactGridReady($event.detail)}
                    onColumnsDrag={(_e, args) => {
                        console.log("columns dragged", args);
                      } 
                    }
                    customDataView={dataViewObj}
                />
            )}
        </div>
    );
}

export default SlickGridR;
