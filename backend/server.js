const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
  const bcrypt = require('bcrypt');
  const saltRounds = 10;
  const app = express();
const bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
const fs = require('fs');  // Add this line

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "it13-finalproject",
});

const multer = require('multer');
const path = require('path');

/// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images'); // Specify the directory where you want to store the uploaded files
  },
  filename: (req, file, cb) => {
    // Keep only the original name of the file
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });



app.get('/users', (request, response)=>{
  const sql = "SELECT * FROM users";
  db.query(sql, (error, data)=>{
      if(error) return response.json(error);
      return response.json(data);
  });
});


app.get('/', (request, response)=>{
  return response.json("The server started");
});

app.listen(8081, () => {
  console.log("listening..");
});

/**
 * 
 * CRUD EXPENSES STARTS HERE!
 */

app.post('/addexpense', upload.single('expense_image'), (req, res) => {
  const { expense_name, expense_amount, expense_date, expense_description, user_id } = req.body;


  console.log('Request Body:', req.body);
  console.log('User ID:', user_id);
  // Check for required fields
  if (!expense_name || !expense_amount || !expense_date || !user_id) {
    return res.status(400).send("Expense name, amount, date, and user ID are required");
  }

  // Check if a file was uploaded
  const expense_image = req.file ? req.file.originalname : null;

  const sql = 'INSERT INTO tbl_expenses (expense_name, expense_amount, expense_date, expense_image, expense_description, user_id) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [expense_name, expense_amount, expense_date, expense_image, expense_description, user_id];

  // Filter out null values before executing the query
  const filteredValues = values.filter(value => value !== null);

  // Check if there are non-null values to insert
  if (filteredValues.length === 0) {
    return res.status(400).send("No valid values to insert");
  }

  db.query(sql, filteredValues, (error, result) => {
    if (error) {
      console.error("Error adding expense:", error);
      return res.status(500).send("Internal Server Error. Unable to add expense");
    }

    // Send a more descriptive success message with the ID of the newly inserted expense
    res.status(201).json({ message: "Expense added successfully", expenseId: result.insertId });
  });
});


app.get('/expenses/:user_id', (req, res) => {
  const user_id = req.params.user_id;

  const getExpensesQuery = 'SELECT * FROM tbl_expenses WHERE user_id = ?';

  db.query(getExpensesQuery, [user_id], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }

    // Send the expenses data as JSON
    res.json(result);
  });
});

app.get('/expenses/:user_id/:expense_id', (req, res) => {
  const userId = req.params.user_id;
  const expenseId = req.params.expense_id;

  const getExpenseQuery = 'SELECT * FROM tbl_expenses WHERE user_id = ? AND id = ?';

  db.query(getExpenseQuery, [userId, expenseId], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }

    if (result.length === 0) {
      return res.status(404).send('Expense not found');
    }

    // Send the expense data as JSON
    res.json(result[0]);
  });
});


app.put('/expenses/:id', upload.single('expense_image'), (req, res) => {
  const expenseId = req.params.id;
  const { expense_name, expense_amount, expense_date, expense_description } = req.body;

  // Check if a file was uploaded
  const expense_image = req.file ? req.file.originalname : null;

  // Check if the expense exists before attempting to update
  const checkExpenseExistenceQuery = 'SELECT * FROM tbl_expenses WHERE id = ?';
  db.query(checkExpenseExistenceQuery, [expenseId], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }

    if (result.length === 0) {
      return res.status(404).send('Expense not found');
    }

    // Expense exists, get the current image path
    const currentImagePath = result[0].expense_image;

    // Prepare the update query
    const updateExpenseQuery = 'UPDATE tbl_expenses SET expense_name = ?, expense_amount = ?, expense_date = ?, expense_image = ?, expense_description = ? WHERE id = ?';
    const values = [expense_name, expense_amount, expense_date, expense_image, expense_description, expenseId];

    // Filter out null values before executing the query
    const filteredValues = values.filter(value => value !== null);

    // Check if there are non-null values to update
    if (filteredValues.length === 0) {
      return res.status(400).send("No valid values to update");
    }

    db.query(updateExpenseQuery, filteredValues, (updateError) => {
      if (updateError) {
        console.error(updateError);
        return res.status(500).send('Internal Server Error');
      }

      // If a new image was uploaded, delete the old image
      if (currentImagePath && expense_image) {
        const imageFilePath = path.join(__dirname, 'public', 'images', currentImagePath);
        fs.unlink(imageFilePath, (unlinkError) => {
          if (unlinkError) {
            console.error(unlinkError);
            // Handle the unlink error if needed
          }
        });
      }

      res.send('Expense Updated');
    });
  });
});


