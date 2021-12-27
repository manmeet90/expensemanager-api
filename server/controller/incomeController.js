const {Income} = require('../models');

class IncomeController {

    getIncomeForMonth(filter) {
        return new Promise((resolve, reject) => { 
            Income.find(filter).exec((err, result) => {
                if(err) {
                    reject(err);
                }
                resolve(result);
            });
        });
    }

    updateIncome(amount, year, month) {
        return new Promise((resolve, reject) => { 
            Income.findOne({month:month, year: year}).exec((err, result) => {
                if(err) {
                    reject(err);
                }
                if(result) {
                    result.amount = amount;
                    result.save((err) => {
                        if(err) {
                            reject(err);
                        }
                        resolve('Income updated successfully');
                    });
                }else {
                    let income = new Income({
                        amount,year,month
                    });
                    income.save((err) => {
                        if(err) {
                            reject(err);
                        }
                        resolve('Income updated successfully');
                    });
                }
            });
        });
    }
}

module.exports = IncomeController;