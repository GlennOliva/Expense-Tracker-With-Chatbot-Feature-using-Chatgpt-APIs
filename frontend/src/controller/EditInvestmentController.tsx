import React, { useEffect, useState } from 'react'
import axios from "axios";
import Swal from 'sweetalert2';
import logo from '../images/gamcologo.png';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../components/Auth';

const EditInvestmentController = () => {

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

  interface Investment {
    investmentName: string;
    investmentAmount: string;
    investmentDate: string;
    investmentImage: File | null | string; 
    investmentDescription: string;
  }

  const [investment, setInvestment] = useState<Investment>({
    investmentName: '',
    investmentAmount: '',
    investmentDate: '',
    investmentImage: null,
    investmentDescription: '',
  });

  useEffect(() => {
    const fetchInvestmentData = async () => {
      try {
        // Retrieve user_id from local storage
        const user_id = localStorage.getItem('user_id');
  
        if (!user_id) {
          console.error('User ID not found in local storage');
          return;
        }
  
        const response = await axios.get(`http://localhost:8081/investment/${user_id}/${id}`);
        const fetchedInvestment = response.data;
  
        // Log the fetched expense to check if the data is correct
        console.log('Fetched Income:', fetchedInvestment);
  
        // Format the date if needed
        const formattedDate = formatDate(fetchedInvestment.investment_date);
  
        setInvestment({
          investmentName: fetchedInvestment.investment_name,
          investmentAmount: fetchedInvestment.investment_amount,
          investmentDate: formattedDate,
          investmentImage: fetchedInvestment.investment_image || null,
          investmentDescription: fetchedInvestment.investment_description,
        });
      } catch (error) {
        console.error('Error fetching income data:', error);
      }
    };
  
    fetchInvestmentData();
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
    if (name === 'investmentDate') {
      const formattedDate = value as string;
      setInvestment((prevInvestment) => ({
        ...prevInvestment,
        [name]: formattedDate,
      }));
    } else if (name === 'investmentImage') {
      const file = value as File;
      setInvestment((prevInvestment) => ({
        ...prevInvestment,
        [name]: file,
      }));
    } else {
      setInvestment((prevInvestment) => ({
        ...prevInvestment,
        [name]: value,
      }));
    }
  };
  
  const [imagePreview, setImagePreview] = useState<string | null>(
    investment.investmentImage && typeof investment.investmentImage === 'string'
      ? `http://localhost:8081/images/${encodeURIComponent(investment.investmentImage)}`
      : null
  );


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
  
    // Always update the expense with the new file, even if it's null
    setInvestment((prevInvestment) => ({ ...prevInvestment, investmentImage: file }));
  
    // Update image preview immediately if a new file is selected
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  

  const handleEditInvestment = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('investment_name', investment.investmentName);
    formData.append('investment_amount', investment.investmentAmount);
    formData.append('investment_date', investment.investmentDate);
  
    if (investment.investmentImage instanceof File) {
      formData.append('investment_image', investment.investmentImage, investment.investmentImage.name);
    }
  
    formData.append('investment_description', investment.investmentDescription);
  
    try {
      const updatedInvestment = await axios.put(`http://localhost:8081/investment/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      Swal.fire({
        icon: 'success',
        title: 'Investment Updated',
        text: 'The investment has been updated successfully!',
      }).then(() => {
        console.log('Updated income:', updatedInvestment.data);
        navigate('/investment');
      });
    } catch (error) {
      console.error('Error updating investment:', error);
  
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error updating the investment. Please try again.',
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
    <p className="font-weight-bold">Edit Investment</p>
  </div>

  <form className="p-4 shadow rounded bg-light" onSubmit={handleEditInvestment}>



<div className="mb-3">
  <h1 style={{ fontSize: '16px', padding: '10px' }}>Investment Old image</h1>
  {investment.investmentImage && typeof investment.investmentImage === 'string' ? (
    <img
      src={`http://localhost:8081/images/${encodeURIComponent(investment.investmentImage)}`}
      alt="Investment"
      style={{ maxWidth: '130px' }}
    />
  ) : null}
</div>

<div className="mb-3">
  <label htmlFor="investmentName" className="form-label">
    Investment Name New
  </label>
  <input
    type="text"
    className="form-control"
    id="investmentName"
    placeholder="Enter Investment name"
    value={investment.investmentName || ''}
    onChange={(e) => handleInputChange('investmentName', e.target.value)}
  />
</div>

<div className="mb-3">
  <label htmlFor="investmentAmount" className="form-label">
    Investment Amount New
  </label>
  <div className="input-group">
    <span className="input-group-text">₱</span>
    <input
      type="number"
      className="form-control"
      id="investmentAmount"
      placeholder="Enter investment amount"
      value={investment.investmentAmount || ''}
      onChange={(e) => handleInputChange('investmentAmount', e.target.value)}
    />
  </div>
</div>

<div className="mb-3">
  <label htmlFor="investmentDate" className="form-label">
    Investment Date New
  </label>
  <input
    type="date"
    className="form-control"
    id="investmentDate"
    placeholder="Select investment date"
    value={investment.investmentDate || ''}
    onChange={(e) => handleInputChange('investmentDate', e.target.value)}
  />
</div>

<div className="mb-3">
        <label htmlFor="investmentImage" className="form-label">
          Investment Image New
        </label>
        <input
          type="file"
          className="form-control"
          id="investmentImage"
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
  <label htmlFor="investmentDescription" className="form-label">
    Investment Description New
  </label>
  <textarea
    className="form-control"
    id="incomeDescription"
    rows={5}
    placeholder="Enter investment description"
    value={investment.investmentDescription || ''}
    onChange={(e) => handleInputChange('investmentDescription', e.target.value)}
  ></textarea>
</div>

    <button type="submit" className="btn btn-success">
      Edit Investment
    </button>
  </form>
</main>
{/* <!-- End Main --> */}

</div>





    </div>
    
  )
}

export default EditInvestmentController
