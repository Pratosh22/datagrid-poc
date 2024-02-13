/* eslint-disable react/prop-types */
import React from 'react';
import PivotTableLib from 'react-pivottable/PivotTable';
import './Pivot.css'
// import 'react-pivottable/pivottable.css';

/**
 * Shows a pivot table.
 * The data provided can be in two forms
 * - An array of array of strings where the first item is an array of strings that represent the name of each column.
 * - An array of objects
 *
 * The properties `rows`, `cols`, and `vals` will determine how the data is represented. Its content should be an array with each item being the name of a column
 *
 * ## Example Usage
 *
 * ```
 * import { PivotTable } from 'commons/Charts'
 *
 * <PivotTable
 *  data={[
 *     [
 *       'id',
 *       'Where are you living in?',
 *       'Which part of the city do you live in?',
 *       'Are you male or female?',
 *       'Are you married or single?',
 *       'value',
 *     ],
 *     ['id1', 'Kochi', 'East', 'Male', 'Married', 2000],
 *     ['id2', 'Kochi', 'West', 'Female', 'Single', 1000],
 *     ['id3', 'Kochi', 'North', 'Female', 'Married', 3000],
 *     ['id4', 'Kochi', 'South', 'Male', 'Single', 4000],
 *     ['id5', 'Chennai', 'East', 'Male', 'Married', 2030],
 *     ['id6', 'Chennai', 'West', 'Female', 'Married', 402],
 *     ['id7', 'Chennai', 'North', 'Female', 'Single', 2334],
 *     ['id8', 'Chennai', 'South', 'Male', 'Married', 5467],
 *     ['id9', 'Chennai', 'East', 'Male', 'Single', 232],
 *     ['idn', 'Chennai', 'East', 'Male', 'Single', 2323],
 *   ]}
 *   rows={[
 *     'Where are you living in?',
 *     'Which part of the city do you live in?',
 *   ]}
 *   cols={[
 *     'Are you male or female?',
 *     'Are you married or single?',
 *   ]}
 *   aggregatorName="Sum"
 *   vals={['value', 'value']}
 * />
 *
 * ```
 *
 * For supported aggregators see [https://github.com/nicolaskruchten/pivottable/wiki/Aggregators](https://github.com/nicolaskruchten/pivottable/wiki/Aggregators)
 *
 * Library documentation at [https://github.com/plotly/react-pivottable](https://github.com/plotly/react-pivottable)
 *
 * @param {Object} props
 * @param {string[][]| {[x:string]: any;}[]} props.data
 * @param {string[]} props.cols
 * @param {string[]} props.rows
 * @param {string[]} props.vals
 * @param {'Sum'|'Count'} props.aggregatorName
 * @param {React.RefObject} props.tableRef
 * @returns
 */
const PivotTable = ({
  data,
  rows = [],
  cols = [],
  vals = [],
  aggregatorName = 'Sum',
  tableRef
}) => {
  return (
    <div className="charts-pivot" ref={tableRef}>
      <PivotTableLib
        data={data}
        rows={rows}
        cols={cols}
        vals={vals}
        aggregatorName={aggregatorName}
      />
    </div>
  );
};

export default PivotTable;
