import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const PastOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token'); 
      if (!token) {
        throw new Error("Token not found. Please log in.");
      }

      const response = await axios.get('http://localhost:8080/order/myorders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
      setOrders(response.data.orders);
      setLoading(false);
    } catch (error) {
      console.error("There was an error fetching the orders!", error);
      setError(error.response ? error.response.data.message : error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-600">Error loading orders: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Past Orders</h2>
      <ul className="divide-y divide-gray-200">
        {orders.map(order => (
          <li key={order._id} className="py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><strong>Order ID:</strong> {order._id}</div>
              <div><strong>Order Date:</strong> {format(new Date(order.createdAt), 'MMMM dd, yyyy')}</div>
              <div><strong>Total Amount:</strong> ${order.totalPrice}</div>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold">Order Items:</h3>
              <ul className="mt-2 space-y-2">
                {order.orderItems.map(item => (
                  <li key={item._id} className="border p-2 rounded-md">
                    <div><strong>Product Name:</strong> {item.name}</div>
                    <div><img src={item.image} alt="productImage"/></div>
                    <div><strong>Quantity:</strong> {item.quantity}</div>
                    <div><strong>Price:</strong> ${item.price}</div>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PastOrders;
