const express = require("express");
const { expensesController } = require("../controller/index");
const router = express.Router();

router.get("/", expensesController.fetchExpenses);
router.get("/:id", expensesController.fetchExpensesByID);
router.delete("/:id", expensesController.deleteExpenseByID);
router.post("/", expensesController.addNewExpenses);
router.patch("/:id", expensesController.editExpense);
router.put("/:id", expensesController.updateExpense);

module.exports = router;
