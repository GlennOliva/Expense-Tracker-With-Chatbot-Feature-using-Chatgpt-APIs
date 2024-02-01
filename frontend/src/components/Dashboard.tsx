import  { useEffect, useState } from 'react'
//import { useNavigate } from "react-router-dom";
import '../css/styles.css';
import ApexCharts from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import logo from '../images/gamcologo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './Auth';


const Dashboard = () => {


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

  interface Expense {
    expense_name: string;
    total_amount: number;
  }


  interface Income {
    income_name: string;
    total_amount: number;
  }

  interface Budget {
    budget_name: string;
    total_amount: number;
  }

  interface Investment {
    investment_name: string;
    total_amount: number;
  }
  
  const [topExpenses, setTopExpenses] = useState<Expense[]>([]);
  const [topIncome, setTopIncome] = useState<Income[]>([]);
  const [topBudget, setTopBudget] = useState<Budget[]>([]);
  const [topInvestment, setTopInvestment] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  const [totalIncome, setTotalIncome] = useState(0);
const [totalExpenses, setTotalExpenses] = useState(0);
const [totalSavings, setTotalSavings] = useState(0);
const [totalBudget, setTotalBudgets] = useState(0);
  useEffect(() => {
    const user_id = localStorage.getItem('user_id');

    if (!user_id) {
      console.error('User_id not found in localStorage.');
      return;
    }

    fetch(`http://localhost:8081/topexpenses/${user_id}`)
      .then(response => response.json())
      .then(data => setTopExpenses(data.topExpenses))
      .catch(error => console.error('Error fetching top expenses:', error))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Update chart options with the fetched data
  const barChartOptions = {
    series: [
      {
        name: 'Expense Amount',
        data: topExpenses.map(expense => expense.total_amount),
      },
    ],
    chart: {
      type: 'bar' as const, // Specify the type as 'bar'
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: ['#246dec', '#cc3c43', '#367952', '#f5b74f', '#4f35a1'], // Add more colors as needed
    plotOptions: {
      bar: {
        distributed: true,
        borderRadius: 4,
        horizontal: false,
        columnWidth: '40%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: topExpenses.map(expense => expense.expense_name),
    },
    yaxis: {
      title: {
        text: 'Total Expense Amount',
      },
    },
  };



  useEffect(() => {
    const user_id = localStorage.getItem('user_id');
  
    if (!user_id) {
      console.error('User_id not found in localStorage.');
      return;
    }
  
    fetch(`http://localhost:8081/topinvestment/${user_id}`)
      .then(response => response.json())
      .then(data => setTopInvestment(data.topInvestment))
      .catch(error => console.error('Error fetching top investment:', error))
      .finally(() => {
        setLoading(false);
      });
  }, []);
  
  // Extracting investment names and amounts
  const investmentNames = topInvestment.map(investment => investment.investment_name);
  const investmentAmounts = topInvestment.map(investment => investment.total_amount);

  // AREA CHART
  const areaChartOptions: ApexOptions = {
    series: [
      {
        name: 'Total Investment',
        data: investmentAmounts,
      },
    ],
    chart: {
      height: 350,
      type: 'area',
      toolbar: {
        show: false,
      },
    },
    colors: ['#246dec'],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      categories: investmentNames,
    },
    yaxis: {
      title: {
        text: 'Total Amount',
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
  };
  


  useEffect(() => {
    const user_id = localStorage.getItem('user_id');
  
    if (!user_id) {
      console.error('User_id not found in localStorage.');
      return;
    }
  
    Promise.all([
      fetch(`http://localhost:8081/topbudget/${user_id}`).then(response => response.json()),
      fetch(`http://localhost:8081/topincome/${user_id}`).then(response => response.json())
    ])
      .then(([budgetData, incomeData]) => {
        setTopBudget(budgetData.topBuget);
        setTopIncome(incomeData.topIncome);
      })
      .catch(error => console.error('Error fetching data:', error))
      .finally(() => {
        setLoading(false);
      });
  }, []);
  
  
  // DOUGHNUT CHART
  const doughnutChartOptions: ApexOptions = {
    series: topBudget.map(budget => budget.total_amount || 0), // Ensure numeric values
    chart: {
      type: 'donut',
      height: 350,
    },
    labels: topBudget.map(budget => budget.budget_name),
    colors: ['#246dec', '#cc3c43', '#367952', '#f5b74f'],
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    tooltip: {
      fillSeriesColor: false,
    },
  };
  
  // PIE CHART
  const pieChartOptions: ApexOptions = {
    series: topIncome.map(income => income.total_amount || 0), // Ensure numeric values
    chart: {
      type: 'pie',
      height: 350,
    },
    labels: topIncome.map(income => income.income_name),
    colors: ['#246dec', '#cc3c43', '#367952', '#f5b74f'],
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    tooltip: {
      fillSeriesColor: false,
    },
  };
  





useEffect(() => {
  // Fetch total income data

  // Retrieve user_id from localStorage
  const user_id = localStorage.getItem('user_id');

  if (!user_id) {
    // Handle the case where user_id is not available
    console.error('User_id not found in localStorage.');
    return;
  }

  const fetchTotalExpenses = async () => {
    try {
      const response = await fetch(`http://localhost:8081/totalexpenses/${user_id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setTotalExpenses(data.totalExpenses);
    } catch (error) {
      console.error('Error fetching total expenses:', error);
    }
  };

  // Call the function to fetch total income
  fetchTotalExpenses();
}, []); // Empty depen

useEffect(() => {
  // Fetch total income data

  // Retrieve user_id from localStorage
  const user_id = localStorage.getItem('user_id');

  if (!user_id) {
    // Handle the case where user_id is not available
    console.error('User_id not found in localStorage.');
    return;
  }

  const fetchTotalIncome = async () => {
    try {
      const response = await fetch(`http://localhost:8081/totalincome/${user_id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setTotalIncome(data.totalIncome);
    } catch (error) {
      console.error('Error fetching total income:', error);
    }
  };

  // Call the function to fetch total income
  fetchTotalIncome();
}, []); // Empty dependency array
 // Empty dependency array ensures the effect runs only once when the component mounts



 useEffect(() => {
  // Fetch total income data

  // Retrieve user_id from localStorage
  const user_id = localStorage.getItem('user_id');

  if (!user_id) {
    // Handle the case where user_id is not available
    console.error('User_id not found in localStorage.');
    return;
  }

  const fetchTotalSavings = async () => {
    try {
      const response = await fetch(`http://localhost:8081/totalsavings/${user_id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
  
      // Access the first element of the array and then get the property
      const totalSavings = data.length > 0 ? data[0].totalSavings : 0;
  
      console.log('Total Savings Data:', totalSavings);
      setTotalSavings(totalSavings);
    } catch (error) {
      console.error('Error fetching total savings:', error);
    }
  };
  
  

  // Call the function to fetch total income
  fetchTotalSavings();
}, []); // Empty dependency array
 // Empty dependency array ensures the effect runs only once when the component mounts



 useEffect(() => {
  const user_id = localStorage.getItem('user_id');

  if (!user_id) {
    console.error('User_id not found in localStorage.');
    return;
  }

  const fetchTotalBudget = async () => {
    try {
      const response = await fetch(`http://localhost:8081/totalbudget/${user_id}`);
      console.log('Response Status:', response.status);
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log('Data from server:', data);
  
      // Access the property directly, as it is not inside an array
      const totalBudget = data.totalBudget || 0;
      console.log('Total Budget Data:', totalBudget);
  
      setTotalBudgets(totalBudget);
    } catch (error) {
      console.error('Error fetching total budget:', error);
    }
  };
  
  

  fetchTotalBudget();
}, []);
// Empty dependency array ensures the effect runs only once when the component mounts



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
    <p className="font-weight-bold">DASHBOARD</p>
  </div>

  <div className="main-cards">

  <div className="card1">
  <div className="card-inner">
    <p className="text-primary">TOTAL EXPENSES</p>
    <span className="material-icons-outlined text-blue">shopping_bag</span>
  </div>
  <span className="text-primary font-weight-bold">
    {totalExpenses.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
  </span>
</div>

<div className="card1">
  <div className="card-inner">
    <p className="text-primary">TOTAL INCOME</p>
    <span className="material-icons-outlined text-orange">payments</span>
  </div>
  <span className="text-primary font-weight-bold">
    {totalIncome.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
  </span>
</div>

<div className="card1">
  <div className="card-inner">
    <p className="text-primary">TOTAL SAVINGS</p>
    <span className="material-icons-outlined text-green">credit_card</span>
  </div>
  <span className="text-primary font-weight-bold">
    {totalSavings.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
  </span>
</div>

<div className="card1">
  <div className="card-inner">
    <p className="text-primary">TOTAL BUDGET</p>
    <span className="material-icons-outlined text-red">account_balance_wallet</span>
  </div>
  <span className="text-primary font-weight-bold">
    {totalBudget.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
  </span>
</div>

  </div>

  <div className="charts">
  <div className="charts-card">
    <p className="chart-title">Top Expenses</p>
    <ApexCharts options={barChartOptions} series={barChartOptions.series} type="bar" height={350} />
  </div>

  {topBudget.length > 0 ? (
    <div className="charts-card">
      <p className="chart-title">Top 5 Budget</p>
      <ApexCharts options={doughnutChartOptions} series={doughnutChartOptions.series} type="donut" height={350} />
    </div>
  ) : null}

  <div className="charts-card">
    <p className="chart-title">Total Investments Per Month</p>
    <ApexCharts options={areaChartOptions} series={areaChartOptions.series} type="area" height={350} />
  </div>

 

  {topIncome.length > 0 ? (
    <div className="charts-card">
      <p className="chart-title">Top 5 Income</p>
      <ApexCharts options={pieChartOptions} series={pieChartOptions.series} type="pie" height={350} />
    </div>
  ) : null}
</div>


</main>
{/* <!-- End Main --> */}

</div>





    </div>
  )
}


export default Dashboard
