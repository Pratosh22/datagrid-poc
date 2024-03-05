import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import DataGridEx from "./DataGrid";
import SlickGridR from "./SlickGrid";
import SyncTable from "./syncTable";
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
                        </div>
                    }
                />
                <Route path="/datagrid" element={<DataGridEx />} />
                <Route path="/slick" element={<SlickGridR />} />
                <Route path="/sync" element={<SyncTable />} />
            </Routes>
        </Router>
    );
}

export default App;