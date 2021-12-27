const mongoose = require('mongoose');

exports.ConfigSchema = new mongoose.Schema({
    id: String,
    type: String,
    port : String
},{ collection: 'config' });


exports.ExpenseTypeSchema = new mongoose.Schema({
    name: String,
    value: String,
    tag: String
},{collection:'expenseType'})

exports.ExpenseSchema = new mongoose.Schema({
    amount: Number,
    description: String,
    date: String,
    year: Number,
    month: String,
    expenseType: {type:mongoose.Schema.Types.ObjectId, ref:"expenseType"},
    mk:String
},{collection:'expense'});

exports.IncomeSchema = new mongoose.Schema({
    month:String,
    year: Number,
    amount: Number
},{collection:'income'});

exports.UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    isEnabled: Boolean
},{collation:'users'});