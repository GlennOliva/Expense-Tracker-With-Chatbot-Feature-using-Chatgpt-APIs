import { Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Register from './components/Register';
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import Expenses from "./components/Expenses";
import Income from "./components/Income";
import Budget from "./components/Budget";
import Savings from "./components/Savings";
import Invesment from "./components/Invesment";
import EditExpensecontroller from "./controller/EditExpenseController";
import AddIncomeController from "./controller/AddIncomeController";
import EditIncomeController from "./controller/EditIncomeController";
import AddBudgetcontroller from "./controller/AddBudgetController";
import EditBudgetController from "./controller/EditBudgetController.tsx";
import AddInvestmentcontroller from "./controller/AddInvestmentController.tsx";
import EditInvestmentController from "./controller/EditInvestmentController.tsx";
import AddExpensecontroller from "./controller/AddExpenseController.tsx";
import Chats from "./components/Chats.tsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/chats" element={<Chats />} />
      <Route path="/register" element={<Register/>} />
      <Route path="/expenses" element={<Expenses/>} />
      <Route path="/income" element={<Income/>} />
      <Route path="/budget" element={<Budget/>} />
      <Route path="/savings" element={<Savings/>} />
      <Route path="/investment" element={<Invesment/>} />
      <Route path="/addexpense" element={<AddExpensecontroller/>} />
      <Route path="/addincome" element={<AddIncomeController/>} />
      <Route path="/addbudget" element={<AddBudgetcontroller/>} />
      <Route path="/addinvestment" element={<AddInvestmentcontroller/>} />
      <Route path="/editinvestment/:id" element={<EditInvestmentController/>} />
      <Route path="/editincome/:id" element={<EditIncomeController/>} />
      <Route path="/editbudget/:id" element={<EditBudgetController/>} />
      <Route path="/editexpense/:id" element={<EditExpensecontroller/>} />
      {/* Add more routes as needed */}
    </Routes>
   
  );
}

export default App;
