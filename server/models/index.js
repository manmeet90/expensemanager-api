const mongoose = require('mongoose');
const {ConfigSchema,ExpenseTypeSchema,ExpenseSchema,IncomeSchema,UserSchema} = require('../schema');

exports.Config = mongoose.model('config', ConfigSchema);
exports.ExpenseType = mongoose.model('expenseType', ExpenseTypeSchema);
exports.Expense = mongoose.model('expense', ExpenseSchema);
exports.Income = mongoose.model('income', IncomeSchema);
exports.User = mongoose.model('user', UserSchema);
