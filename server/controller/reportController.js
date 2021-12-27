const {ExpenseType, Expense, Income} = require('../models');
const _ = require('lodash');

class ReportController {
    generateReport(filter) {
        return new Promise((resolve, reject) => { 
            if(filter.year && !filter.month && !filter.expenseType) {
                // report for year all expenses
                let totalIncome = 0;
                let totalExpenditure = 0;

                Income.find({year:filter.year})
                .exec((err,incomeData) => {
                    if(err) {reject(err)};
                    totalIncome = _.reduce(incomeData,(sum, item) => {
                        return sum + item.amount
                    },0);
                    Expense.aggregate([
                        {"$match":{"year":filter.year}}
                        ,{
                            "$lookup": {
                                "from": "expenseType",
                                "localField": "expenseType",
                                "foreignField": "_id",
                                "as": "expenseType"
                            }
                        }
                        ,{
                            "$unwind": "$expenseType"
                        }
                        ,{
                            "$group":{
                                "_id":{"expenseType":"$expenseType.value"},
                                "total":{"$sum":"$amount"},
                                "year": {"$first":"$year"}
                            }
                        }
                        ,{
                            "$project": {
                                "expenseType":'$_id.expenseType',
                                "total":1
                            }
                        }
                    ])
                    .exec((err, expensesResults) => {
                        if(err) {reject(err)}
                        _.each(expensesResults, item => {
                            totalExpenditure+= item.total;
                        });
                        Expense.aggregate([
                            {"$match":{"year":filter.year}}
                            ,{
                                "$group":{
                                    "_id":{"month":"$month"},
                                    "total":{"$sum":"$amount"}
                                }
                            }
                            ,{
                                "$project": {
                                    "month":'$_id.month',
                                    "total":1
                                }
                            }
                        ]).exec((err, monthResults) => {
                            if(err) {reject(err)}
                            let monthData = [];
                            monthResults.forEach(item => {
                                let _income = incomeData.find(i => i.year == filter.year && i.month.toLowerCase() == item.month.toLowerCase());
                                let income = _income ? _income.amount : 0;
                                let saving = parseInt(income,10)-parseInt(item.total,10);
                                monthData.push({
                                    income:income,
                                    saving: saving,
                                    expenditure: item.total,
                                    month: item.month
                                });
                            });
                            let finalReport = {
                                totalIncome: totalIncome,
                                totalExpenditure: totalExpenditure,
                                expensesByType: expensesResults,
                                expensesByMonth: monthData
                            };
                            resolve(finalReport);
                        });
                    });
                });
            }else if(filter.year && filter.month && !filter.expenseType){
                // report for month of a year of all expenses
                let totalIncome = 0;
                let totalExpenditure = 0;

                Income.find({year:filter.year, month: filter.month.toUpperCase()})
                .exec((err,incomeData) => {
                    if(err) {reject(err)};
                    totalIncome = _.reduce(incomeData,(sum, item) => {
                        return sum + item.amount
                    },0);
                    Expense.aggregate([
                        {"$match":{"year":filter.year,"month": filter.month.toUpperCase()}}
                        ,{
                            "$lookup": {
                                "from": "expenseType",
                                "localField": "expenseType",
                                "foreignField": "_id",
                                "as": "expenseType"
                            }
                        }
                        ,{
                            "$unwind": "$expenseType"
                        }
                        ,{
                            "$group":{
                                "_id":{"expenseType":"$expenseType.value"},
                                "total":{"$sum":"$amount"},
                                "year": {"$first":"$year"},
                                "month": {"$first":"$month"}
                            }
                        }
                        ,{
                            "$project": {
                                "expenseType":'$_id.expenseType',
                                "total":1
                            }
                        }
                    ])
                    .exec((err, expensesResults) => {
                        if(err) {reject(err)}
                        _.each(expensesResults, item => {
                            totalExpenditure+= item.total;
                        });
                       
                        let finalReport = {
                            totalIncome: totalIncome,
                            totalExpenditure: totalExpenditure,
                            expensesByType: expensesResults
                        };
                        resolve(finalReport);
                    });
                });
            } else if(filter.expenseType) {
                // report for expense type for asked years
                if(filter.year) {
                    // "2021-2021"
                    const startYear = parseInt(filter.year.split('-')[0]);
                    const endYear = parseInt(filter.year.split('-')[1]);
                    if(startYear && endYear) {
                        Expense.aggregate([
                            {"$match":{"$and":[
                                {year: {"$lte": endYear}},
                                {year: {"$gte": startYear}}
                            ]}}
                            ,{
                                "$lookup": {
                                    "from": "expenseType",
                                    "localField": "expenseType",
                                    "foreignField": "_id",
                                    "as": "expenseType"
                                }
                            }
                            ,{
                                "$unwind": "$expenseType"
                            },
                            {
                                "$project": {
                                    year:1,
                                    month:1,
                                    amount:1,
                                    expenseType: '$expenseType.value'
                                }
                            },
                            {
                                "$match": {
                                    "expenseType": filter.expenseType
                                }
                            }
                            ,{
                                "$group":{
                                    "_id":{"year":"$year", "month": "$month"},
                                    "total":{"$sum":"$amount"},
                                    "year": {"$first":"$year"},
                                    "month": {"$first":"$month"},
                                    "expenseType": {"$first":"$expenseType"},
                                }
                            }
                            ,{
                                "$project": {
                                    expenseType:1,
                                    year:1,
                                    month:1,
                                    total:1
                                }
                            }
                        ]).exec((err, reportData) => {
                            if(err) {reject(err)}
                            resolve(reportData);
                        });
                    } else {
                        reject({message: 'Invalid report parameters.start and end year needed for report for an expense type'});
                    }
                }
            }else {
                 reject("unsupported report requested");
            }
        });
    }
}

module.exports = ReportController;