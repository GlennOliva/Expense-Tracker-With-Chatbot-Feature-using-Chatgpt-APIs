import React, { FormEvent, useState } from 'react'
import axios from "axios";
import Swal from 'sweetalert2';
import logo from '../images/gamcologo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Auth';

const AddInvestmentcontroller = () => {

  const { getUserEmail } = useAuth();
  const userEmail = getUserEmail();
  const navigate = useNavigate();
  const handleLogout = () =>{
      navigate('/login')
  }

const [sidebarOpen, setSidebarOpen] = useState(false);

const openSidebar = () => {
 setSidebarOpen(true);
};

const closeSidebar = () => {
 setSidebarOpen(false);
};


const [investment_name, setInvestmentName] = useState("");
const [investment_amount, setInvestmentAmount] = useState("");
const [investment_date, setInvestmentDate] = useState("");
const [investment_image, setInvestmentImage] = useState<File | null>(null);
const [investment_description, setInvestmentDescription] = useState("");

const handleAddInvestment = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    // Retrieve user_id from localStorage
    const user_id = localStorage.getItem('user_id');

    console.log('Retrieved user_id from localStorage:', user_id);

    if (!user_id) {
      // Handle the case where user_id is not available
      console.error('User_id not found in localStorage.');
      return;
    }

    console.log('User_id before FormData:', user_id);

    const formData = new FormData();
    formData.append('investment_name', investment_name);
    formData.append('investment_amount', investment_amount);
    formData.append('investment_date', investment_date);
    formData.append('user_id', user_id); // Make sure user_id is included in the form data
    formData.append('investment_description', investment_description);

    // Check if there's a file before appending it to FormData
    if (investment_image) {
      formData.append('investment_image', investment_image);
    }

    console.log('FormData:', formData);

    const response = await axios.post('http://localhost:8081/addinvestment', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Response:', response);

    Swal.fire({
      icon: 'success',
      title: 'Investment Added',
      text: 'The investment has been added successfully!',
    }).then(() => {
      navigate('/investment');
    });
  } catch (error) {
    console.error('Error adding investment:', error);

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'There was an error adding the investment. Please try again.',
    });
  }
};


 
  return (
    <div>
       <div className="grid-container">

{/* <!-- Header --> */}
<header className="header">
<div className="menu-icon" onClick={openSidebar}>
    <span className="material-icons-outlined">menu</span>
  </div>
  <div className="header-left">
    
  </div>
  <div className="header-right">
    <h1 style={{fontSize: '16px'}}>email: {userEmail}</h1>
  </div>
</header>
{/* <!-- End Header -->

<!-- Sidebar --> */}
<aside id="sidebar" className={sidebarOpen ? 'sidebar-responsive' : ''}>
  <div className="sidebar-title">
    <div className="sidebar-brand">
    <div className="sidebar-brand">
  <img src={logo} style={{width: '105%' }} alt="GAMCO Logo" />
</div>
    </div>
    <span className="material-icons-outlined" onClick={closeSidebar}>
      close
    </span>

  </div>

  <ul className="sidebar-list">
    <li className="sidebar-list-item">
    <Link to="/dashboard">
        <span className="material-icons-outlined">dashboard</span> Dashboard
    </Link>
    </li>
    <li className="sidebar-list-item">
      <Link to="/expenses">
        <span className="material-icons-outlined">shopping_bag</span> Expenses
      </Link>
    </li>
    <li className="sidebar-list-item">
    <Link to="/income">
        <span className="material-icons-outlined">payments</span> Income
    </Link>
    </li>
    <li className="sidebar-list-item">
    <Link to="/savings">
        <span className="material-icons-outlined">credit_card</span> Savings
     </Link>
    </li>
    <li className="sidebar-list-item">
    <Link to="/budget">
        <span className="material-icons-outlined">account_balance_wallet</span> Budget
     </Link>
    </li>
    <li className="sidebar-list-item">
    <Link to="/investment">
        <span className="material-icons-outlined">trending_up</span> Investments
    </Link>
    </li>
   
    <li className="sidebar-list-item">
    <span className="material-icons-outlined" onClick={handleLogout}>logout</span> Logout
    </li>
  </ul>
</aside>
{/* <!-- End Sidebar -->

{/* Main */}
      <main className="main-container">
        <div className="main-title">
          <p className="font-weight-bold">Add Investment</p>
        </div>

        <form className="p-4 shadow rounded bg-light"  onSubmit={handleAddInvestment}>
          <div className="mb-3">
            <label htmlFor="investmentName" className="form-label">
              Investment Name
            </label>
            <input
              type="text"
              className="form-control"
              id="investmentName"
              placeholder="Enter investment name"
              value={investment_name}
              onChange={(e) => setInvestmentName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="investmentAmount" className="form-label">
              Investment Amount
            </label>
            <div className="input-group">
              <span className="input-group-text">₱</span>
              <input
                type="number"
                className="form-control"
                id="investmentAmount"
                placeholder="Enter investment amount"
                value={investment_amount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="investmentDate" className="form-label">
              Income Date
            </label>
            <input
              type="date"
              className="form-control"
              id="investmentDate"
              placeholder="Select investment date"
              value={investment_date}
              onChange={(e) => setInvestmentDate(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="investmentImage" className="form-label">
              Investment Image
            </label>
            <input
type="file"
className="form-control"
id="investmentImage"
accept="image/*"
name="investment_image"
onChange={(e) => setInvestmentImage(e.target.files ? e.target.files[0] : null)}
/>
          </div>
          <div className="mb-3">
            <label htmlFor="investmentDescription" className="form-label">
              Investment Description
            </label>
            <textarea
              className="form-control"
              id="investmentDescription"
              rows={5}
              placeholder="Enter investment description"
              value={investment_description}
              onChange={(e) => setInvestmentDescription(e.target.value)}
            ></textarea>
          </div>
          <button type="submit" className="btn btn-success">
            Add Investment
          </button>
        </form>
      </main>
      {/* End Main */}

</div>





    </div>
    
  )
}

export default AddInvestmentcontroller
