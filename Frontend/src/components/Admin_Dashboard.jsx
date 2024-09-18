import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Box, Button, IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';

function Admin_Dashboard() {
  const [jobseekers, setJobseekers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [view, setView] = useState('user');
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [updatedAddress, setUpdatedAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch jobseekers data
    axios.get('http://localhost:4001/user/jobseekers')
      .then(response => setJobseekers(response.data))
      .catch(error => console.error('Error fetching jobseekers:', error));

    // Fetch companies data from /companies1
    axios.get('http://localhost:4001/user1/companies1')
      .then(response => setCompanies(response.data))
      .catch(error => console.error('Error fetching companies:', error));
  }, []);

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    if (view === 'user') {
      setUpdatedName(item.fullname || '');
      setUpdatedEmail(item.email || '');
      setUpdatedAddress(''); // Clear address field for jobseekers
    } else {
      setUpdatedName(item.company_name || '');
      setUpdatedEmail(item.company_email || '');
      setUpdatedAddress(item.company_address || ''); // Set address for companies
    }
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  const handleEdit = (event) => {
    event.preventDefault();
    const updatedItem = view === 'user'
      ? { ...selectedItem, fullname: updatedName, email: updatedEmail }
      : { ...selectedItem, company_name: updatedName, company_email: updatedEmail, company_address: updatedAddress };

    const url = view === 'user'
      ? `http://localhost:4001/user/jobseekers/${selectedItem._id}`
      : `http://localhost:4001/user1/companies1/${selectedItem._id}`;

    axios.put(url, updatedItem)
      .then(() => {
        if (view === 'user') {
          setJobseekers(jobseekers.map(item => item._id === updatedItem._id ? updatedItem : item));
        } else {
          setCompanies(companies.map(item => item._id === updatedItem._id ? updatedItem : item));
        }
        handleCloseModal();
      })
      .catch(error => console.error('Error updating item:', error));
  };

  const handleDelete = (id, type) => {
    const url = type === 'jobseeker'
      ? `http://localhost:4001/user/jobseekers/${id}`
      : `http://localhost:4001/user1/companies1/${id}`;

    axios.delete(url)
      .then(() => {
        if (type === 'jobseeker') {
          setJobseekers(jobseekers.filter(jobseeker => jobseeker._id !== id));
        } else {
          setCompanies(companies.filter(company => company._id !== id));
        }
      })
      .catch(error => console.error('Error deleting item:', error));
  };

  const handleAddAdmin = () => {
    navigate('/signup_admin');
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div
      className="flex h-screen"
      style={{
        backgroundImage: 'url(https://img.freepik.com/free-photo/blue-paint-with-shade_53876-94986.jpg?ga=GA1.1.1599778208.1716446894&semt=ais_hybrid)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
      }}
    >
      {/* Sidebar */}
      <div className="bg-gray-800 text-gray-100 w-64 flex flex-col justify-between">
        <div className="p-4">
          <h1 className="font-bold text-2xl text-white">Admin Panel</h1>
          <ul className="mt-6">
            <li
              className={`cursor-pointer ${view === 'user' ? 'text-white' : 'text-gray-300'}`}
              onClick={() => setView('user')}
            >
              User Information
            </li>
            <li
              className={`cursor-pointer ${view === 'company' ? 'text-white' : 'text-gray-300'}`}
              onClick={() => setView('company')}
            >
              Company Information
            </li>
          </ul>
        </div>

        {/* Add Admin Button */}
        <div className="p-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 w-full"
            onClick={handleAddAdmin}
          >
            Add Admin
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center border-b-2">
          <h1 className="font-bold text-2xl">Admin Dashboard</h1>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon style={{ color: 'white' }} />
          </IconButton>
        </div>

        {/* Table */}
        <div className="overflow-x-auto p-4">
          {view === 'user' && (
            <table className="table w-full">
              <thead>
                <tr className="text-white">
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobseekers.map(jobseeker => (
                  <tr key={jobseeker._id}>
                    <td>{jobseeker.fullname}</td>
                    <td>{jobseeker.email}</td>
                    <td>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenModal(jobseeker)}
                      >
                        <EditIcon style={{ color: 'white' }} />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => handleDelete(jobseeker._id, 'jobseeker')}
                      >
                        <CloseIcon style={{ color: 'white' }} />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {view === 'company' && (
            <table className="table w-full">
              <thead>
                <tr className="text-white">
                  <th>Company Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map(company => (
                  <tr key={company._id}>
                    <td>{company.company_name}</td>
                    <td>{company.company_email}</td>
                    <td>{company.company_address}</td>
                    <td>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenModal(company)}
                      >
                        <EditIcon style={{ color: 'white' }} />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => handleDelete(company._id, 'company')}
                      >
                        <CloseIcon style={{ color: 'white' }} />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal for Edit */}
      <Modal open={open} onClose={handleCloseModal}>
        <Box className="modal-content" sx={{ backgroundColor: 'white', padding: '20px', margin: 'auto', width: '300px' }}>
          <h2>Edit Information</h2>
          <form onSubmit={handleEdit}>
            <TextField
              label="Name"
              fullWidth
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Email"
              fullWidth
              value={updatedEmail}
              onChange={(e) => setUpdatedEmail(e.target.value)}
              margin="normal"
            />
            {view === 'company' && (
              <TextField
                label="Address"
                fullWidth
                value={updatedAddress}
                onChange={(e) => setUpdatedAddress(e.target.value)}
                margin="normal"
              />
            )}
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Save Changes
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default Admin_Dashboard;
