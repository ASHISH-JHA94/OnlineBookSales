import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';

const CheckoutForm = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    pinCode: '',
    phoneNo: '',
    paymentId: '',
    paymentStatus: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2">
          Shipping Information
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Address"
            name="address"
            fullWidth
            margin="normal"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
          <TextField
            label="City"
            name="city"
            fullWidth
            margin="normal"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
          <TextField
            label="State"
            name="state"
            fullWidth
            margin="normal"
            value={formData.state}
            onChange={handleInputChange}
            required
          />
          <TextField
            label="Country"
            name="country"
            fullWidth
            margin="normal"
            value={formData.country}
            onChange={handleInputChange}
            required
          />
          <TextField
            label="Pin Code"
            name="pinCode"
            fullWidth
            margin="normal"
            type="number"
            value={formData.pinCode}
            onChange={handleInputChange}
            required
          />
          <TextField
            label="Phone Number"
            name="phoneNo"
            fullWidth
            margin="normal"
            type="number"
            value={formData.phoneNo}
            onChange={handleInputChange}
            required
          />
          <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
            Payment Information
          </Typography>
          <TextField
            label="Payment ID"
            name="paymentId"
            fullWidth
            margin="normal"
            value={formData.paymentId}
            onChange={handleInputChange}
            required
          />
          <TextField
            label="Payment Status"
            name="paymentStatus"
            fullWidth
            margin="normal"
            value={formData.paymentStatus}
            onChange={handleInputChange}
            required
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
            <Button onClick={onClose} variant="outlined" color="secondary">
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default CheckoutForm;
