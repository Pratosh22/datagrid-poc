import {
  PivotViewComponent,
  PivotFieldListComponent,
  Inject,
  CalculatedField,
  PivotFieldList,
  FieldList,
  GroupingBar,
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
    filters: [],
    rows: [
      { name: "question_dropdown", caption: "Select any of the below" },
      { name: "question_opinionScale", caption: "What is your rating out of 10?" },
      { name: "question_textInput", caption: "What is your opinion?" },
    ],
    values: [
      { name: "question_rating", caption: "What is your rating out of 5?" },
      { name: "question_opinionScale", caption: "What is your rating out of 10?" },
    ],
  };
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
      >
        <Inject services={[GroupingBar,PivotFieldList]}/>
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
