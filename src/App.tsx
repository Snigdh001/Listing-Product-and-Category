import React from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './component/Login';
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import User from './component/User';
import Product from './component/Product';
import Category from './component/Category';
import Header from './component/Header';

function App() {
  return (
    <div className="App">

          

        <BrowserRouter>
        <Routes>
          <Route path='/' element={<><Link  to="/login" className='btn btn-primary' >Login</Link></>}></Route>
          <Route path="/login" element={<><Login/></>}></Route>
          <Route path="/user" element={<><Header/> <User/></>}></Route>
          <Route path="/product" element={<><Header/> <Product/></>}></Route>
          <Route path="/category" element={<><Header/> <Category/></>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
  
}

export default App;
