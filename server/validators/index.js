const utils = require('../utils');

class RequestValidator {
   
    validate(req, res, next) {
        let context = RequestValidator.getRequestContext(req);
        switch(context) {
            case RequestValidator.context.PUT_EXPENSETYPE: {
                if(!req.body.expenseType) {
                    res.status(500);
                    res.json(utils.prepareErrorResponse('parameter expensetype is required'));
                }else {
                    next();
                }
                break;
            }

            case RequestValidator.context.POST_EXPENSETYPE: {
                if(!req.body.expenseType) {
                    res.status(500);
                    res.json(utils.prepareErrorResponse('parameter expensetype is required'));
                }else if(!req.body.newName) {
                    res.status(500);
                    res.json(utils.prepareErrorResponse('parameter newName is required'));
                }else {
                    next();
                }
                
                break;
            }

            case RequestValidator.context.POST_INCOME: {
                if(!req.body.amount) {
                    res.status(500);
                    res.json(utils.prepareErrorResponse('parameter amount is required'));
                }else if(!req.body.year) {
                    res.status(500);
                    res.json(utils.prepareErrorResponse('parameter year is required'));
                }else if(req.body.year && (isNaN(req.body.year) || parseInt(req.body.year,10) < 1700)) {
                    res.status(500);
                    res.json(utils.prepareErrorResponse('parameter year should be a number greater than 1700'));
                }else if(!req.body.month) {
                    res.status(500);
                    res.json(utils.prepareErrorResponse('parameter month is required'));
                }else if(req.body.amount && isNaN(req.body.amount)) {
                    res.status(500);
                    res.json(utils.prepareErrorResponse('parameter amount should be number'));
                }else if(req.body.amount && parseInt(req.body.amount,10)<= 0) {
                    res.status(500);
                    res.json(utils.prepareErrorResponse('parameter amount should be greater than zero'));
                }else {
                    next();
                }
                break;
            }
            
            case RequestValidator.context.GET_INCOME: {
                // if(!req.query.year) {
                //     res.status(500);
                //     res.json(utils.prepareErrorResponse('parameter year is required'));
                // }else if(!req.query.month) {
                //     res.status(500);
                //     res.json(utils.prepareErrorResponse('parameter month is required'));
                // }else {
                    next();
                // }
                break;
            }

            case RequestValidator.context.GET_EXPENSE: {
                if(req.query.year && (isNaN(req.query.year) || parseInt(req.query.year,10) < 1700)) {
                    res.status(500);
                    res.json(utils.prepareErrorResponse('parameter year should be a number greater than 1700'));
                }else if(req.query.month && req.query.month.trim() == '') {
                    res.status(500);
                    res.json(utils.prepareErrorResponse('invalid value for parameter month provided'));
                }else if(req.query.expenseType && req.query.expenseType.trim() == '') {
                    res.status(500);
                    res.json(utils.prepareErrorResponse('invalid value for parameter expenseType provided'));
                }else {
                    next();
                }
                break;
            }

            case RequestValidator.context.PUT_EXPENSE: {
                if(req.body.year && (isNaN(req.body.year) || parseInt(req.body.year,10) < 1700)) {
                    res.status(500);
                    res.json(utils.prepareErrorResponse('parameter year should be a number greater than 1700'));
                }else if(req.body.month && req.body.month.trim() == '') {
                    res.status(500);
                    res.json(utils.prepareErrorResponse('invalid value for parameter month provided'));
                }else if(req.body.expenseType && req.body.expenseType.trim() == '') {
                    res.status(500);
                    res.json(utils.prepareErrorResponse('invalid value for parameter expenseType provided'));
                }else if(!req.body.year){
                    res.status(500);
                    res.json(utils.prepareErrorResponse("parameter year is required"));
                }else if(!req.body.month){
                    res.status(500);
                    res.json(utils.prepareErrorResponse("parameter month is required"));
                }else if(!req.body.date){
                    res.status(500);
                    res.json(utils.prepareErrorResponse("parameter date is required"));
                }else if(!req.body.amount){
                    res.status(500);
                    res.json(utils.prepareErrorResponse("parameter amount is required"));
                }else if(!req.body.expenseType){
                    res.status(500);
                    res.json(utils.prepareErrorResponse("parameter expenseType is required"));
                }else if(req.body.amount && parseInt(req.body.amount,10) <= 0) {
                    res.status(500);
                    res.json(utils.prepareErrorResponse('parameter amount should be greater than zero'));
                }else {
                    next();
                }
                break;
            }

            case RequestValidator.context.POST_EXPENSE: {
                if(req.body.year && (isNaN(req.body.year) || parseInt(req.body.year,10) < 1700)) {
                    res.status(500);
                    res.json(utils.prepareErrorResponse('parameter year should be a number greater than 1700'));
                }else if(req.body.month && req.body.month.trim() == '') {
                    res.status(500);
                    res.json(utils.prepareErrorResponse('invalid value for parameter month provided'));
                }else if(req.body.expenseType && req.body.expenseType.trim() == '') {
                    res.status(500);
                    res.json(utils.prepareErrorResponse('invalid value for parameter expenseType provided'));
                }else if(req.body.amount && parseInt(req.body.amount,10) <= 0) {
                    res.status(500);
                    res.json(utils.prepareErrorResponse('parameter amount should be greater than zero'));
                }else {
                    next();
                }
                break;
            }

            case RequestValidator.context.POST_LOGIN: {
                if(!req.body.username ){
                    res.status(500);
                    res.json(utils.prepareErrorResponse('parameter username is required'));
                }else if(!req.body.password){
                    res.status(500);
                    res.json(utils.prepareErrorResponse('parameter password is required'));
                }else {
                    next();
                }
                break;
            }

            default:{
                next();
            }
        }
    }

