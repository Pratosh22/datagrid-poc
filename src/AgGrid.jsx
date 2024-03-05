'use strict';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-enterprise';
import { AgGridReact } from 'ag-grid-react';
import React, {
  StrictMode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const GridExample = () => {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    { field: 'country', rowGroup: true, enableRowGroup: true },
    { field: 'year', rowGroup: true, enableRowGroup: true, enablePivot: true },
    { field: 'date' },
    { field: 'sport' },
    { field: 'gold', aggFunc: 'sum' },
    { field: 'silver', aggFunc: 'sum' },
    { field: 'bronze', aggFunc: 'sum' },
  ]);
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

  const onGridReady = useCallback((params) => {
    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
      .then((resp) => resp.json())
      .then((data) => setRowData(data));
  }, []);

  const onBtNormal = useCallback(() => {
    gridRef.current.api.setGridOption('pivotMode', false);
    gridRef.current.api.applyColumnState({
      state: [
        { colId: 'country', rowGroup: true },
        { colId: 'year', rowGroup: true },
      ],
      defaultState: {
        pivot: false,
        rowGroup: false,
      },
    });
  }, []);

  const onBtPivotMode = useCallback(() => {
    gridRef.current.api.setGridOption('pivotMode', true);
    gridRef.current.api.applyColumnState({
      state: [
        { colId: 'country', rowGroup: true },
        { colId: 'year', rowGroup: true },
      ],
      defaultState: {
        pivot: false,
        rowGroup: false,
      },
    });
  }, []);

  const onBtFullPivot = useCallback(() => {
    gridRef.current.api.setGridOption('pivotMode', true);
    gridRef.current.api.applyColumnState({
      state: [
        { colId: 'country', rowGroup: true },
        { colId: 'year', pivot: true },
      ],
      defaultState: {
        pivot: false,
        rowGroup: false,
      },
    });
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={{ marginBottom: '5px' }}>
          <button onClick={onBtNormal}>1 - Grouping Active</button>
          <button onClick={onBtPivotMode}>
            2 - Grouping Active with Pivot Mode
          </button>
          <button onClick={onBtFullPivot}>
            3 - Grouping Active with Pivot Mode and Pivot Active
          </button>
        </div>

        <div
          style={gridStyle}
          className={
            "ag-theme-quartz-dark"
          }
        >
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            sideBar={'columns'}
            onGridReady={onGridReady}
          />
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>
);
