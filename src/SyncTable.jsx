import {
PivotViewComponent,
PivotFieldListComponent,
Inject,
  CalculatedField,
  PivotFieldList,
  FieldList,
  GroupingBar,
  Toolbar,
  PivotChart,
} from "@syncfusion/ej2-react-pivotview";
import { registerLicense } from "@syncfusion/ej2-base";
import { data } from "./syncResponses.json";
import { questions, responses } from "./responses.json";
function SyncTable() {
  registerLicense(
    "Ngo9BigBOggjHTQxAR8/V1NAaF1cVWhNYVBpR2Nbe05xdl9FZlZTRWYuP1ZhSXxXdkZjXX9edXZQQGJcVUQ="
  );
  let fieldObj;
  let pivotObj;

  let toolbarOptions = ["Grid", "Chart"];

  const afterPopulate = () => {
    if (fieldObj && pivotObj) {
      fieldObj.updateView(pivotObj);
    }
  }
  const afterPivotPopulate = () => {
    if (fieldObj && pivotObj) {
      fieldObj.update(pivotObj);
    }
  }

  const dataSourceSettings = {
    columns: [{ name: "location", caption: "Location" }],
    dataSource: data,
    allowLabelFilter: true,
    allowValueFilter: true,
    expandAll: false,
    enableSorting: true,
    filters: [],
    rows: [
      { name: "question_dropdown", caption: "Select any of the below" },
      { name: "question_opinionScale", caption: "What is your rating out of 10?" },
      { name: "question_textInput", caption: "What is your opinion?" },
      { name : "question_rating2", caption: "How would you rate our product out of 5?" },
      { name: "question_opinionScale2", caption: "How do we fare against our competitors?" },
      { name: "question_textInput2", caption: "Your feedback?" },
      { name: "question_dropdown2", caption: "Select the one which you like the most" },
    ],
    values: [
      { name: "question_rating", caption: "What is your rating out of 5?" },
      { name: "question_opinionScale", caption: "Your opinion of our product out of 10?" },
    ],
  };
  const chartOnLoad= (args) => {
    let selectedTheme = location.hash.split("/")[1];
    selectedTheme = selectedTheme ? selectedTheme : "Material";
    args.chart.theme = (selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).
    replace(/-dark/i, "Dark");
    console.log(args);
    //stop loading indicator
    args.chart.loaded = true;
  }
  return (
    <>
      <PivotViewComponent
        ref={(d) => (pivotObj = d)}
        id="PivotView"
        height={"100%"}
        width={"100%"}
        dataSourceSettings={dataSourceSettings}
        enginePopulated={afterPivotPopulate}
        showFieldList={true}
        showGroupingBar={true}
        groupingBarSettings={{
          showFieldsPanel:false,
        }}
        displayOption={{ view: 'Both' }}
        showToolbar={true}
        enableValueSorting={true}
        toolbar={toolbarOptions}
        chartSettings={{ title: 'Survey Analysis'}}
      >
        <Inject services={[GroupingBar,PivotFieldList,Toolbar, PivotChart]}/>
      </PivotViewComponent>
      <PivotFieldListComponent
        id="PivotFieldList"
        ref={(d) => (fieldObj = d)}
        dataSourceSettings={dataSourceSettings}
        renderMode={"Fixed"}
        enginePopulated={afterPopulate}
        enableFieldSearching={true}
      >
      </PivotFieldListComponent>
    </>
  );
}

export default SyncTable;
