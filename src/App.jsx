import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import DataGridEx from "./DataGrid";
import SlickGrid from "./SlickGrid";

function App() {
    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <div>
                            <Link to="/datagrid">DataGrid</Link>
                            <br />
                            <Link to="/slick">SlickGrid</Link>
                        </div>
                    }
                />
                <Route path="/datagrid" element={<DataGridEx />} />
                <Route path="/slick" element={<SlickGrid />} />
            </Routes>
        </Router>
    );
}

export default App;