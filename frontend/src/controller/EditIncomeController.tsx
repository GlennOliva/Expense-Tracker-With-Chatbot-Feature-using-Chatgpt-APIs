import React, { useEffect, useState } from 'react'
import axios from "axios";
import Swal from 'sweetalert2';
import logo from '../images/gamcologo.png';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../components/Auth';

const EditIncomeController = () => {
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

  interface Income {
    incomeName: string;
    incomeAmount: string;
    incomeDate: string;
    incomeImage: File | null | string; 
    incomeDescription: string;
  }

  const [income, setIncome] = useState<Income>({
    incomeName: '',
    incomeAmount: '',
    incomeDate: '',
    incomeImage: null,
    incomeDescription: '',
  });

  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        // Retrieve user_id from local storage
        const user_id = localStorage.getItem('user_id');
  
        if (!user_id) {
          console.error('User ID not found in local storage');
          return;
        }
  
        const response = await axios.get(`http://localhost:8081/income/${user_id}/${id}`);
        const fetchedIncome = response.data;
  
        // Log the fetched expense to check if the data is correct
        console.log('Fetched Income:', fetchedIncome);
  
        // Format the date if needed
        const formattedDate = formatDate(fetchedIncome.income_date);
  
        setIncome({
          incomeName: fetchedIncome.income_name,
          incomeAmount: fetchedIncome.income_amount,
          incomeDate: formattedDate,
          incomeImage: fetchedIncome.income_image || null,
          incomeDescription: fetchedIncome.income_description,
        });
      } catch (error) {
        console.error('Error fetching income data:', error);
      }
    };
  
    fetchIncomeData();
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
    if (name === 'incomeDate') {
      const formattedDate = value as string;
      setIncome((prevIncome) => ({
        ...prevIncome,
        [name]: formattedDate,
      }));
    } else if (name === 'incomeImage') {
      const file = value as File;
      setIncome((prevIncome) => ({
        ...prevIncome,
        [name]: file,
      }));
    } else {
      setIncome((prevIncome) => ({
        ...prevIncome,
        [name]: value,
      }));
    }
  };
  
  const [imagePreview, setImagePreview] = useState<string | null>(
    income.incomeImage && typeof income.incomeImage === 'string'
      ? `http://localhost:8081/images/${encodeURIComponent(income.incomeImage)}`
      : null
  );


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
  
    // Always update the expense with the new file, even if it's null
    setIncome((prevIncome) => ({ ...prevIncome, incomeImage: file }));
  
    // Update image preview immediately if a new file is selected
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  

  const handleEditIncome = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('income_name', income.incomeName);
    formData.append('income_amount', income.incomeAmount);
    formData.append('income_date', income.incomeDate);
  
    if (income.incomeImage instanceof File) {
      formData.append('income_image', income.incomeImage, income.incomeImage.name);
    }
  
    formData.append('income_description', income.incomeDescription);
  
    try {
      const updatedIncome = await axios.put(`http://localhost:8081/income/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      Swal.fire({
        icon: 'success',
        title: 'Income Updated',
        text: 'The income has been updated successfully!',
      }).then(() => {
        console.log('Updated income:', updatedIncome.data);
        navigate('/income');
      });
    } catch (error) {
      console.error('Error updating income:', error);
  
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error updating the income. Please try again.',
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
    <p className="font-weight-bold">Edit Income</p>
  </div>

  <form className="p-4 shadow rounded bg-light" onSubmit={handleEditIncome}>



<div className="mb-3">
  <h1 style={{ fontSize: '16px', padding: '10px' }}>Income Old image</h1>
  {income.incomeImage && typeof income.incomeImage === 'string' ? (
    <img
      src={`http://localhost:8081/images/${encodeURIComponent(income.incomeImage)}`}
      alt="Expense"
      style={{ maxWidth: '130px' }}
    />
  ) : null}
</div>

<div className="mb-3">
  <label htmlFor="incomeName" className="form-label">
    Income Name New
  </label>
  <input
    type="text"
    className="form-control"
    id="incomeName"
    placeholder="Enter Income name"
    value={income.incomeName || ''}
    onChange={(e) => handleInputChange('incomeName', e.target.value)}
  />
</div>

<div className="mb-3">
  <label htmlFor="incomeAmount" className="form-label">
    Income Amount New
  </label>
  <div className="input-group">
    <span className="input-group-text">₱</span>
    <input
      type="number"
      className="form-control"
      id="incomeAmount"
      placeholder="Enter income amount"
      value={income.incomeAmount || ''}
      onChange={(e) => handleInputChange('incomeAmount', e.target.value)}
    />
  </div>
</div>

<div className="mb-3">
  <label htmlFor="incomeDate" className="form-label">
    Income Date New
  </label>
  <input
    type="date"
    className="form-control"
    id="incomeDate"
    placeholder="Select income date"
    value={income.incomeDate || ''}
    onChange={(e) => handleInputChange('incomeDate', e.target.value)}
  />
</div>

<div className="mb-3">
        <label htmlFor="incomeImage" className="form-label">
          Income Image New
        </label>
        <input
          type="file"
          className="form-control"
          id="incomeImage"
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
  <label htmlFor="incomeDescription" className="form-label">
    Income Description New
  </label>
  <textarea
    className="form-control"
    id="incomeDescription"
    rows={5}
    placeholder="Enter income description"
    value={income.incomeDescription || ''}
    onChange={(e) => handleInputChange('incomeDescription', e.target.value)}
  ></textarea>
</div>

    <button type="submit" className="btn btn-success">
      Edit Income
    </button>
  </form>
</main>
{/* <!-- End Main --> */}

</div>





    </div>
    
  )
}

export default EditIncomeController
