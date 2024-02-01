import React, { useEffect, useState } from 'react'
import axios from "axios";
import Swal from 'sweetalert2';
import logo from '../images/gamcologo.png';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../components/Auth';

const EditExpensecontroller = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getUserEmail } = useAuth();
  const userEmail = getUserEmail();
  const handleLogout = () => {
    navigate('/login');
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  interface Expense {
    expenseName: string;
    expenseAmount: string;
    expenseDate: string;
    expenseImage: File | null | string; 
    expenseDescription: string;
  }

  const [expense, setExpense] = useState<Expense>({
    expenseName: '',
    expenseAmount: '',
    expenseDate: '',
    expenseImage: null,
    expenseDescription: '',
  });

  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        // Retrieve user_id from local storage
        const user_id = localStorage.getItem('user_id');
  
        if (!user_id) {
          console.error('User ID not found in local storage');
          return;
        }
  
        const response = await axios.get(`http://localhost:8081/expenses/${user_id}/${id}`);
        const fetchedExpense = response.data;
  
        // Log the fetched expense to check if the data is correct
        console.log('Fetched Expense:', fetchedExpense);
  
        // Format the date if needed
        const formattedDate = formatDate(fetchedExpense.expense_date);
  
        setExpense((prevExpense) => ({
          ...prevExpense,
          expenseName: fetchedExpense.expense_name,
          expenseAmount: fetchedExpense.expense_amount,
          expenseDate: formattedDate,
          expenseImage: fetchedExpense.expense_image || null,
          expenseDescription: fetchedExpense.expense_description,
        }));
      } catch (error) {
        console.error('Error fetching expense data:', error);
      }
    };
  
    fetchExpenseData();
  }, [id]);
  
  
  
  // Sample function to format the date
  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  };
  
  
  

  const handleInputChange = (name: string, value: string | File | null) => {
    if (name === 'expenseDate') {
      const formattedDate = value as string;
      setExpense((prevExpense) => ({
        ...prevExpense,
        [name]: formattedDate,
      }));
    } else if (name === 'expenseImage') {
      const file = value as File;
      setExpense((prevExpense) => ({
        ...prevExpense,
        [name]: file,
      }));
    } else {
      setExpense((prevExpense) => ({
        ...prevExpense,
        [name]: value,
      }));
    }
  };
  
  const [imagePreview, setImagePreview] = useState<string | null>(
    expense.expenseImage && typeof expense.expenseImage === 'string'
      ? `http://localhost:8081/images/${encodeURIComponent(expense.expenseImage)}`
      : null
  );


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
  
    // Always update the expense with the new file, even if it's null
    setExpense((prevExpense) => ({ ...prevExpense, expenseImage: file }));
  
    // Update image preview immediately if a new file is selected
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  

  const handleEditExpense = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('expense_name', expense.expenseName);
    formData.append('expense_amount', expense.expenseAmount);
    formData.append('expense_date', expense.expenseDate);
  
    if (expense.expenseImage instanceof File) {
      formData.append('expense_image', expense.expenseImage, expense.expenseImage.name);
    }
  
    formData.append('expense_description', expense.expenseDescription);
  
    try {
      const updatedExpense = await axios.put(`http://localhost:8081/expenses/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      Swal.fire({
        icon: 'success',
        title: 'Expense Updated',
        text: 'The expense has been updated successfully!',
      }).then(() => {
        console.log('Updated Expense:', updatedExpense.data);
        navigate('/expenses');
      });
    } catch (error) {
      console.error('Error updating expense:', error);
  
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error updating the expense. Please try again.',
      });
    }
  
    // Clear the image preview after submitting the form
    setImagePreview(null);
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

<!-- Main --> */}
  
  <main className="main-container">
  <div className="main-title">
    <p className="font-weight-bold">Edit Expenses</p>
  </div>

  <form className="p-4 shadow rounded bg-light" onSubmit={handleEditExpense}>



<div className="mb-3">
  <h1 style={{ fontSize: '16px', padding: '10px' }}>Expense Old image</h1>
  {expense.expenseImage && typeof expense.expenseImage === 'string' ? (
    <img
      src={`http://localhost:8081/images/${encodeURIComponent(expense.expenseImage)}`}
      alt="Expense"
      style={{ maxWidth: '130px' }}
    />
  ) : null}
</div>

<div className="mb-3">
  <label htmlFor="expenseName" className="form-label">
    Expense Name New
  </label>
  <input
    type="text"
    className="form-control"
    id="expenseName"
    placeholder="Enter expense name"
    value={expense.expenseName || ''}
    onChange={(e) => handleInputChange('expenseName', e.target.value)}
  />
</div>

<div className="mb-3">
  <label htmlFor="expenseAmount" className="form-label">
    Expense Amount New
  </label>
  <div className="input-group">
    <span className="input-group-text">₱</span>
    <input
      type="number"
      className="form-control"
      id="expenseAmount"
      placeholder="Enter expense amount"
      value={expense.expenseAmount || ''}
      onChange={(e) => handleInputChange('expenseAmount', e.target.value)}
    />
  </div>
</div>

<div className="mb-3">
  <label htmlFor="expenseDate" className="form-label">
    Expense Date New
  </label>
  <input
    type="date"
    className="form-control"
    id="expenseDate"
    placeholder="Select expense date"
    value={expense.expenseDate || ''}
    onChange={(e) => handleInputChange('expenseDate', e.target.value)}
  />
</div>

<div className="mb-3">
        <label htmlFor="expenseImage" className="form-label">
          Expense Image New
        </label>
        <input
          type="file"
          className="form-control"
          id="expenseImage"
          accept="image/*"
          onChange={handleImageChange}
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Expense"
            style={{ maxWidth: '130px', marginTop: '10px' }}
          />
        )}
      </div>

<div className="mb-3">
  <label htmlFor="expenseDescription" className="form-label">
    Expense Description New
  </label>
  <textarea
    className="form-control"
    id="expenseDescription"
    rows={5}
    placeholder="Enter expense description"
    value={expense.expenseDescription || ''}
    onChange={(e) => handleInputChange('expenseDescription', e.target.value)}
  ></textarea>
</div>

    <button type="submit" className="btn btn-success">
      Edit Expense
    </button>
  </form>
</main>
{/* <!-- End Main --> */}

</div>





    </div>
    
  )
}

export default EditExpensecontroller