app.delete('/expenses/:id', (req, res) => {
  const expenseId = req.params.id;

  // Check if the expense exists before attempting to delete
  const checkExpenseExistenceQuery = 'SELECT * FROM tbl_expenses WHERE id = ?';
  db.query(checkExpenseExistenceQuery, [expenseId], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }

    if (result.length === 0) {
      return res.status(404).send('Expense not found');
    }

    // Expense exists, get the image path and proceed with deletion
    const imagePath = result[0].expense_image;

    const deleteExpenseQuery = 'DELETE FROM tbl_expenses WHERE id = ?';
    db.query(deleteExpenseQuery, [expenseId], (deleteError) => {
      if (deleteError) {
        console.error(deleteError);
        return res.status(500).send('Internal Server Error');
      }

      // If image path exists, delete the associated file
      if (imagePath) {
        const imageFilePath = path.join(__dirname, 'public', 'images', imagePath);
        fs.unlink(imageFilePath, (unlinkError) => {
          if (unlinkError) {
            console.error(unlinkError);
            // Handle the unlink error if needed
          }
        });
      }

      return res.send('Expense Deleted');
    });
  });
});

/**
 * CRUD EXPENSE ENDS HERE!
 */



/**
 * CRUD INCOME STARTS HERE!
 */

app.post('/addincome', upload.single('income_image'), (req, res) => {
  const { income_name, income_amount, income_date, income_description, user_id } = req.body;


  console.log('Request Body:', req.body);
  console.log('User ID:', user_id);
  // Check for required fields
  if (!income_name || !income_amount || !income_date || !user_id) {
    return res.status(400).send("Income name, amount, date, and user ID are required");
  }

  // Check if a file was uploaded
  const income_image = req.file ? req.file.originalname : null;

  const sql = 'INSERT INTO tbl_income (income_name, income_amount, income_date, income_image, income_description, user_id) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [income_name, income_amount, income_date, income_image, income_description, user_id];

  // Filter out null values before executing the query
  const filteredValues = values.filter(value => value !== null);

  // Check if there are non-null values to insert
  if (filteredValues.length === 0) {
    return res.status(400).send("No valid values to insert");
  }

  db.query(sql, filteredValues, (error, result) => {
    if (error) {
      console.error("Error adding income:", error);
      return res.status(500).send("Internal Server Error. Unable to add expense");
    }

    // Send a more descriptive success message with the ID of the newly inserted expense
    res.status(201).json({ message: "Income added successfully", incomeId: result.insertId });
  });
});


app.get('/income/:user_id', (req, res) => {
  const user_id = req.params.user_id;

  const getIncomeQuery = 'SELECT * FROM tbl_income WHERE user_id = ?';

  db.query(getIncomeQuery, [user_id], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }

    // Send the expenses data as JSON
    res.json(result);
  });
});

app.get('/income/:user_id/:income_id', (req, res) => {
  const userId = req.params.user_id;
  const incomeId = req.params.income_id;

  const getIncomeQuery = 'SELECT * FROM tbl_income WHERE user_id = ? AND id = ?';

  db.query(getIncomeQuery, [userId, incomeId], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }

    if (result.length === 0) {
      return res.status(404).send('Expense not found');
    }

    // Send the expense data as JSON
    res.json(result[0]);
  });
});


