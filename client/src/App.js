
import "./App.css";
// import {Outlet} from "react-router-dom";
import Navbar from "./Components/NavBar/NavBar.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import Product from "./Components/Card/ProductCard.jsx";
import LoginPage from './Pages/LoginPage.jsx';
import SignUpPage from './Pages/SignUpPage.jsx';
import Cart from './Pages/Cart.jsx';
import Profile from "./Pages/Profile.jsx";

import Wishlist from './Pages/Wishlist.jsx';
import HomePage from './Pages/Home.jsx';
import Shop from "./Pages/Shop.jsx";
import Dashboard from "./Pages/Admin.jsx";
import { Toast } from "./Toast/Toast.js";

import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './Animations.css';
import PastOrders from "./Pages/Orders.jsx";



function App() {
  return (
    <>
    
    <Router>
      <div className="App">
        <Navbar/>
        <Routes>
          <Route path="/"         exact element={<HomePage/>} />
          <Route path="/shop"     exact element={<Shop/>} />
          <Route path="/shop/:id"       element={<Product/>} />
          <Route path="/login"          element={<LoginPage/>} />
          <Route path="/signup"         element={<SignUpPage/>} />
          <Route path="/wishlist"       element={<Wishlist/>} />
          <Route path="/cart"           element={<Cart/>} />
          <Route path="/orders"         element={<PastOrders/>} />
          <Route path="/profile"      element={<Profile/>}/>
          <Route path="/dashboard"    element={<Dashboard/>}/>
        </Routes>
        <Toast position="bottom-right"/>
        <Footer/>
      </div>
    </Router>
    
    </>
  );
}

export default App;
