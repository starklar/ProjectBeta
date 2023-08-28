import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import './index.css';
import Login from './Login';
import Register from './Register';
import ConfirmRegistration from './ConfirmRegistration';
import Products from './Products';
import Checkout from './Checkout';
import { useState } from 'react'
import { UserProfile } from './UserProfile';

function App() {
    const items = [
        {
            id: 0,
            img: "Paper.jpg",
            name: "Sheet of Paper",
            price: 42.42,
            description: "Use to write on or make paper crafts. Very worth the price."
        },
        {
            id: 1,
            img: "Battery.jpg",
            name: "Battery",
            price: 3.00,
            description: "You give us money, you get power."
        },
        {
            id: 2,
            img: "Ruler.jpg",
            name: "Three Sided Ruler",
            price: 0.10,
            description: "Well used. But what a deal!"
        },
    ];

    return (
    <div className="App">
        <React.StrictMode>
        <BrowserRouter>
            <UserProfile.Provider value={{ items }}>
                <Routes>
                <Route index element={<Login />} />
                <Route path="Register" element={<Register />} />
                <Route path="ConfirmRegistration" element={<ConfirmRegistration />} />
                <Route path="Products" element={<Products />} />
                <Route path="Checkout" element={<Checkout />} />
                </Routes>
            </UserProfile.Provider>
        </BrowserRouter>
    </React.StrictMode>
    </div>
    );
}

export default App;