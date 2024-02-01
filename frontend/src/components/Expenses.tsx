import  { useEffect, useState } from 'react'
//import { useNavigate } from "react-router-dom";
import '../css/styles.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import logo from '../images/gamcologo.png';
import { Link, useNavigate} from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import{
  faTrash,
  faPencil,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from './Auth';


const Expenses = () => {
 
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
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const { getUserEmail } = useAuth();
  const userEmail = getUserEmail();

  interface Expense {
    id: number;
    expense_name: string;
    expense_amount: number;
    expense_date: string;
    expense_image: string; // Assuming it's a string representing the image path
    expense_description: string;
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
    axios.get(`http://localhost:8081/expenses/${user_id}`)
      .then((response) => {
        setExpenses(response.data);
      })
      .catch((error) => {
        console.error('Error fetching expenses:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error fetching expenses. Please try again.',
        });
      });
  }, []);
  
  
  


  const handleDeleteExpense = (id: number) => {
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
        axios.delete(`http://localhost:8081/expenses/${id}`)
          .then(() => {
            // If the deletion is successful, show success message
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Expense deleted successfully.',
            }).then(() => {
              // After showing success message, reload the page and fetch expenses for the specific user_id
              window.location.reload();
            })
            .catch((error) => {
              console.error('Error fetching expenses:', error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'There was an error fetching expenses. Please try again.',
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
        <p className="font-weight-bold">Expenses</p>
      </div>

      <table className="table table-hover table-custom-bordered">
            <thead>
              <Link style={{ margin: '10px' }}  className="btn btn-success" to="/addexpense">
              Add Expense &nbsp;
              <FontAwesomeIcon icon={faCirclePlus} style={{ background: 'none' }} />

              </Link>

              
    
              <tr>
                <th>ID</th>
                <th>Expense Name</th>
                <th>Expense Amount</th>
                <th>Expense Date</th>
                <th>Expense Image</th>
                <th>Expense Description</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
      {expenses.map((expense, index) => (
        <tr key={expense.id}>
          <td>{index + 1}</td>
          <td>{expense.expense_name}</td>
          <td>{expense.expense_amount}</td>
          <td>{expense.expense_date}</td>
          <td>
            {expense.expense_image && (
              <img src={`http://localhost:8081/images/${expense.expense_image}`} alt="Expense" style={{ maxWidth: '130px' }} />
            )}
          </td>
          <td>{expense.expense_description}</td>
          <td>
            <Link style={{ margin: '10px' }} className="btn btn-primary" to={`/editexpense/${expense.id}`}>
              Edit &nbsp;
              <FontAwesomeIcon icon={faPencil} />
            </Link>
            <button type="button" className="btn btn-danger" onClick={() => handleDeleteExpense(expense.id)}>
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


export default Expenses
