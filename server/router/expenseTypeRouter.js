var express = require('express')
var expenseTypeRouter = express.Router();
const ExpenseController = require('../controller/expenseController');
const utils = require('../utils');

const expenseController = new ExpenseController();

expenseTypeRouter.get('/', (req, res) => {
    expenseController.getExpenseTypes()
    .then((data) => {
        res.json(utils.prepareSuccessResponse(data));
    }, (err) => {
        res.status(500);
        res.json(utils.prepareErrorResponse(err));
    })
});

expenseTypeRouter.put('/', (req, res) => {
    expenseController.createExpenseType(req.body.expenseType)
    .then(()=>{
        res.json(utils.prepareSuccessResponse({ message:'expense type added successfully' }));
    }, (err) => {
        res.status(500);
        res.json(utils.prepareErrorResponse(err));
    });
});


expenseTypeRouter.post('/', (req, res) => {
    expenseController.updateExpenseType(req.body.expenseType, req.body.newName)
    .then(()=>{
        res.json(utils.prepareSuccessResponse({ message:'expense type updated successfully' }));
    }, (err) => {
        res.status(500);
        res.json(utils.prepareErrorResponse(err));
    });
});


expenseTypeRouter.delete('/:expenseTypeId', (req, res) => {
    expenseController.deleteExpenseType(req.params.expenseTypeId)
    .then(()=>{
        res.json(utils.prepareSuccessResponse({ message:'expense type updated successfully' }));
    }, (err) => {
        res.status(500);
        res.json(utils.prepareErrorResponse(err));
    });
});


module.exports = expenseTypeRouter;