const {ExpenseType, Expense} = require('../models');
const utils = require('../utils');

class ExpenseController {
    constructor() {
        console.log("ExpenseController init");
    }

    getExpenseTypes() {
        return new Promise((resolve,reject) => {
            ExpenseType.find().exec((err, data) => {
                if(err) {
                    reject(err);
                }
                resolve(data);
            })
        });
    }

    createExpenseType(expenseType, tag = '') {
        let self = this;
        return new Promise((resolve, reject) => { 
            ExpenseType.count({value:self.convertToExpenseValue(expenseType)}).exec((err,count) => {
                if(err){
                    reject(err);
                }
                if(count > 0) {
                    reject({message:"Already present expense type with same value"});
                }else {
                    let ob = new ExpenseType({
                        name: expenseType,
                        value: this.convertToExpenseValue(expenseType),
                        tag: tag
                    });
                    ob.save()
                    .then(()=>resolve())
                    .catch(err => reject(err));
                }
            });
        });
    }

    updateExpenseType(oldName, newName, tag = '') {
        let self = this;
        return new Promise((resolve, reject) => { 
            ExpenseType.count({name:newName},((err,count)=> {
                if(err){
                    reject(err);
                }
                if(count > 0) {
                    reject({message:"Already present expense type with same value"});
                }else {
                    ExpenseType.updateOne({name:oldName}, {name:newName, value: self.convertToExpenseValue(newName)})
                    .then(()=>resolve())
                    .catch(err => reject(err));
                }
            }));
        });
    }

    deleteExpenseType(expenseId) {
        return new Promise((resolve, reject) => { 
            ExpenseType.count({_id:expenseId}).exec((err,count) => {
                if(err){
                    reject(err);
                }
                if(count == 0) {
                    reject({message:`expense type does not exist`});
                }else {
                    ExpenseType.deleteOne({_id:expenseId})
                    .then(()=>resolve('expense type deleted successfully'))
                    .catch(err => reject(err));
                }
            });
        });
    }

    getExpenses(filter){
        return new Promise((resolve, reject) => { 
            Expense.find(filter)
            .exec((err, results) =>{
                if(err){
                    reject(err);
                }

                resolve(results);
            });
        });
    }

    createExpense(requestData) {
        return new Promise((resolve, reject) => { 
            let expense = new Expense({
                amount: requestData.amount,
                description: requestData.description ? requestData.description : '',
                date: requestData.date,
                year: requestData.year,
                month: requestData.month.toUpperCase(),
                expenseType: requestData.expenseType
            });
            if(requestData.expenseType) {
                ExpenseType.count({_id: requestData.expenseType}, (err, count) => {
                    if(err){
                        reject(err);
                    }else if(count <1) {
                        reject('expense type does not exist');
                    }else {
                        expense.save(err => {
                            if(err){
                                reject(err);
                            }
                            resolve('expense created successfully');
                        });
                    }
                });
            }else {
                expense.save(err => {
                    if(err){
                        reject(err);
                    }
                    resolve('expense created successfully');
                });
            }
        });
    }

    updateExpense(expenseId,requestData) {
        return new Promise((resolve, reject) => { 
            Expense.findOne({_id:expenseId})
            .exec((err, expense) => {
                if(err){
                    reject(err);
                }else if(expense){
                    if(requestData.date) {
                        let d = new Date(requestData.date);
                        if(isDate(d)) {
                            requestData.year = d.getFullYear();
                            requestData.month = utils.getMonthString(d.getMonth());
                        }
                    }else if(requestData.year) {
                        let d = new Date(expense.date);
                        d.setFullYear(requestData.year);
                        requestData.date =  `${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`;
                    }else if(requestData.month) {
                        requestData.month = requestData.month.toUpperCase();
                        let d = new Date(expense.date);
                        d.setMonth(utils.getMonthFromString(requestData.month.toUpperCase()));
                        requestData.date =  `${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`;
                        requestData.year = d.getFullYear();
                    }
                    if(requestData.expenseType) {
                        ExpenseType.count({_id: requestData.expenseType}, (err, count) => {
                            if(err){
                                reject(err);
                            }else if(count <1) {
                                reject('expense type does not exist');
                            }else {
                                expense.updateOne(requestData).exec(err => {
                                    if(err){
                                        reject(err);
                                    }
                                    resolve('expense updated successfully');
                                });
                            }
                        });
                    }else {
                        expense.updateOne(requestData).exec(err => {
                            if(err){
                                reject(err);
                            }
                            resolve('expense updated successfully');
                        });
                    }
                }
            });
            
        });
    }

    deleteExpense(expenseId){
        return new Promise((resolve, reject) => { 
            Expense.count({_id:expenseId}).exec((err, count) => {
                if(err){
                    reject(err);
                }else if(count < 1) {
                    reject('Expense does not exist');
                }else {
                    Expense.deleteOne({_id:expenseId}, (err) => {
                        if(err){
                            reject(err);
                        }
                        resolve('expense deleted successfully');
                    });
                }
            })
        });
    }

    convertToExpenseValue(expenseType){
        return expenseType.toUpperCase().replace(/[\s]+/g, "_");
    }
}
module.exports = ExpenseController;