import React, { useEffect, useState } from 'react'
import axios from "axios";
import Swal from 'sweetalert2';
import logo from '../images/gamcologo.png';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../components/Auth';

const EditBudgetController = () => {

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

  interface Budget {
    budgetName: string;
    budgetAmount: string;
    budgetDate: string;
    budgetImage: File | null | string; 
    budgetDescription: string;
  }

  const [budget, setBudget] = useState<Budget>({
    budgetName: '',
    budgetAmount: '',
    budgetDate: '',
    budgetImage: null,
    budgetDescription: '',
  });

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        // Retrieve user_id from local storage
        const user_id = localStorage.getItem('user_id');
  
        if (!user_id) {
          console.error('User ID not found in local storage');
          return;
        }
  
        const response = await axios.get(`http://localhost:8081/budget/${user_id}/${id}`);
        const fetchedBudget = response.data;
  
        // Log the fetched expense to check if the data is correct
        console.log('Fetched Budget:', fetchedBudget);
  
        // Format the date if needed
        const formattedDate = formatDate(fetchedBudget.budget_date);
  
        setBudget({
          budgetName: fetchedBudget.budget_name,
          budgetAmount: fetchedBudget.budget_amount,
          budgetDate: formattedDate,
          budgetImage: fetchedBudget.budget_image || null,
          budgetDescription: fetchedBudget.budget_description,
        });
      } catch (error) {
        console.error('Error fetching budget data:', error);
      }
    };
  
    fetchBudgetData();
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
    if (name === 'budgetDate') {
      const formattedDate = value as string;
      setBudget((prevBudget) => ({
        ...prevBudget,
        [name]: formattedDate,
      }));
    } else if (name === 'budgetImage') {
      const file = value as File;
      setBudget((prevBudget) => ({
        ...prevBudget,
        [name]: file,
      }));
    } else {
      setBudget((prevBudget) => ({
        ...prevBudget,
        [name]: value,
      }));
    }
  };
  
  const [imagePreview, setImagePreview] = useState<string | null>(
    budget.budgetImage && typeof budget.budgetImage === 'string'
      ? `http://localhost:8081/images/${encodeURIComponent(budget.budgetImage)}`
      : null
  );


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
  
    // Always update the expense with the new file, even if it's null
    setBudget((prevBudget) => ({ ...prevBudget, budgetImage: file }));
  
    // Update image preview immediately if a new file is selected
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  

  const handleEditBudget = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('budget_name', budget.budgetName);
    formData.append('budget_amount', budget.budgetAmount);
    formData.append('budget_date', budget.budgetDate);
  
    if (budget.budgetImage instanceof File) {
      formData.append('budget_image', budget.budgetImage, budget.budgetImage.name);
    }
  
    formData.append('budget_description', budget.budgetDescription);
  
    try {
      const updatedBudget = await axios.put(`http://localhost:8081/budget/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      Swal.fire({
        icon: 'success',
        title: 'Budget Updated',
        text: 'The budget has been updated successfully!',
      }).then(() => {
        console.log('Updated budget:', updatedBudget.data);
        navigate('/budget');
      });
    } catch (error) {
      console.error('Error updating budget:', error);
  
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error updating the budget. Please try again.',
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
        <span className="material-icons-outlined">trending_up</span> Investments
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
    <p className="font-weight-bold">Edit Budget</p>
  </div>

  <form className="p-4 shadow rounded bg-light" onSubmit={handleEditBudget}>



<div className="mb-3">
  <h1 style={{ fontSize: '16px', padding: '10px' }}>Budget Old image</h1>
  {budget.budgetImage && typeof budget.budgetImage === 'string' ? (
    <img
      src={`http://localhost:8081/images/${encodeURIComponent(budget.budgetImage)}`}
      alt="Expense"
      style={{ maxWidth: '130px' }}
    />
  ) : null}
</div>

<div className="mb-3">
  <label htmlFor="budgetName" className="form-label">
    Budget Name New
  </label>
  <input
    type="text"
    className="form-control"
    id="budgetName"
    placeholder="Enter expense name"
    value={budget.budgetName || ''}
    onChange={(e) => handleInputChange('budgetName', e.target.value)}
  />
</div>

<div className="mb-3">
  <label htmlFor="budgetAmount" className="form-label">
    Budget Amount New
  </label>
  <div className="input-group">
    <span className="input-group-text">₱</span>
    <input
      type="number"
      className="form-control"
      id="budgetAmount"
      placeholder="Enter budget amount"
      value={budget.budgetAmount || ''}
      onChange={(e) => handleInputChange('budgetAmount', e.target.value)}
    />
  </div>
</div>

<div className="mb-3">
  <label htmlFor="budgetDate" className="form-label">
    Budget Date New
  </label>
  <input
    type="date"
    className="form-control"
    id="budgetDate"
    placeholder="Select budget date"
    value={budget.budgetDate || ''}
    onChange={(e) => handleInputChange('budgetDate', e.target.value)}
  />
</div>

<div className="mb-3">
        <label htmlFor="budgetImage" className="form-label">
          Budget Image New
        </label>
        <input
          type="file"
          className="form-control"
          id="budgetImage"
          accept="image/*"
          onChange={handleImageChange}
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Income"
            style={{ maxWidth: '130px', marginTop: '10px' }}
          />
        )}
      </div>

<div className="mb-3">
  <label htmlFor="budgetDescription" className="form-label">
    Budget Description New
  </label>
  <textarea
    className="form-control"
    id="budgetDescription"
    rows={5}
    placeholder="Enter budget description"
    value={budget.budgetDescription || ''}
    onChange={(e) => handleInputChange('budgetDescription', e.target.value)}
  ></textarea>
</div>

    <button type="submit" className="btn btn-success">
      Edit Budget
    </button>
  </form>
</main>
{/* <!-- End Main --> */}

</div>





    </div>
    
  )
}

export default EditBudgetController
