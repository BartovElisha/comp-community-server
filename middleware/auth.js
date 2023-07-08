const jwt = require('jsonwebtoken');
const config = require('../config/dev');
const chalk = require('chalk');  // Importing the chalk module

module.exports = (req, res, next) => {
    if (req.path.includes('signin') ||
        req.path.includes('signup')) {
        next();
        return;
    }

    const token = req.header('x-auth-token');
    
    if (!token) 
    {
        console.log(chalk.red("Access denied. go to /signin"));
        return res.status(401).send('Access denied. go to /signin');
    }        

    try {
        req.token = jwt.verify(token, config.jwt_token);
        next();
    }
    catch (err) {
        console.log(chalk.red(err));
        res.status(401).send('Access denied. go to /signin');
    }
}