import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import Spinner from './Spinner';

export default function Orders({ setChartData, setSummaryData }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token=localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/order/getAll',{
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
        const fetchedOrders = response.data.orders;
        
        setOrders(fetchedOrders);

        // Aggregate data for charts and summary
        const totalIncome = fetchedOrders.reduce((acc, order) => acc + order.totalPrice, 0);
        const totalSpendings = fetchedOrders.reduce((acc, order) => acc + order.shippingPrice + order.taxPrice, 0);

        setSummaryData({ totalIncome, totalSpendings });

        // Create chart data
        // console.log(fetchedOrders);
        const chartData = fetchedOrders.map(order => ({
          
          date: new Date(order.createdAt).toLocaleDateString(),
          totalPrice: order.totalPrice,
        }));

        console.log(chartData);

        setChartData(chartData);

      } catch (error) {
        console.error('Error fetching orders', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [setChartData, setSummaryData]);

  if (loading) {
    return <div><Spinner/></div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Total Price</TableCell>
            <TableCell>Order Status</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{order._id}</TableCell>
              <TableCell>{order.user?.name}</TableCell>
              <TableCell>{order.totalPrice}</TableCell>
              <TableCell>{order.orderStatus}</TableCell>
              <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                <Button variant="contained" color="primary" style={{ marginRight: '8px' }}>View</Button>
                <Button variant="contained" color="secondary" style={{ marginRight: '8px' }}>Edit</Button>
                <Button variant="contained" color="error">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}