const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config');
const expenseTypeRouter = require('./router/expenseTypeRouter');
const incomeRouter = require('./router/incomeRouter');
const expenseRouter = require('./router/expenseRouter');
const loginRouter = require('./router/loginRouter');
const reportRouter = require('./router/reportRouter');
const {RequestValidator} = require('./validators');
const dev_mode = process.env.DEV_MODE || true;
console.log(`is DEV_MODE = ${dev_mode}`);

let conurl = `mongodb+srv://${process.env.MONGO_DB_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

console.log(`connecting to ${conurl}`);

mongoose.connect(conurl,
{ useNewUrlParser: true, useUnifiedTopology: true  });

const db = mongoose.connection;
db.on('open', ()=>{
    console.log('database connection accquired');
    initApp();
});
db.on('error', (err) => {
    console.log('Error connecting to database');
    console.log(err);
});



async function initApp(){
    const appConfig = await config.getAppConfig();
    var server_port = process.env.PORT || appConfig.port;
    var server_host = process.env.YOUR_HOST || '0.0.0.0';
    // const PORT = appConfig.port;
    const app = express();

    app.use(cors());
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }));

    // parse application/json
    app.use(bodyParser.json());

    app.get('/', (req, res) => {
        res.json({result:'express server running'});
    });

    app.use(new RequestValidator().validate);

    app.use('/login',loginRouter);
    app.use('/expensetype', expenseTypeRouter);
    app.use('/income', incomeRouter);
    app.use('/expense',expenseRouter);
    app.use('/report',reportRouter);
    
    process
    .on('unhandledRejection', (reason, p) => {
        console.error(reason, 'Unhandled Rejection at Promise', p);
    })
    .on('uncaughtException', err => {
        console.error(err, 'Uncaught Exception thrown');
        process.exit(1);
    });

    app.listen(server_port, ()=>{
        console.log(`listening to ${server_host}:${server_port}`);
    });
}
