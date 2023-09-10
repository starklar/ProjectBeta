import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import './index.css';
import Login from './Login';
import Register from './Register';
import ConfirmRegistration from './ConfirmRegistration';
import Products from './Products';
import Checkout from './Checkout';

function App() {

    return (
    <div className="App">
        <React.StrictMode>
        <BrowserRouter>
            <Routes>
            <Route index element={<Login />} />
            <Route path="Register" element={<Register />} />
            <Route path="ConfirmRegistration" element={<ConfirmRegistration />} />
            <Route path="Products" element={<Products />} />
            <Route path="Checkout" element={<Checkout />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
    </div>
    );
}

export default App;