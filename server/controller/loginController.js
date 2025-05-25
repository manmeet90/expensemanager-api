const {User} = require('../models');

class LoginController {

    login(username, password) {
        //let passwordbtoa = Buffer.from(password).toString("base64");
        return new Promise((resolve, reject) => { 
            User.findOne({username:username.toLowerCase(), password:password})
            .exec((err, doc) => {
                if(err) {
                    reject(err);
                }else if(doc && doc.isEnabled) {
                    resolve("login successful");
                }else {
                    reject('login failed');
                }
            });
        });
    }
}

module.exports = LoginController;
