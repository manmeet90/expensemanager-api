const db = require('mongoose');
const {Config} = require('../models');

function getAppConfig() {
    return new Promise((resolve, reject) => {
        Config.findOne({type:'appConfig'}).exec((err, data)=>{
            if(err){
                console.error(err);
                reject(err);
            }
            resolve(data);
        });
    });
}
module.exports = {
    getAppConfig : getAppConfig
};