app.put('/income/:id', upload.single('income_image'), (req, res) => {
  const incomeId = req.params.id;
  const { income_name, income_amount, income_date, income_description } = req.body;

  // Check if a file was uploaded
  const income_image = req.file ? req.file.originalname : null;

  // Check if the expense exists before attempting to update
  const checkIncomeExistenceQuery = 'SELECT * FROM tbl_income WHERE id = ?';
  db.query(checkIncomeExistenceQuery, [incomeId], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }

    if (result.length === 0) {
      return res.status(404).send('Income not found');
    }

    // Expense exists, get the current image path
    const currentImagePath = result[0].income_image;

    // Prepare the update query
    const updateIncomeQuery = 'UPDATE tbl_income SET income_name = ?, income_amount = ?, income_date = ?, income_image = ?, income_description = ? WHERE id = ?';
    const values = [income_name, income_amount, income_date, income_image, income_description, incomeId];

    // Filter out null values before executing the query
    const filteredValues = values.filter(value => value !== null);

    // Check if there are non-null values to update
    if (filteredValues.length === 0) {
      return res.status(400).send("No valid values to update");
    }

    db.query(updateIncomeQuery, filteredValues, (updateError) => {
      if (updateError) {
        console.error(updateError);
        return res.status(500).send('Internal Server Error');
      }

      // If a new image was uploaded, delete the old image
      if (currentImagePath && income_image) {
        const imageFilePath = path.join(__dirname, 'public', 'images', currentImagePath);
        fs.unlink(imageFilePath, (unlinkError) => {
          if (unlinkError) {
            console.error(unlinkError);
            // Handle the unlink error if needed
          }
        });
      }

      res.send('Income Updated');
    });
  });
});


app.delete('/income/:id', (req, res) => {
  const incomeId = req.params.id;

  // Check if the expense exists before attempting to delete
  const checkIncomeExistenceQuery = 'SELECT * FROM tbl_income WHERE id = ?';
  db.query(checkIncomeExistenceQuery, [incomeId], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }

    if (result.length === 0) {
      return res.status(404).send('Expense not found');
    }

    // Expense exists, get the image path and proceed with deletion
    const imagePath = result[0].expense_image;

    const deleteIncomeQuery = 'DELETE FROM tbl_income WHERE id = ?';
    db.query(deleteIncomeQuery, [incomeId], (deleteError) => {
      if (deleteError) {
        console.error(deleteError);
        return res.status(500).send('Internal Server Error');
      }

      // If image path exists, delete the associated file
      if (imagePath) {
        const imageFilePath = path.join(__dirname, 'public', 'images', imagePath);
        fs.unlink(imageFilePath, (unlinkError) => {
          if (unlinkError) {
            console.error(unlinkError);
            // Handle the unlink error if needed
          }
        });
      }

      return res.send('Income Deleted');
    });
  });
});

/**
 * CRUD INCOME ENDS HERE!
 */



/**
 * CRUD BUDGET STARTS HERE!
 */

app.post('/addbudget', upload.single('budget_image'), (req, res) => {
  const { budget_name, budget_amount, budget_date, budget_description, user_id } = req.body;


  console.log('Request Body:', req.body);
  console.log('User ID:', user_id);
  // Check for required fields
  if (!budget_name || !budget_amount || !budget_date || !user_id) {
    return res.status(400).send("budget name, amount, date, and user ID are required");
  }

  // Check if a file was uploaded
  const budget_image = req.file ? req.file.originalname : null;

  const sql = 'INSERT INTO tbl_budget (budget_name, budget_amount, budget_date, budget_image, budget_description, user_id) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [budget_name, budget_amount, budget_date, budget_image, budget_description, user_id];

  // Filter out null values before executing the query
  const filteredValues = values.filter(value => value !== null);

  // Check if there are non-null values to insert
  if (filteredValues.length === 0) {
    return res.status(400).send("No valid values to insert");
  }

  db.query(sql, filteredValues, (error, result) => {
    if (error) {
      console.error("Error adding income:", error);
      return res.status(500).send("Internal Server Error. Unable to add expense");
    }

    // Send a more descriptive success message with the ID of the newly inserted expense
    res.status(201).json({ message: "Budget added successfully", budgetId: result.insertId });
  });
});


app.get('/budget/:user_id', (req, res) => {
  const user_id = req.params.user_id;

  const getBudgetQuery = 'SELECT * FROM tbl_budget WHERE user_id = ?';

  db.query(getBudgetQuery, [user_id], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }

    // Send the expenses data as JSON
    res.json(result);
  });
});

