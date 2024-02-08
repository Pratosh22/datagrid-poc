import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeProvider } from '@sparrowengg/twigs-react';
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'flatpickr/dist/flatpickr.min.css';
import './index.css'
import 'multiple-select-modified/src/multiple-select.css';
import './slickgrid.scss'

ReactDOM.createRoot(document.getElementById("root")).render(
    <ThemeProvider theme={{
        fonts:{
            body: 'DM Sans, sans-serif',
        }
    }}>
        <App />
    </ThemeProvider>
);
