import  { useEffect, useState } from 'react'
//import { useNavigate } from "react-router-dom";
import '../css/styles.css';

import logo from '../images/gamcologo.png';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import{
  faTrash,
  faPencil,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Swal from 'sweetalert2';
import { useAuth } from './Auth';


const Income = () => {

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


const [user_id, setUser_id] = useState<number | null>(null);
const [incomes, setIncomes] = useState<Income[]>([]);
const { getUserEmail } = useAuth();
const userEmail = getUserEmail();

interface Income {
 id: number;
 income_name: string;
 income_amount: number;
 income_date: string;
income_image: string; // Assuming it's a string representing the image path
 income_description: string;
}



useEffect(() => {


 // Retrieve user_id from localStorage
 const user_id = localStorage.getItem('user_id');

 if (!user_id) {
   // Handle the case where user_id is not available
   console.error('User_id not found in localStorage.');
   return;
 }

 // Fetch expenses data for the specific user_id
 axios.get(`http://localhost:8081/income/${user_id}`)
   .then((response) => {
     setIncomes(response.data);
   })
   .catch((error) => {
     console.error('Error fetching income:', error);
     Swal.fire({
       icon: 'error',
       title: 'Error',
       text: 'There was an error fetching income. Please try again.',
     });
   });
}, []);





const handleDeleteIncome = (id: number) => {
 // Show SweetAlert confirmation dialog
 Swal.fire({
   title: 'Are you sure?',
   text: 'You want to delete this expense?',
   icon: 'warning',
   showCancelButton: true,
   confirmButtonText: 'Yes, delete it!',
   cancelButtonText: 'Cancel',
 }).then((result) => {
   if (result.isConfirmed) {
     // If the user clicks "OK," proceed with the deletion
     axios.delete(`http://localhost:8081/income/${id}`)
       .then(() => {
         // If the deletion is successful, show success message
         Swal.fire({
           icon: 'success',
           title: 'Deleted!',
           text: 'Income deleted successfully.',
         }).then(() => {
           // After showing success message, reload the page and fetch income for the specific user_id
           window.location.reload();
         })
         .catch((error) => {
           console.error('Error fetching expenses:', error);
           Swal.fire({
             icon: 'error',
             title: 'Error',
             text: 'There was an error fetching income. Please try again.',
           });
         });
       })
       .catch((error) => {
         console.error('Error deleting expense:', error);
         Swal.fire({
           icon: 'error',
           title: 'Error',
           text: 'There was an error deleting the expense. Please try again.',
         });
       });
   }
 });
};


return (
  <div>
   
   <div className="grid-container">

{/* <!-- Header --> */}
<header className="header">
      <div className="menu-icon" onClick={openSidebar}>
        <span className="material-icons-outlined">menu</span>
      </div>
      <div className="header-left"></div>
      <div className="header-right">
        {/* Display the user's email */}
        <h1 style={{ fontSize: '16px' }}>email: {userEmail}</h1>
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
    <Link to="/chats">
        <span className="material-icons-outlined">chat</span> Chat_Support
    </Link>
    </li>
 
  <li className="sidebar-list-item">
  <span className="material-icons-outlined" onClick={handleLogout}>logout</span> Logout
  </li>
</ul>
</aside>
{/* <!-- End Sidebar -->

<!-- Main --> */}
<main className="main-container">
    <div className="main-title">
      <p className="font-weight-bold">Income</p>
    </div>

    <table className="table table-hover table-custom-bordered">
          <thead>
            <Link style={{ margin: '10px' }}  className="btn btn-success" to="/addincome">
            Add Income &nbsp;
            <FontAwesomeIcon icon={faCirclePlus} style={{ background: 'none' }} />

            </Link>

            
  
            <tr>
              <th>ID</th>
              <th>Income Name</th>
              <th>Income Amount</th>
              <th>Income Date</th>
              <th>Income Image</th>
              <th>Income Description</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
    {incomes.map((income, index) => (
      <tr key={income.id}>
        <td>{index + 1}</td>
        <td>{income.income_name}</td>
        <td>{income.income_amount}</td>
        <td>{income.income_date}</td>
        <td>
          {income.income_image && (
            <img src={`http://localhost:8081/images/${income.income_image}`} alt="Expense" style={{ maxWidth: '130px' }} />
          )}
        </td>
        <td>{income.income_description}</td>
        <td>
          <Link style={{ margin: '10px' }} className="btn btn-primary" to={`/editincome/${income.id}`}>
            Edit &nbsp;
            <FontAwesomeIcon icon={faPencil} />
          </Link>
          <button type="button" className="btn btn-danger" onClick={() => handleDeleteIncome(income.id)}>
            Delete &nbsp;
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </td>
      </tr>
    ))}
  </tbody>
        </table>


  </main>
{/* <!-- End Main --> */}

</div>





  </div>
)
}


export default Income
