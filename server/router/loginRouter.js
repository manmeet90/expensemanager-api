var express = require('express')
loginRouter = express.Router();
const LoginController = require('../controller/loginController');
const utils = require('../utils');

const loginController = new LoginController();

loginRouter.post('/',(req,res) => {
    loginController.login(req.body.username, req.body.password)
    .then((data) => {
        res.json(utils.prepareSuccessResponse(data));
    }, err => {
        res.status(500);
        res.json(utils.prepareErrorResponse(err));
    });
});

module.exports = loginRouter;