import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import DataGridEx from "./DataGrid";
import SlickGridR from "./SlickGrid";
import SyncTable from "./syncTable";
import AgGrid from "./AgGrid";
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
                            <br />
                            <Link to="/sync">SyncTable</Link>
                            <br/>
                            <Link to="/ag-grid">AgGrid</Link>
                        </div>
                    }
                />
                <Route path="/datagrid" element={<DataGridEx />} />
                <Route path="/slick" element={<SlickGridR />} />
                <Route path="/sync" element={<SyncTable />} />
                <Route path="/ag-grid" element={<AgGrid/>} />
            </Routes>
        </Router>
    );
}

export default App;