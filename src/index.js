import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { CookiesProvider } from "react-cookie";

import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <CookiesProvider defaultSetCookies={{ path: '/' }}>
        <App />
    </CookiesProvider>
);