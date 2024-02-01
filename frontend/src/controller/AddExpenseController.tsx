import  { FormEvent, useState } from 'react'
import axios from "axios";
import Swal from 'sweetalert2';
import logo from '../images/gamcologo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Auth';



const AddExpensecontroller = () => {
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


 const [expense_name, setExpenseName] = useState("");
const [expense_amount, setExpenseAmount] = useState("");
const [expense_date, setExpenseDate] = useState("");
const [expense_image, setExpenseImage] = useState<File | null>(null);
const [expense_description, setExpenseDescription] = useState("");

const handleAddExpenses = async (e: FormEvent<HTMLFormElement>) => {
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
    formData.append('expense_name', expense_name);
    formData.append('expense_amount', expense_amount);
    formData.append('expense_date', expense_date);
    formData.append('user_id', user_id); // Make sure user_id is included in the form data
    formData.append('expense_description', expense_description);

    // Check if there's a file before appending it to FormData
    if (expense_image) {
      formData.append('expense_image', expense_image);
    }

    console.log('FormData:', formData);

    const response = await axios.post('http://localhost:8081/addexpense', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Response:', response);

    Swal.fire({
      icon: 'success',
      title: 'Expense Added',
      text: 'The expense has been added successfully!',
    }).then(() => {
      navigate('/expenses');
    });
  } catch (error) {
    console.error('Error adding expense:', error);

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'There was an error adding the expense. Please try again.',
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
            <p className="font-weight-bold">Add Expenses</p>
          </div>

          <form className="p-4 shadow rounded bg-light"  onSubmit={handleAddExpenses}>
            <div className="mb-3">
              <label htmlFor="expenseName" className="form-label">
                Expense Name
              </label>
              <input
                type="text"
                className="form-control"
                id="expenseName"
                placeholder="Enter expense name"
                value={expense_name}
                onChange={(e) => setExpenseName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="expenseAmount" className="form-label">
                Expense Amount
              </label>
              <div className="input-group">
                <span className="input-group-text">₱</span>
                <input
                  type="number"
                  className="form-control"
                  id="expenseAmount"
                  placeholder="Enter expense amount"
                  value={expense_amount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="expenseDate" className="form-label">
                Expense Date
              </label>
              <input
                type="date"
                className="form-control"
                id="expenseDate"
                placeholder="Select expense date"
                value={expense_date}
                onChange={(e) => setExpenseDate(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="expenseImage" className="form-label">
                Expense Image
              </label>
              <input
  type="file"
  className="form-control"
  id="expenseImage"
  accept="image/*"
  name="expense_image"
  onChange={(e) => setExpenseImage(e.target.files ? e.target.files[0] : null)}
/>
            </div>
            <div className="mb-3">
              <label htmlFor="expenseDescription" className="form-label">
                Expense Description
              </label>
              <textarea
                className="form-control"
                id="expenseDescription"
                rows={5}
                placeholder="Enter expense description"
                value={expense_description}
                onChange={(e) => setExpenseDescription(e.target.value)}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-success">
              Add Expense
            </button>
          </form>
        </main>
        {/* End Main */}

</div>





    </div>
    
  )
}

export default AddExpensecontroller
