var express = require('express')
var incomeRouter = express.Router();
const IncomeController = require('../controller/incomeController');
const utils = require('../utils');

const incomeController = new IncomeController();

incomeRouter.get('/', (req, res) => {
    let filter = {};
    if(req.query.year){
        filter.year = req.query.year;
    }
    if(req.query.month){
        filter.month = req.query.month.toUpperCase();
    }
    incomeController.getIncomeForMonth(filter)
    .then((data) => {
        res.json(utils.prepareSuccessResponse(data));
    }, err => {
        res.status(500);
        res.json(utils.prepareErrorResponse(err));
    });
});

incomeRouter.post('/', (req, res) => {
    incomeController.updateIncome(req.body.amount,req.body.year, req.body.month.toUpperCase())
    .then((data) => {
        res.json(utils.prepareSuccessResponse(data));
    }, err => {
        res.status(500);
        res.json(utils.prepareErrorResponse(err));
    });
});

module.exports = incomeRouter;

