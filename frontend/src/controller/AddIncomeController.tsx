import  { FormEvent, useState } from 'react'
import axios from "axios";
import Swal from 'sweetalert2';
import logo from '../images/gamcologo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Auth';

const AddIncomeController = () => {
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


const [income_name, setIncomeName] = useState("");
const [income_amount, setIncomeAmount] = useState("");
const [income_date, setIncomeDate] = useState("");
const [income_image, setIncomeImage] = useState<File | null>(null);
const [income_description, setIncomeDescription] = useState("");

const handleAddIncome = async (e: FormEvent<HTMLFormElement>) => {
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
    formData.append('income_name', income_name);
    formData.append('income_amount', income_amount);
    formData.append('income_date', income_date);
    formData.append('user_id', user_id); // Make sure user_id is included in the form data
    formData.append('income_description', income_description);

    // Check if there's a file before appending it to FormData
    if (income_image) {
      formData.append('income_image', income_image);
    }

    console.log('FormData:', formData);

    const response = await axios.post('http://localhost:8081/addincome', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Response:', response);

    Swal.fire({
      icon: 'success',
      title: 'Income Added',
      text: 'The income has been added successfully!',
    }).then(() => {
      navigate('/income');
    });
  } catch (error) {
    console.error('Error adding income:', error);

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'There was an error adding the income. Please try again.',
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
          <p className="font-weight-bold">Add Income</p>
        </div>

        <form className="p-4 shadow rounded bg-light"  onSubmit={handleAddIncome}>
          <div className="mb-3">
            <label htmlFor="incomeName" className="form-label">
              Income Name
            </label>
            <input
              type="text"
              className="form-control"
              id="incomeName"
              placeholder="Enter income name"
              value={income_name}
              onChange={(e) => setIncomeName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="incomeAmount" className="form-label">
              Income Amount
            </label>
            <div className="input-group">
              <span className="input-group-text">₱</span>
              <input
                type="number"
                className="form-control"
                id="incomeAmount"
                placeholder="Enter income amount"
                value={income_amount}
                onChange={(e) => setIncomeAmount(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="incomeDate" className="form-label">
              Income Date
            </label>
            <input
              type="date"
              className="form-control"
              id="incomeDate"
              placeholder="Select income date"
              value={income_date}
              onChange={(e) => setIncomeDate(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="incomeImage" className="form-label">
              Income Image
            </label>
            <input
type="file"
className="form-control"
id="incomeImage"
accept="image/*"
name="income_image"
onChange={(e) => setIncomeImage(e.target.files ? e.target.files[0] : null)}
/>
          </div>
          <div className="mb-3">
            <label htmlFor="incomeDescription" className="form-label">
              Income Description
            </label>
            <textarea
              className="form-control"
              id="incomeDescription"
              rows={5}
              placeholder="Enter income description"
              value={income_description}
              onChange={(e) => setIncomeDescription(e.target.value)}
            ></textarea>
          </div>
          <button type="submit" className="btn btn-success">
            Add Income
          </button>
        </form>
      </main>
      {/* End Main */}

</div>





  </div>
  
)
}

export default AddIncomeController