app.get('/budget/:user_id/:budget_id', (req, res) => {
  const userId = req.params.user_id;
  const budgetId = req.params.budget_id;

  const getBudgetQuery = 'SELECT * FROM tbl_budget WHERE user_id = ? AND id = ?';

  db.query(getBudgetQuery, [userId, budgetId], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }

    if (result.length === 0) {
      return res.status(404).send('Expense not found');
    }

    // Send the expense data as JSON
    res.json(result[0]);
  });
});


app.put('/budget/:id', upload.single('budget_image'), (req, res) => {
  const budgetId = req.params.id;
  const { budget_name, budget_amount, budget_date, budget_description } = req.body;

  // Check if a file was uploaded
  const budget_image = req.file ? req.file.originalname : null;

  // Check if the expense exists before attempting to update
  const checkBudgetExistenceQuery = 'SELECT * FROM tbl_budget WHERE id = ?';
  db.query(checkBudgetExistenceQuery, [budgetId], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }

    if (result.length === 0) {
      return res.status(404).send('Budget not found');
    }

    // Expense exists, get the current image path
    const currentImagePath = result[0].budget_image;

    // Prepare the update query
    const updateBudgetQuery = 'UPDATE tbl_budget SET budget_name = ?, budget_amount = ?, budget_date = ?, budget_image = ?, budget_description = ? WHERE id = ?';
    const values = [budget_name, budget_amount, budget_date, budget_image, budget_description, budgetId];

    // Filter out null values before executing the query
    const filteredValues = values.filter(value => value !== null);

    // Check if there are non-null values to update
    if (filteredValues.length === 0) {
      return res.status(400).send("No valid values to update");
    }

    db.query(updateBudgetQuery, filteredValues, (updateError) => {
      if (updateError) {
        console.error(updateError);
        return res.status(500).send('Internal Server Error');
      }

      // If a new image was uploaded, delete the old image
      if (currentImagePath && budget_image) {
        const imageFilePath = path.join(__dirname, 'public', 'images', currentImagePath);
        fs.unlink(imageFilePath, (unlinkError) => {
          if (unlinkError) {
            console.error(unlinkError);
            // Handle the unlink error if needed
          }
        });
      }

      res.send('Budget Updated');
    });
  });
});


app.delete('/budget/:id', (req, res) => {
  const budgetId = req.params.id;

  // Check if the expense exists before attempting to delete
  const checkBudgetExistenceQuery = 'SELECT * FROM tbl_budget WHERE id = ?';
  db.query(checkBudgetExistenceQuery, [budgetId], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }

    if (result.length === 0) {
      return res.status(404).send('Budget not found');
    }

    // Expense exists, get the image path and proceed with deletion
    const imagePath = result[0].budget_image;

    const deleteBudgetQuery = 'DELETE FROM tbl_budget WHERE id = ?';
    db.query(deleteBudgetQuery, [budgetId], (deleteError) => {
      if (deleteError) {
        console.error(deleteError);
        return res.status(500).send('Internal Server Error');
      }

      // If image path exists, delete the associated file
      if (imagePath) {
        const imageFilePath = path.join(__dirname, 'public', 'images', imagePath);
        fs.unlink(imageFilePath, (unlinkError) => {
          if (unlinkError) {
            console.error(unlinkError);
            // Handle the unlink error if needed
          }
        });
      }

      return res.send('Budget Deleted');
    });
  });
});

/**
 * CRUD BUDGET ENDS HERE!
 */



/**
 * CRUD investment STARTS HERE!
 */

