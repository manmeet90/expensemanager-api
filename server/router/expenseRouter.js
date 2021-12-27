var express = require('express')
var expenseRouter = express.Router();
const ExpenseController = require('../controller/expenseController');
const utils = require('../utils');
const {isDate} = require('util');

const expenseController = new ExpenseController();

expenseRouter.get('/',(req, res) => {
    // get all expenses by filter
    let filter = {};
    if(req.query.year) {
        filter.year = req.query.year;
    }
    if(req.query.month) {
        filter.month = req.query.month.toUpperCase();
    }
    if(req.query.expenseType) {
        filter.expenseType = req.query.expenseType;
    }
    expenseController.getExpenses(filter)
    .then(data => {
        res.json(utils.prepareSuccessResponse(data));
    }, err => {
        res.status(500);
        res.json(utils.prepareErrorResponse(err));
    });
});

expenseRouter.put('/', (req, res) => {
    // create new expense
    let requestData = {
        amount: req.body.amount,
        description: req.body.description ? req.body.description : '',
        date: req.body.date ? req.body.date : new Date(`${req.body.year}-${utils.getMonthFromString(req.body.month)}-${new Date().getDate()}`),
        year: req.body.year,
        month: req.body.month.toUpperCase(),
        expenseType: req.body.expenseType
    };
    expenseController.createExpense(requestData)
    .then(data => {
        res.json(utils.prepareSuccessResponse(data));
    }, err => {
        res.status(500);
        res.json(utils.prepareErrorResponse(err));
    });
});

expenseRouter.post('/:expenseId', (req, res) => {
    // update expense
    let requestData = {};
    if(req.body.amount) {
        requestData.amount = req.body.amount;
    }
    if(req.body.description) {
        requestData.description = req.body.description;
    }
    if(req.body.expenseType) {
        requestData.expenseType = req.body.expenseType;
    }
    if(req.body.date) {
        requestData.date = req.body.date;
    }
    if(req.body.year) {
        requestData.year = req.body.year;
    }
    if(req.body.month) {
        requestData.month = req.body.month.toUpperCase();
    }
    expenseController.updateExpense(req.params.expenseId, requestData)
    .then((result)=>{
        res.json(utils.prepareSuccessResponse(result))
    },err => {
        res.status(500);
        res.json(utils.prepareErrorResponse(err));
    });
});

expenseRouter.delete('/:expenseId', (req, res) => {
    // delete expense by id
    expenseController.deleteExpense(req.params.expenseId)
    .then((result)=>{
        res.json(utils.prepareSuccessResponse(result))
    },err => {
        res.status(500);
        res.json(utils.prepareErrorResponse(err));
    });
});


module.exports = expenseRouter;