    static getRequestContext(req) {
        let url = req.url;
        let path = req.path;
        let method = req.method;
        let context = null;
        switch(path) {
            case '/expensetype':{
                switch(method){
                    case 'GET' :{
                        context = RequestValidator.context.GET_EXPENSETYPE;
                        break;
                    }
                    case 'PUT' :{
                        context = RequestValidator.context.PUT_EXPENSETYPE;
                        break;
                    }
                    case 'POST' :{
                        context = RequestValidator.context.POST_EXPENSETYPE;
                        break;
                    }
                    case 'DELETE' :{
                        context = RequestValidator.context.DELETE_EXPENSETYPE;
                        break;
                    }
                }
                break;
            }
            case '/expense':{
                switch(method){
                    case 'GET' :{
                        context = RequestValidator.context.GET_EXPENSE;
                        break;
                    }
                    case 'PUT' :{
                        context = RequestValidator.context.PUT_EXPENSE;
                        break;
                    }
                    case 'POST' :{
                        context = RequestValidator.context.POST_EXPENSE;
                        break;
                    }
                    case 'DELETE' :{
                        context = RequestValidator.context.DELETE_EXPENSE;
                        break;
                    }
                }
                break;
            }
            case '/income':{
                switch(method) {
                    case 'POST': {
                        context = RequestValidator.context.POST_INCOME;
                        break;
                    }
                    case 'GET': {
                        context = RequestValidator.context.GET_INCOME;
                        break;
                    }
                }
                break;
            }
            case '/login': {
                switch(method) {
                    case 'POST': {
                        context = RequestValidator.context.POST_LOGIN;
                        break;
                    }
                }
                break;
            }
        }

        return context;
    }
}

RequestValidator.context = {
    GET_EXPENSETYPE: 'GET_EXPENSETYPE',
    PUT_EXPENSETYPE: 'PUT_EXPENSETYPE',
    POST_EXPENSETYPE: 'POST_EXPENSETYPE',
    DELETE_EXPENSETYPE: 'DELETE_EXPENSETYPE',
    POST_INCOME: 'POST_INCOME',
    GET_INCOME: 'GET_INCOME',
    GET_EXPENSE: 'GET_EXPENSE',
    PUT_EXPENSE: 'PUT_EXPENSE',
    POST_EXPENSE: 'POST_EXPENSE',
    DELETE_EXPENSE: 'DELETE_EXPENSE',
    POST_LOGIN: 'POST_LOGIN'
};

module.exports = {
    RequestValidator: RequestValidator
};