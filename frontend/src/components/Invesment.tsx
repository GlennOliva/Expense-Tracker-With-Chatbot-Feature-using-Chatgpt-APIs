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


const Investment = () => {

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
const [investments, setInvestments] = useState<Investment[]>([]);
const { getUserEmail } = useAuth();
const userEmail = getUserEmail();

interface Investment {
 id: number;
 investment_name: string;
 investment_amount: number;
 investment_date: string;
 investment_image: string; // Assuming it's a string representing the image path
 investment_description: string;
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
 axios.get(`http://localhost:8081/investment/${user_id}`)
   .then((response) => {
     setInvestments(response.data);
   })
   .catch((error) => {
     console.error('Error fetching investment:', error);
     Swal.fire({
       icon: 'error',
       title: 'Error',
       text: 'There was an error fetching investment. Please try again.',
     });
   });
}, []);





const handleDeleteInvestment = (id: number) => {
 // Show SweetAlert confirmation dialog
 Swal.fire({
   title: 'Are you sure?',
   text: 'You want to delete this investment?',
   icon: 'warning',
   showCancelButton: true,
   confirmButtonText: 'Yes, delete it!',
   cancelButtonText: 'Cancel',
 }).then((result) => {
   if (result.isConfirmed) {
     // If the user clicks "OK," proceed with the deletion
     axios.delete(`http://localhost:8081/investment/${id}`)
       .then(() => {
         // If the deletion is successful, show success message
         Swal.fire({
           icon: 'success',
           title: 'Deleted!',
           text: 'investment deleted successfully.',
         }).then(() => {
           // After showing success message, reload the page and fetch income for the specific user_id
           window.location.reload();
         })
         .catch((error) => {
           console.error('Error fetching investment:', error);
           Swal.fire({
             icon: 'error',
             title: 'Error',
             text: 'There was an error fetching investment. Please try again.',
           });
         });
       })
       .catch((error) => {
         console.error('Error deleting investment:', error);
         Swal.fire({
           icon: 'error',
           title: 'Error',
           text: 'There was an error deleting the investment. Please try again.',
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
      <p className="font-weight-bold">Investment</p>
    </div>

    <table className="table table-hover table-custom-bordered">
          <thead>
            <Link style={{ margin: '10px' }}  className="btn btn-success" to="/addinvestment">
            Add Investment &nbsp;
            <FontAwesomeIcon icon={faCirclePlus} style={{ background: 'none' }} />

            </Link>

            
  
            <tr>
              <th>ID</th>
              <th>Investment Name</th>
              <th>Investment Amount</th>
              <th>Investment Date</th>
              <th>Investment Image</th>
              <th>Investment Description</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
    {investments.map((investment, index) => (
      <tr key={investment.id}>
        <td>{index + 1}</td>
        <td>{investment.investment_name}</td>
        <td>{investment.investment_amount}</td>
        <td>{investment.investment_date}</td>
        <td>
          {investment.investment_image && (
            <img src={`http://localhost:8081/images/${investment.investment_image}`} alt="Expense" style={{ maxWidth: '130px' }} />
          )}
        </td>
        <td>{investment.investment_description}</td>
        <td>
          <Link style={{ margin: '10px' }} className="btn btn-primary" to={`/editinvestment/${investment.id}`}>
            Edit &nbsp;
            <FontAwesomeIcon icon={faPencil} />
          </Link>
          <button type="button" className="btn btn-danger" onClick={() => handleDeleteInvestment(investment.id)}>
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


export default Investment
