import React, { FormEvent, useState } from 'react'
import axios from "axios";
import Swal from 'sweetalert2';
import logo from '../images/gamcologo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Auth';

const AddBudgetcontroller = () => {

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


const [budget_name, setBudgetName] = useState("");
const [budget_amount, setBudgetAmount] = useState("");
const [budget_date, setBudgetDate] = useState("");
const [budget_image, setBudgetImage] = useState<File | null>(null);
const [budget_description, setBudgetDescription] = useState("");

const handleAddBudget = async (e: FormEvent<HTMLFormElement>) => {
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
    formData.append('budget_name', budget_name);
    formData.append('budget_amount', budget_amount);
    formData.append('budget_date', budget_date);
    formData.append('user_id', user_id); // Make sure user_id is included in the form data
    formData.append('budget_description', budget_description);

    // Check if there's a file before appending it to FormData
    if (budget_image) {
      formData.append('budget_image', budget_image);
    }

    console.log('FormData:', formData);

    const response = await axios.post('http://localhost:8081/addbudget', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Response:', response);

    Swal.fire({
      icon: 'success',
      title: 'Budget Added',
      text: 'The budget has been added successfully!',
    }).then(() => {
      navigate('/budget');
    });
  } catch (error) {
    console.error('Error adding budget:', error);

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'There was an error adding the budget. Please try again.',
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
        <span className="material-icons-outlined">trending_up</span> Invesments
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
          <p className="font-weight-bold">Add Budget</p>
        </div>

        <form className="p-4 shadow rounded bg-light"  onSubmit={handleAddBudget}>
          <div className="mb-3">
            <label htmlFor="budgetName" className="form-label">
              Budget Name
            </label>
            <input
              type="text"
              className="form-control"
              id="budgetName"
              placeholder="Enter budget name"
              value={budget_name}
              onChange={(e) => setBudgetName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="budgetAmount" className="form-label">
              Budget Amount
            </label>
            <div className="input-group">
              <span className="input-group-text">₱</span>
              <input
                type="number"
                className="form-control"
                id="budgetAmount"
                placeholder="Enter budget amount"
                value={budget_amount}
                onChange={(e) => setBudgetAmount(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="budgetDate" className="form-label">
              Budget Date
            </label>
            <input
              type="date"
              className="form-control"
              id="budgetDate"
              placeholder="Select budget date"
              value={budget_date}
              onChange={(e) => setBudgetDate(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="budgetImage" className="form-label">
              Budget Image
            </label>
            <input
type="file"
className="form-control"
id="budgetImage"
accept="image/*"
name="budget_image"
onChange={(e) => setBudgetImage(e.target.files ? e.target.files[0] : null)}
/>
          </div>
          <div className="mb-3">
            <label htmlFor="budgetDescription" className="form-label">
            Budget Description
            </label>
            <textarea
              className="form-control"
              id="budgetDescription"
              rows={5}
              placeholder="Enter income description"
              value={budget_description}
              onChange={(e) => setBudgetDescription(e.target.value)}
            ></textarea>
          </div>
          <button type="submit" className="btn btn-success">
            Add Budget
          </button>
        </form>
      </main>
      {/* End Main */}

</div>





    </div>
    
  )
}

export default AddBudgetcontroller
