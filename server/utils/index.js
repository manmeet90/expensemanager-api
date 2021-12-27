const {isArray, isObject} = require('util');

module.exports = {
    prepareErrorResponse: (err) => {
        if(isArray(err)) {
            return {
                status: 'error',
                data: null,
                errors: err
            };
        }else if(isObject(err)) {
            return {
                status: 'error',
                data: null,
                errors: [{
                    message : err.message
                }]
            };
        }else {
            return {
                status: 'error',
                data: null,
                errors: [{
                    message : err
                }]
            };
        }
    } ,
    prepareSuccessResponse: (data) => {
        let res =  {
            status : 'success',
            data: {},
            errors : null
        };
        data = _normalizeData(data);
        if(isArray(data)) {
            res.data.items = data;
        }else {
            res.data = data;
        }

        return res;
    },
    getMonthString: (month) => {
        monthString = '';
        switch(month) {
            case 0: {
                monthString = 'JAN';
                break;
            }
            case 1: {
                monthString = 'FEB';
                break;
            }
            case 2: {
                monthString = 'MAR';
                break;
            }
            case 3: {
                monthString = 'APR';
                break;
            }
            case 4: {
                monthString = 'MAY';
                break;
            }
            case 5: {
                monthString = 'JUN';
                break;
            }
            case 6: {
                monthString = 'JUL';
                break;
            }
            case 7: {
                monthString = 'AUG';
                break;
            }
            case 8: {
                monthString = 'SEP';
                break;
            }
            case 9: {
                monthString = 'OCT';
                break;
            }
            case 10: {
                monthString = 'NOV';
                break;
            }
            case 11: {
                monthString = 'DEC';
                break;
            }
        }

        return monthString;
    },
    getMonthFromString: (monthString) => {
        let month = 0;
        switch(monthString.toUpperCase()) {
            case 'JAN': {
                month = 0;
                break;
            }
            case 'FEB': {
                month = 1;
                break;
            }
            case 'MAR': {
                month = 2;
                break;
            }
            case 'APR': {
                month = 3;
                break;
            }
            case 'MAY': {
                month = 4;
                break;
            }
            case 'JUN': {
                month = 5;
                break;
            }
            case 'JUL': {
                month = 6;
                break;
            }
            case 'AUG': {
                month = 7;
                break;
            }
            case 'SEP': {
                month = 8;
                break;
            }
            case 'OCT': {
                month = 9;
                break;
            }
            case 'NOV': {
                month = 10;
                break;
            }
            case 'DEC': {
                month = 11;
                break;
            }
        }
        return month;
    }
};

function _normalizeData(response){
    let data = response;
    if(isArray(data)){
        data.forEach(item => {
            if(isObject(item) && item._doc){
                item = item._doc;
                item.id = item._id;
                delete item._id;
                for(key in item){
                    if(key === '__v'){
                        delete item[key];
                    }else if(isArray(item[key])){
                        clearAttributes(item[key]);
                    }
                }
            }
        });
    }else if(isObject(data) && data._doc){
        data = data._doc;
        data.id = data._id;
        delete data._id;
        for(key in data){
            if(key === '__v'){
                delete data[key];
            }else if(isArray(data[key])){
                clearAttributes(data[key]);
            }
        }
    }

    return data;
}

function clearAttributes(data) {
    data.forEach(item => {
        if(isObject(item) && item._doc){
            item = item._doc;
            item.id = item._id;
            delete item._id;
            for(key in item){
                if(key === '__v'){
                    delete item[key];
                }
            }
        }
    })
}