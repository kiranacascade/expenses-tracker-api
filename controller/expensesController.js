const fs = require("fs"); //file system

module.exports = {
  fetchExpenses: async (req, res) => {
    let data = JSON.parse(fs.readFileSync("./db.json"));
    let expenses = data.expenses;

    // filter query by category
    if (req.query.category) {
      expenses = expenses.filter((expense) => {
        return expense.category === req.query.category;
      });
    }

    // filter query by date range
    if (req.query.start_date && req.query.end_date) {
      expenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        const startDate = new Date(req.query.start_date);
        const endDate = new Date(req.query.end_date);
        return expenseDate >= startDate && expenseDate <= endDate;
      });
    }

    res.status(200).send(expenses);
  },
  fetchExpensesByID: async (req, res) => {
    let data = JSON.parse(fs.readFileSync("./db.json"));
    let expense = data.expenses.find((expense) => {
      return expense.id === parseInt(req.params.id);
    });

    if (expense) {
      res.status(200).send(expense);
    } else {
      res.status(400).send("expense not found");
    }
  },
  deleteExpenseByID: async (req, res) => {
    let data = JSON.parse(fs.readFileSync("./db.json"));
    let expenses = data.expenses;
    let expenseIndex = expenses.findIndex((expense) => {
      return expense.id === parseInt(req.params.id);
    });

    if (expenseIndex >= 0) {
      expenses.splice(expenseIndex, 1);
      fs.writeFileSync("./db.json", JSON.stringify(data));
      res.status(200).send("Expense deleted");
    } else {
      res.status(400).send("Expense not found");
    }
  },
  addNewExpenses: async (req, res) => {
    let data = JSON.parse(fs.readFileSync("./db.json"));
    let expenses = data.expenses;
    let newExpense = req.body;

    let expensesID = expenses.map((expense) => expense.id);
    let newID = Math.max(...expensesID) + 1;

    expenses.push({ id: newID, ...newExpense });
    fs.writeFileSync("./db.json", JSON.stringify(data));
    res.status(200).send(expenses);
  },
  editExpense: async (req, res) => {
    let idParams = parseInt(req.params.id);
    let data = JSON.parse(fs.readFileSync("./db.json"));
    let expenses = data.expenses;
    let index = expenses.findIndex((expense) => idParams === expense.id);

    const keys = Object.keys(req.body);
    if (index >= 0 && keys.length >= 1) {
      keys.forEach((key) => {
        expenses[index][key] = req.body[key];
      });
      fs.writeFileSync("./db.json", JSON.stringify(data));
      res.status(200).send(`Expense ID ${idParams} is edited`);
    } else {
      res.status(400).send(`ID ${idParams} is not found`);
    }
  },
  updateExpense: async (req, res) => {
    let idParams = parseInt(req.params.id);
    let data = JSON.parse(fs.readFileSync("./db.json"));
    let expenses = data.expenses;
    let index = expenses.findIndex((expense) => idParams === expense.id);

    const keys = Object.keys(req.body);
    if (index >= 0) {
      keys.forEach((key) => {
        expenses[index][key] = req.body[key];
      });
      fs.writeFileSync("./db.json", JSON.stringify(data));
      res.status(200).json({
        is_success: true,
        message: `Expense ID: ${idParams} is updated`,
      });
    } else {
      res.status(400).json({
        is_success: false,
        message: `Expense ID: ${idParams} is not found`,
      });
    }
  },
};
