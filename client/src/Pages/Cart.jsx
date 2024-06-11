import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItem from "../Components/CartItem";
import { useAuth } from '../Context/AuthContext';
import { updateUserCart } from "../redux/Slices/CartSlice";
import { jwtDecode } from 'jwt-decode';
import axios from "axios";
import Spinner from "../Components/Spinner";
import CheckoutForm from "../Components/CheckoutForm";
import { Button, Typography, Box } from '@mui/material';
import { useToast } from "../Context/ToastContext";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { userLoggedIn } = useAuth();
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const {showToast}=useToast();

  const fetchCartData = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = jwtDecode(token);
      if (!user) {
        localStorage.removeItem('token');
      } else {
        try {
          const response = await axios.get("http://localhost:8080/customer/cart", {
            headers: { 'token': token }
          });
          const updatedCart = response.data.cartItems;
          dispatch(updateUserCart(updatedCart));
          showToast("success","Cart","Fetch Cart successfully");
        } catch (error) {
          console.error("Error updating user cart:", error);
          showToast("error","Cart","Error updating cart");
        } finally {
          setLoading(false);
        }
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userLoggedIn) {
      fetchCartData();
    } else {
      setLoading(false);
    }
  }, [dispatch, userLoggedIn]);

  useEffect(() => {
    if (!loading) {
      setTotalAmount(cart.reduce((acc, curr) => acc + (curr.productDetails?.price || 0), 0));
    }
  }, [cart, loading]);

  const handleFormSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      console.log(cart);
      if (token) {
        const orderItems = cart.map(item => {
          const { productDetails } = item;
          return {
            name: productDetails.name,
            price: productDetails.price,
            quantity: 1, // Assuming quantity is 1 as it's not provided in the cart object
            image: productDetails.images.url, // Assuming the first image
            product: productDetails._id,
          };
        });

        const order = {
          shippingInfo: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            pinCode: formData.pinCode,
            phoneNo: formData.phoneNo,
          },
          orderItems,
          paymentInfo: {
            id: formData.paymentId,
            status: formData.paymentStatus,
          },
          itemsPrice: totalAmount,
          taxPrice: 0, // You might want to calculate taxPrice based on your requirements
          shippingPrice: 0, // You might want to calculate shippingPrice based on your requirements
          totalPrice: totalAmount, // Assuming totalPrice is the same as totalAmount for simplicity
          paidAt: Date.now(),
          user: userLoggedIn._id, // Assuming userLoggedIn contains the user information
        };

        console.log(order);

        const response = await axios.post("https://www.myoldbookbackend.com/order/new", order, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Checkout successful:", response.data);
        showToast("success","Cart","Checkout successful");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      showToast("error","Cart",error.message);
      // Handle error, show error message to the user, etc.
    }
  };

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {userLoggedIn ? (
            cart.length > 0 ? (
              <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-center">
                <div className="w-[100%] md:w-[60%] flex flex-col p-2">
                <Typography 
                  variant="h3" 
                  component="h2" 
                  fontWeight="bold" 
                  color="green" 
                  sx={{ textAlign: 'center' }}
                >
                  Your Cart
                </Typography>
                  {cart.map((item, index) => (
                    <CartItem key={item.productDetails._id} item={item.productDetails} itemIndex={index} fetchCartData={fetchCartData} />
                  ))}
                </div>
                <div className="w-[100%] md:w-[40%] mt-5 flex flex-col">
                  <div className="flex flex-col p-5 gap-5 my-14 h-[100%] justify-between">
                    <div className="flex flex-col gap-5">
                      
                      <Typography variant="h3" component="h1" color={"green"} >Summary</Typography>
                      <Typography variant="h4" component="p" fontWeight={"bold"}>Total Items: {cart.length}</Typography>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <Typography variant="h6" component="p" fontFamily={"sans-serif"} fontWeight={"bold"} fontSize={30}>Total Amount: ${totalAmount}</Typography>
                    <Button variant="contained" color="success" onClick={() => setIsFormOpen(true)} sx={{ mt: 2,fontFamily:"sans-serif", fontSize:20,fontWeight:"bold", p:1.5}}>
                      CheckOut Now
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="min-h-[80vh] flex flex-col items-center justify-center">
            <h1 className="text-gray-700 font-semibold text-xl mb-2">Your cart is empty!</h1>
            <Link to={"/shop"}>
              <button className="uppercase bg-green-600 hover:bg-purple-50 rounded-lg text-white transition duration-300 ease-linear mt-5 border-2 border-green-600 font-semibold hover:text-green-700 p-3 px-10 tracking-wider">
                Shop Now
              </button>
            </Link>
          </div>
            )
          ) : (
            <div className="min-h-[80vh] flex flex-col items-center justify-center">
          <h1 className="text-gray-700 font-semibold text-xl mb-2">Please Login First!</h1>
          <Link to="/login">
            <button className="uppercase bg-green-600 hover:bg-purple-50 rounded-lg text-white transition duration-300 ease-linear mt-5 border-2 border-green-600 font-semibold hover:text-green-700 p-3 px-10 tracking-wider">
              Login Now
            </button>
          </Link>
        </div>
          )}
        </>
      )}
      <CheckoutForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} />
    </div>
  );
};

export default Cart;
