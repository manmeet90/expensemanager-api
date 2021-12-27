var express = require('express')
var reportRouter = express.Router();
const ReportController = require('../controller/reportController');
const utils = require('../utils');

let reportController = new ReportController();

reportRouter.post('/', (req, res) => {
    reportController.generateReport(req.body.filter) 
    .then(data => {
        res.json(utils.prepareSuccessResponse(data));
    }, err => {
        res.status(500);
        res.json(utils.prepareErrorResponse(err));
    });
});

module.exports = reportRouter;