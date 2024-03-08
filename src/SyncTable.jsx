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
import { useEffect, useState } from "react";
import { registerLicense } from "@syncfusion/ej2-base";
import { data } from "./syncResponses.json";
import { questions, responses } from "./responses.json";
function SyncTable() {
  registerLicense(
    "Ngo9BigBOggjHTQxAR8/V1NAaF1cVWhNYVBpR2Nbe05xdl9FZlZTRWYuP1ZhSXxXdkZjXX9edXZQQGJcVUQ="
  );
  let fieldObj;
  let pivotObj;
  const [dataSet, setDataSet] = useState([]);
  let toolbarOptions = ["Grid", "Chart"];

  const afterPopulate = () => {
    if (fieldObj && pivotObj) {
      fieldObj.updateView(pivotObj);
    }
  };
  const afterPivotPopulate = () => {
    if (fieldObj && pivotObj) {
      fieldObj.update(pivotObj);
    }
  };

  const createDataSet = () => {
    console.log("responses", responses);
    console.log("questions", questions);
    // Initialize data with enough elements
    let data = new Array(responses.length).fill().map(() => ({}));

    responses.forEach((response, index) => {
      questions.forEach((question) => {
        Object.keys(response.submission).forEach((key) => {
          if (
            key.startsWith("question_") &&
            key.split("_")[1] == question.id
          ) {
            const questionId = key.split("_")[1];
            const submission = response.submission[key] || {};
            if (submission.skipped) {
              data[index][`${question.rtxt.blocks[0].text}`] =
                "--Skipped--";
            } else if (submission.answer_choice_id) {
              const choices = question.choices || [];
              const choice = choices.find(
                (choice) => choice.id === submission.answer_choice_id
              );
              data[index][`${question.rtxt.blocks[0].text}`] =
                choice?.txt || "--No Choice Text--";
            } else {
              data[index][`${question.rtxt.blocks[0].text}`] =
                submission.answer || "--No Answer--";
            }
          }
        });
      });
    });
    console.log("data", data);
    setDataSet(data);
  };

  const dataSourceSettings = {
    // columns: [{ name: "location", caption: "Location" }],
    dataSource: dataSet,
    allowLabelFilter: true,
    allowValueFilter: true,
    expandAll: false,
    enableSorting: true,
    filters: [],
    // rows: [
    //   { name: "question_dropdown", caption: "Select any of the below" },
    //   {
    //     name: "question_opinionScale",
    //     caption: "What is your rating out of 10?",
    //   },
    //   { name: "question_textInput", caption: "What is your opinion?" },
    //   {
    //     name: "question_rating2",
    //     caption: "How would you rate our product out of 5?",
    //   },
    //   {
    //     name: "question_opinionScale2",
    //     caption: "How do we fare against our competitors?",
    //   },
    //   { name: "question_textInput2", caption: "Your feedback?" },
    //   {
    //     name: "question_dropdown2",
    //     caption: "Select the one which you like the most",
    //   },
    // ],
    // values: [
    //   { name: "question_rating", caption: "What is your rating out of 5?" },
    //   {
    //     name: "question_opinionScale",
    //     caption: "Your opinion of our product out of 10?",
    //   },
    // ],
  };

  useEffect(() => {
    createDataSet();
  }, []);

  return (
    <>
      <PivotViewComponent
        ref={(d) => (pivotObj = d)}
        id="PivotView"
        height={"100%"}
        width={"100%"}
        dataSourceSettings={dataSourceSettings}
        enginePopulated={afterPivotPopulate}
        showGroupingBar={true}
        groupingBarSettings={{
          showFieldsPanel: false,
        }}
        displayOption={{ view: "Both" }}
        showToolbar={true}
        enableValueSorting={true}
        toolbar={toolbarOptions}
        chartSettings={{ title: "Survey Analysis" }}
      >
        <Inject services={[GroupingBar, FieldList, Toolbar, PivotChart]} />
      </PivotViewComponent>
      <PivotFieldListComponent
        id="PivotFieldList"
        ref={(d) => (fieldObj = d)}
        dataSourceSettings={dataSourceSettings}
        renderMode={"Fixed"}
        enginePopulated={afterPopulate}
        enableFieldSearching={true}
      ></PivotFieldListComponent>
    </>
  );
}

export default SyncTable;
