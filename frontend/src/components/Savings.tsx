import  { useEffect, useState } from 'react'
//import { useNavigate } from "react-router-dom";
import '../css/styles.css';

import logo from '../images/gamcologo.png';
import { Link, useNavigate } from 'react-router-dom';

import axios from "axios";
import Swal from 'sweetalert2';
import { useAuth } from './Auth';


const Savings = () => {

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

  const { getUserEmail } = useAuth();
const userEmail = getUserEmail();






  interface SavingsData {
    latestExpenseId: number;
    id: number;
    userId: number;
    latestIncomeId: number;
    totalSavings: number;
  }


  const [savingsData, setSavingsData] = useState<SavingsData[]>([]);

  useEffect(() => {
    // Retrieve user_id from localStorage
    const user_id = localStorage.getItem('user_id');
  
    if (!user_id) {
      // Handle the case where user_id is not available
      console.error('User_id not found in localStorage.');
      return;
    }
  
    // Fetch savings data for the specific user_id
    axios.get(`http://localhost:8081/totalsavings/${user_id}`)
      .then((response) => {
        console.log('Server response:', response.data); // Log the response data
  
        // Check if the response.data is an array
        if (Array.isArray(response.data)) {
          // Update the state with the fetched data
          setSavingsData(response.data);
        } else {
          console.error('Invalid data format received from the server:', response.data);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Invalid data format received from the server. Please try again.',
          });
        }
      })
      .catch((error) => {
        console.error('Error fetching savings data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error fetching savings data. Please try again.',
        });
      });
  }, []);
  
  
  

  
   




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
    <p className="font-weight-bold">Savings</p>
  </div>


  <table className="table table-hover table-custom-bordered">
            <thead>

              <tr>
                <th>ID</th>
                <th>User_ Id:</th>
                <th>Expense Id:</th>
                <th>Income Id:</th>
                <th>Total Savings</th>
              </tr>
            </thead>

            <tbody>
            {savingsData !== null && savingsData.map((data, index) => (
                <tr key={data.id}>
                  <td>{index + 1}</td>
                  <td>{data.userId}</td>
                  <td>{data.latestExpenseId}</td>
                  <td>{data.latestIncomeId}</td>
                  <td>{data.totalSavings}</td>
                  
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


export default Savings