app.post('/addinvestment', upload.single('investment_image'), (req, res) => {
  const { investment_name, investment_amount, investment_date, investment_description, user_id } = req.body;


  console.log('Request Body:', req.body);
  console.log('User ID:', user_id);
  // Check for required fields
  if (!investment_name || !investment_amount || !investment_date || !user_id) {
    return res.status(400).send("investment name, amount, date, and user ID are required");
  }

  // Check if a file was uploaded
  const investment_image = req.file ? req.file.originalname : null;

  const sql = 'INSERT INTO tbl_investment (investment_name, investment_amount, investment_date, investment_image, investment_description, user_id) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [investment_name, investment_amount, investment_date, investment_image, investment_description, user_id];

  // Filter out null values before executing the query
  const filteredValues = values.filter(value => value !== null);

  // Check if there are non-null values to insert
  if (filteredValues.length === 0) {
    return res.status(400).send("No valid values to insert");
  }

  db.query(sql, filteredValues, (error, result) => {
    if (error) {
      console.error("Error adding income:", error);
      return res.status(500).send("Internal Server Error. Unable to add investment");
    }

    // Send a more descriptive success message with the ID of the newly inserted expense
    res.status(201).json({ message: "investment added successfully", investmentId: result.insertId });
  });
});


app.get('/investment/:user_id', (req, res) => {
  const user_id = req.params.user_id;

  const getInvestmentQuery = 'SELECT * FROM tbl_investment WHERE user_id = ?';

  db.query(getInvestmentQuery, [user_id], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }

    // Send the expenses data as JSON
    res.json(result);
  });
});

app.get('/investment/:user_id/:investment_id', (req, res) => {
  const userId = req.params.user_id;
  const investmentId = req.params.investment_id;

  const getInvestmentQuery = 'SELECT * FROM tbl_investment WHERE user_id = ? AND id = ?';

  db.query(getInvestmentQuery, [userId, investmentId], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }

    if (result.length === 0) {
      return res.status(404).send('investment not found');
    }

    // Send the expense data as JSON
    res.json(result[0]);
  });
});


app.put('/investment/:id', upload.single('investment_image'), (req, res) => {
  const investmentId = req.params.id;
  const { investment_name, investment_amount, investment_date, investment_description } = req.body;

  // Check if a file was uploaded
  const investment_image = req.file ? req.file.originalname : null;

  // Check if the expense exists before attempting to update
  const checkInvestmentExistenceQuery = 'SELECT * FROM tbl_investment WHERE id = ?';
  db.query(checkInvestmentExistenceQuery, [investmentId], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }

    if (result.length === 0) {
      return res.status(404).send('investment not found');
    }

    // Expense exists, get the current image path
    const currentImagePath = result[0].investment_image;

    // Prepare the update query
    const updateInvestmentQuery = 'UPDATE tbl_investment SET investment_name = ?, investment_amount = ?, investment_date = ?, investment_image = ?, investment_description = ? WHERE id = ?';
    const values = [investment_name, investment_amount, investment_date, investment_image, investment_description, investmentId];

    // Filter out null values before executing the query
    const filteredValues = values.filter(value => value !== null);

    // Check if there are non-null values to update
    if (filteredValues.length === 0) {
      return res.status(400).send("No valid values to update");
    }

    db.query(updateInvestmentQuery, filteredValues, (updateError) => {
      if (updateError) {
        console.error(updateError);
        return res.status(500).send('Internal Server Error');
      }

      // If a new image was uploaded, delete the old image
      if (currentImagePath && investment_image) {
        const imageFilePath = path.join(__dirname, 'public', 'images', currentImagePath);
        fs.unlink(imageFilePath, (unlinkError) => {
          if (unlinkError) {
            console.error(unlinkError);
            // Handle the unlink error if needed
          }
        });
      }

      res.send('Investment Updated');
    });
  });
});


app.delete('/investment/:id', (req, res) => {
  const investmentId = req.params.id;

  // Check if the expense exists before attempting to delete
  const checkInvestmentExistenceQuery = 'SELECT * FROM tbl_investment WHERE id = ?';
  db.query(checkInvestmentExistenceQuery, [investmentId], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }

    if (result.length === 0) {
      return res.status(404).send('Investment not found');
    }

    // Expense exists, get the image path and proceed with deletion
    const imagePath = result[0].investment_image;

    const deleteInvestmentQuery = 'DELETE FROM tbl_investment WHERE id = ?';
    db.query(deleteInvestmentQuery, [investmentId], (deleteError) => {
      if (deleteError) {
        console.error(deleteError);
        return res.status(500).send('Internal Server Error');
      }

      // If image path exists, delete the associated file
      if (imagePath) {
        const imageFilePath = path.join(__dirname, 'public', 'images', imagePath);
        fs.unlink(imageFilePath, (unlinkError) => {
          if (unlinkError) {
            console.error(unlinkError);
            // Handle the unlink error if needed
          }
        });
      }

      return res.send('Investment Deleted');
    });
  });
});

/**
 * CRUD INVESTMENT ENDS HERE!
 */


/**
 * 
 * USER LOGIN AND REGISTER STARTS HERE RESTFUL APIS! STARTS HERE
 */

app.post('/register', async (request, response) => {
    const { full_name, email, password } = request.body;
  
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Store the hashed password in the database
      const sql = 'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)';
      db.query(sql, [full_name, email, hashedPassword], (error, result) => {
        if (error) throw error;
        response.send('Register Successfully');
      });
    } catch (error) {
      console.error('Error hashing password:', error);
      response.status(500).send('Internal Server Error');
    }
  });

  app.get('/getUserId/:id', (req, res) => {
    const userId = req.params.id;
  
    const getUserIdQuery = 'SELECT id FROM users WHERE id = ?';
  
    db.query(getUserIdQuery, [userId], (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
      }
  
      if (result.length === 0) {
        return res.status(404).send('User not found');
      }
  
      const fetchedUserId = result[0].id;
      res.json({ user_id: fetchedUserId });
    });
  });
  
  app.post('/login', async (request, response) => {
    const { email, password } = request.body;
  
    try {
      // Retrieve the hashed password and user ID from the database based on the email
      const sql = 'SELECT id, full_name, email, password FROM users WHERE email = ?';
      db.query(sql, [email], async (error, results) => {
        if (error) throw error;
  
        if (results.length > 0) {
          const user = results[0];
  
          // Compare the entered password with the hashed password from the database
          const passwordMatch = await bcrypt.compare(password, user.password);
  
          if (passwordMatch) {
            // Passwords match, user is authenticated
            response.json({
              message: 'Login Successful',
              user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
              },
            });
          } else {
            // Passwords do not match, authentication failed
            response.status(401).send('Invalid Credentials');
          }
        } else {
          // No user found with the provided email
          response.status(401).send('Invalid Credentials');
        }
      });
    } catch (error) {
      console.error('Error during login:', error);
      response.status(500).send('Internal Server Error');
    }
  });
  

  /**
 * 
 * USER LOGIN AND REGISTER STARTS HERE RESTFUL APIS! END HERE
 */


  /**
   * 
   * Savings calculations form!
   */
  app.get('/totalsavings/:user_id', (req, res) => {
    const userId = req.params.user_id;

    // Fetch the latest expense_id for the user
    const getLatestExpenseIdQuery = 'SELECT MAX(id) as latestExpenseId FROM tbl_expenses WHERE user_id = ?';
    db.query(getLatestExpenseIdQuery, [userId], (expenseIdError, expenseIdResult) => {
        if (expenseIdError) {
            console.error(expenseIdError);
            return res.status(500).send('Internal Server Error');
        }

        const latestExpenseId = expenseIdResult[0].latestExpenseId || 0;

        // Fetch the latest income_id for the user
        const getLatestIncomeIdQuery = 'SELECT MAX(id) as latestIncomeId FROM tbl_income WHERE user_id = ?';
        db.query(getLatestIncomeIdQuery, [userId], (incomeIdError, incomeIdResult) => {
            if (incomeIdError) {
                console.error(incomeIdError);
                return res.status(500).send('Internal Server Error');
            }

            const latestIncomeId = incomeIdResult[0].latestIncomeId || 0;

            // Fetch total income
            const getTotalIncomeQuery = 'SELECT SUM(income_amount) as totalIncome FROM tbl_income WHERE user_id = ?';
            db.query(getTotalIncomeQuery, [userId], (incomeError, incomeResult) => {
                if (incomeError) {
                    console.error(incomeError);
                    return res.status(500).send('Internal Server Error');
                }

                const totalIncome = incomeResult[0].totalIncome || 0;

                // Fetch total expenses
                const getTotalExpensesQuery = 'SELECT SUM(expense_amount) as totalExpenses FROM tbl_expenses WHERE user_id = ?';
                db.query(getTotalExpensesQuery, [userId], (expensesError, expensesResult) => {
                    if (expensesError) {
                        console.error(expensesError);
                        return res.status(500).send('Internal Server Error');
                    }

                    const totalExpenses = expensesResult[0].totalExpenses || 0;

                    // Fetch total budget
                    const getTotalBudgetQuery = 'SELECT SUM(budget_amount) as totalBudget FROM tbl_budget WHERE user_id = ?';
                    db.query(getTotalBudgetQuery, [userId], (budgetError, budgetResult) => {
                        if (budgetError) {
                            console.error(budgetError);
                            return res.status(500).send('Internal Server Error');
                        }

                        const totalBudget = budgetResult[0].totalBudget || 0;

                        // Calculate total savings
                        const totalSavings = totalIncome - totalExpenses + totalBudget;

                        // Check if a record already exists for the user_id
                        const checkExistingSavingsQuery = 'SELECT id FROM tbl_savings WHERE user_id = ?';
                        db.query(checkExistingSavingsQuery, [userId], (checkError, checkResult) => {
                            if (checkError) {
                                console.error(checkError);
                                return res.status(500).send('Internal Server Error');
                            }

                            // If a record already exists, update the existing record
                            if (checkResult.length > 0) {
                                const existingSavingsId = checkResult[0].id;

                                // Update the existing record with new values
                                const updateSavingsQuery = 'UPDATE tbl_savings SET expense_id = ?, income_id = ?, total_savings = ? WHERE id = ?';
                                db.query(updateSavingsQuery, [latestExpenseId, latestIncomeId, totalSavings, existingSavingsId], (updateError, updateResult) => {
                                    if (updateError) {
                                        console.error(updateError);
                                        return res.status(500).send('Internal Server Error');
                                    }

                                    // Send the updated data with the existing id
                                    res.json([{ id: existingSavingsId, userId, latestExpenseId, latestIncomeId, totalSavings }]);
                                });
                            } else {
                                // If no record exists, insert a new record
                                const insertSavingsQuery = 'INSERT INTO tbl_savings (user_id, expense_id, income_id, total_savings) VALUES (?, ?, ?, ?)';
                                db.query(insertSavingsQuery, [userId, latestExpenseId, latestIncomeId, totalSavings], (insertError, insertResult) => {
                                    if (insertError) {
                                        console.error(insertError);
                                        return res.status(500).send('Internal Server Error');
                                    }

                                    // Send the inserted data with the actual id
                                    res.json([{ id: insertResult.insertId, userId, latestExpenseId, latestIncomeId, totalSavings }]);
                                });
                            }
                        });
                    });
                });
            });
        });
    });
});

  

  
  /**
   * savings calculation ends here!
   */


  /**
   * total income 
   * 
   */

  app.get('/totalincome/:user_id', (req, res) => {
    const userId = req.params.user_id;
  
    // Fetch total income for the user
    const getTotalIncomeQuery = 'SELECT SUM(income_amount) as totalIncome FROM tbl_income WHERE user_id = ?';
    db.query(getTotalIncomeQuery, [userId], (incomeError, incomeResult) => {
      if (incomeError) {
        console.error(incomeError);
        return res.status(500).send('Internal Server Error');
      }
  
      const totalIncome = incomeResult[0].totalIncome || 0;
  
      // Send the total income as the response
      res.json({ totalIncome });
    });
  });


  app.get('/totalexpenses/:user_id', (req, res) => {
    const userId = req.params.user_id;
  
    // Fetch total expenses for the user
    const getTotalExpensesQuery = 'SELECT SUM(expense_amount) as totalExpenses FROM tbl_expenses WHERE user_id = ?';
    db.query(getTotalExpensesQuery, [userId], (expensesError, expensesResult) => {
      if (expensesError) {
        console.error(expensesError);
        return res.status(500).send('Internal Server Error');
      }
  
      const totalExpenses = expensesResult[0].totalExpenses || 0;
  
      // Send the total expenses as the response
      res.json({ totalExpenses });
    });
  });


  app.get('/totalsavings/:user_id', (req, res) => {
    const userId = req.params.user_id;
  
    // Fetch total savings for the user
    const getTotalSavingsQuery = 'SELECT SUM(total_savings) as totalSavings FROM tbl_savings WHERE user_id = ?';
    db.query(getTotalSavingsQuery, [userId], (savingsError, savingsResult) => {
      if (savingsError) {
        console.error(savingsError);
        return res.status(500).send('Internal Server Error');
      }
  
      const totalSavings = savingsResult[0].totalSavings || 0;
  
      // Send the total savings as the response
      res.json({ totalSavings });
    });
  });
  

  app.get('/totalbudget/:user_id', (req, res) => {
    const userId = req.params.user_id;
  
    // Fetch total savings for the user
    const getTotalBudgetQuery = 'SELECT SUM(budget_amount) as totalBudget FROM tbl_budget WHERE user_id = ?';
    db.query(getTotalBudgetQuery, [userId], (budgetError, budgetResult) => {
      if (budgetError) {
        console.error(budgetError);
        return res.status(500).send('Internal Server Error');
      }
  
      const totalBudget = budgetResult[0].totalBudget || 0;
  
      // Send the total savings as the response
      res.json({ totalBudget });
    });
  });
  
  app.get('/topexpenses/:user_id', (req, res) => {
    const userId = req.params.user_id;
  
    // Fetch top 5 expenses with total amounts for the user
    const getTopExpensesQuery = `
      SELECT expense_name, SUM(expense_amount) as total_amount
      FROM tbl_expenses
      WHERE user_id = ?
      GROUP BY expense_name
      ORDER BY total_amount DESC
      LIMIT 5
    `;
  
    db.query(getTopExpensesQuery, [userId], (expensesError, expensesResult) => {
      if (expensesError) {
        console.error(expensesError);
        return res.status(500).send('Internal Server Error');
      }
  
      // Send the top expenses with total amounts as the response
      res.json({ topExpenses: expensesResult });
    });
  });
  
  app.get('/topincome/:user_id', (req, res) => {
    const userId = req.params.user_id;
  
    // Fetch top 5 expenses with total amounts for the user
    const getTopIncomeQuery = `
      SELECT income_name, SUM(income_amount) as total_amount
      FROM tbl_income
      WHERE user_id = ?
      GROUP BY income_name
      ORDER BY total_amount DESC
      LIMIT 5
    `;
  
    db.query(getTopIncomeQuery, [userId], (IncomeError, IncomeResult) => {
      if (IncomeError) {
        console.error(IncomeError);
        return res.status(500).send('Internal Server Error');
      }
  
      // Send the top expenses with total amounts as the response
      res.json({ topIncome: IncomeResult });
    });
  });


  app.get('/topbudget/:user_id', (req, res) => {
    const userId = req.params.user_id;
  
    // Fetch top 5 expenses with total amounts for the user
    const getTopBudgetQuery = `
      SELECT budget_name, SUM(budget_amount) as total_amount
      FROM tbl_budget
      WHERE user_id = ?
      GROUP BY budget_name
      ORDER BY total_amount DESC
      LIMIT 5
    `;
  
    db.query(getTopBudgetQuery, [userId], (BudgetError, BudgetResult) => {
      if (BudgetError) {
        console.error(BudgetError);
        return res.status(500).send('Internal Server Error');
      }
  
      // Send the top expenses with total amounts as the response
      res.json({ topBuget: BudgetResult });
    });
  });

  

  app.get('/topinvestment/:user_id', (req, res) => {
    const userId = req.params.user_id;

    // Fetch top 5 investments with total amounts for the user
    const getTopInvestmentQuery = `
      SELECT investment_name, SUM(investment_amount) as total_amount
      FROM tbl_investment
      WHERE user_id = ?
      GROUP BY investment_name
      ORDER BY total_amount DESC
      LIMIT 5
    `;

    db.query(getTopInvestmentQuery, [userId], (investmentError, investmentResult) => {
        if (investmentError) {
            console.error(investmentError);
            return res.status(500).send('Internal Server Error');
        }

        // Send the top investments with total amounts as the response
        res.json({ topInvestment: investmentResult });
    });
});
