const { User } = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/dev');
const joi = require('joi');
const bcrypt = require('bcrypt');
const chalk = require('chalk');  // Importing the chalk module

let nodemailer = require('nodemailer');
const smtpEmailHost = process.env.SMTP_EMAIL_HOST;
const smtpEmailPort = process.env.SMTP_EMAIL_PORT;
const smtpUserEmail = process.env.SMTP_USER_EMAIL;
const smptUserPass = process.env.SMTP_USER_PASS;

let secretCode = 0;
let email = "";

module.exports = {
    signin: async function (req, res, next) {
        try {
            const schema = joi.object({
                email: joi.string().required().min(6).max(255).email(),
                password: joi.string().required().min(6).max(1024),
            });

            const { error, value } = schema.validate(req.body);

            if (error) {
                console.log(chalk.red(error.details[0].message));
                throw 'Unauthorized';
            }

            const user = await User.findOne({ email: value.email });
            if (!user) 
                throw Error;

            if (!user.isActive) 
                throw 'User is not Active';
            
            const validPassword = await bcrypt.compare(value.password, user.password);
            
            if (!validPassword) 
                throw 'Invalid password';

            const param = { email: value.email };
            const token = jwt.sign(param, config.jwt_token, { expiresIn: process.env.JWT_EXPIRESIN });

            res.json({
                token: token,
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isBiz: user.isBiz,
                isAdmin: user.isAdmin
            });
        }
        catch (err) {
            console.log(chalk.red(`Error: ${err}`));
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
    },

    userValidate: async function (req, res, next) {
        try {
            const schema = joi.object({
                email: joi.string().required().min(6).max(255).email(),
                password: joi.string().required().min(6).max(1024),
            });

            const { error, value } = schema.validate(req.body);

            if (error) {
                console.log(chalk.red(error.details[0].message));
                throw 'Unauthorized';
            }

            const user = await User.findOne({ email: value.email });
            if (!user) 
                throw Error;

            if (!user.isActive) 
                throw 'User is not Active';
            
            const validPassword = await bcrypt.compare(value.password, user.password);
            
            if (!validPassword) 
                throw 'Invalid password';

            res.json({
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isBiz: user.isBiz,
                isAdmin: user.isAdmin,
                isActive: user.isActive
            });
        }
        catch (err) {
            console.log(chalk.red(`Error: ${err}`));
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
    },

    // CRUD operations
    // Create    
    signup: async function (req, res, next) {
        try {
            const schema = joi.object({
                firstName: joi.string().required().min(2).max(255),
                lastName: joi.string().required().min(2).max(255),
                email: joi.string().min(6).max(255).required().email(),
                password: joi.string().min(6).max(1024).required(),
                isBiz: joi.boolean().required()
            });

            const { error, value } = schema.validate(req.body);

            if (error) {
                console.log(chalk.red(error.details[0].message));
                throw 'error sign up new user';
            }

            const user = await User.findOne({ email: value.email });
            if (user) {
                return res.status(400).json({ error: "User already registered." });
            }

            const hash = await bcrypt.hash(value.password, 10);

            const newUser = new User({
                firstName: value.firstName,
                lastName: value.lastName,
                gender: "Unknown",
                email: value.email,
                password: hash,
                isBiz: value.isBiz,
            });

            await newUser.save();

            res.json({
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                isBiz: newUser.isBiz,
                isAdmin: newUser.isAdmin
            })
        }
        catch (err) {
            console.log(chalk.red(err.message));
            res.status(400).json({ error: 'error sign up new user' });
        }
    },

    signupBusiness: async function (req, res, next) {
        try {
            const schema = joi.object({
                firstName: joi.string().required().min(2).max(255),
                lastName: joi.string().required().min(2).max(255),
                gender: joi.string().required().min(2).max(255),
                dateOfBirth: joi.date().required(),
                email: joi.string().min(6).max(255).required().email(),
                password: joi.string().min(6).max(1024).required(),
                phoneNumber: joi.string().required().min(9).max(17),
                mobileNumber: joi.string().min(0).max(17),
                company: joi.string().required().min(2).max(255),
                jobTitle: joi.string().min(0).max(255),
                city: joi.string().required().min(2).max(255),
                state: joi.string().required().min(2).max(255),
                zipCode: joi.string().required().min(2).max(255),
                isBiz: joi.boolean().required()
            });

            const { error, value } = schema.validate(req.body);

            if (error) {
                console.log(chalk.red(error.details[0].message));
                throw 'error sign up new user';
            }

            const user = await User.findOne({ email: value.email });
            if (user) {
                return res.status(400).json({ error: "User already registered." });
            }

            const hash = await bcrypt.hash(value.password, 10);

            const newUser = new User({
                firstName: value.firstName,
                lastName: value.lastName,
                gender: value.gender,
                dateOfBirth: value.dateOfBirth,                
                email: value.email,
                password: hash,
                phoneNumber: value.phoneNumber,
                mobileNumber: value.mobileNumber,
                company: value.company,
                jobTitle: value.jobTitle,
                city: value.city,
                state: value.state,
                zipCode: value.zipCode,                
                isBiz: value.isBiz,
            });

            await newUser.save();

            res.json({
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                gender: newUser.gender,
                dateOfBirth: newUser.dateOfBirth,                 
                email: newUser.email,
                phoneNumber: newUser.phoneNumber,
                mobileNumber: newUser.mobileNumber,
                company: newUser.company,
                jobTitle: newUser.jobTitle,
                city: newUser.city,
                state: newUser.state,
                zipCode: newUser.zipCode,                
                isBiz: newUser.isBiz,
                isAdmin: newUser.isAdmin
            })
        }
        catch (err) {
            console.log(chalk.red(err.message));
            res.status(400).json({ error: 'error sign up new user' });
        }
    },

    // Read
    list: async function (req, res, next) {
        try {
            const user = await User.findOne({ email: req.token.email});
            if (!user || !user.isAdmin)
                throw "Not a Admin user";

            const result = await User.find({});
            res.json(result);
        }
        catch (err) {
            console.log(chalk.red(err));
            res.status(400).json({ error: 'Error getting users' });
        }        
    },

    details: async function (req, res, next) {
        try {
            const schema = joi.object({
                id: joi.string().required(),
            });

            const { error, value } = schema.validate(req.params);

            if (error) {
                console.log(chalk.red(error.details[0].message));
                throw 'error get details';
            }

            const user = await User.findById(value.id);
            
            if (!user) 
                throw "Invalid user id, no such user.";

            // res.json(user); // Do Not Send Full User Info !!!
            res.json({
                firstName: user.firstName,
                lastName: user.lastName,
                gender: user.gender,
                dateOfBirth: user.dateOfBirth,                 
                email: user.email,
                phoneNumber: user.phoneNumber,
                mobileNumber: user.mobileNumber,
                company: user.company,
                jobTitle: user.jobTitle,
                city: user.city,
                state: user.state,
                zipCode: user.zipCode,
                isBiz: user.isBiz,
                isAdmin: user.isAdmin,
                isActive: user.isActive,
                createdAt: user.createdAt
            });
        }
        catch (err) {
            res.status(400).json({ error: "Invalid data" });
            console.log(chalk.red(`Error: ${err}`));
        }
    },

    sendSecretCode: async function (req, res, next) {
        try {
            const schema = joi.object({
                email: joi.string().min(6).max(255).required().email()
            });

            const { error, value } = schema.validate(req.body);

            if (error) {
                console.log(chalk.red(error.details[0].message));
                throw 'error get details';
            }

            const user = await User.findOne({ email: value.email });

            if (!user) 
                throw "Invalid user email, no such user.";

            // Save email address and secretCode for later use in update metode.
            email = user.email;
            secretCode = Math.floor(Math.random() * 10000000);    

            // Send secret code to the email addres.
            let transporter = nodemailer.createTransport({
                host: smtpEmailHost,
                port: smtpEmailPort,
                secure: true,
                auth: {
                    user: smtpUserEmail,
                    pass: smptUserPass
                }
            });  
           
            let mailOptions = {
                from: 'youremail@gmail.com',
                to: email,
                subject: 'Components Community Application Password reset Request',
                text: `Secret Code is: ${secretCode.toString()} Received from the Components Community application for the purpose of resetting a password. 
                Please enter the secret code in the application to update a new password.`
            }; 
            
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error.message);
                } 
                else {
                    console.log('Email sent: ' + info.response);
                    res.status(200).json({ok:'mail sent'});
                }
            });            
        }
        catch (err) {
            res.status(400).json({ error: "Invalid data" });
            console.log(chalk.red(`Error: ${err}`));
        }
    },

    // Update
    updatePassword: async function (req, res, next) {
        try {
            const schema = joi.object({
                email: joi.string().min(6).max(255).required().email(),
                secretCode: joi.string().min(1).max(8).required(),
                newPassword: joi.string().min(6).max(1024).required()
            });

            const { error, value } = schema.validate(req.body);

            if (error) {
                console.log(chalk.red(error.details[0].message));
                throw 'error updating password';
            }

            if(+value.secretCode !== secretCode || value.email !== email) {
                throw 'error updating password';    
            }

            const user = await User.findOne({ email: value.email });
            if (!user) {
                return res.status(400).json({ error: "Invalid user email, no such user." });
            }

            const hash = await bcrypt.hash(value.newPassword, 10);

            const updatedUser = await User.findOneAndUpdate({ email: user.email}, 
                { password: hash }, 
                { new: true });

            res.json({
                id: updatedUser._id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                isBiz: updatedUser.isBiz,
                isAdmin: updatedUser.isAdmin
            })
        }
        catch (err) {
            console.log(chalk.red(err.message));
            res.status(400).json({ error: 'Error updating password !!!' });
        }
    },

    activateUser: async function (req, res, next) {
        try {
            const user = await User.findOne({ email: req.token.email });

            if (!user || !user.isAdmin) 
                throw 'Not a Admin user';

            const schema = joi.object({
                id: joi.string().required(),
            });

            const { error, value } = schema.validate(req.params);

            if (error) {
                console.log(chalk.red(error.details[0].message));
                throw 'error get details';
            }

            const filter = {
                _id: req.params.id,
                userID: user._id,
            };

            const userData = await User.findOneAndUpdate(filter, {isActive : true});

            if (!userData) 
                throw 'No user with this ID in the database';

            const updatedUser = await User.findById(userData._id);

            if (!updatedUser) 
                throw 'No user with this ID in the database';
            
            // res.json(user); // Do Not Send Full User Info !!!
            res.json({
                _id: updatedUser._id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                isActive: updatedUser.isActive
            });  
        }
        catch (err) {
            console.log(chalk.red(err.message));
            res.status(400).json({ error: `Error updating user` });
        }
    },

    deactivateUser: async function (req, res, next) {
        try {
            const user = await User.findOne({ email: req.token.email });

            if (!user || !user.isAdmin) 
                throw 'Not a Admin user';

            const schema = joi.object({
                id: joi.string().required(),
            });

            const { error, value } = schema.validate(req.params);

            if (error) {
                console.log(chalk.red(error.details[0].message));
                throw 'error get details';
            }

            const filter = {
                _id: req.params.id,
                userID: user._id,
            };

            const userData = await User.findOneAndUpdate(filter, {isActive : false});

            if (!userData) 
                throw 'No user with this ID in the database';

            const updatedUser = await User.findById(userData._id);

            if (!updatedUser) 
                throw 'No user with this ID in the database';
            
            // res.json(user); // Do Not Send Full User Info !!!
            res.json({
                _id: updatedUser._id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                isActive: updatedUser.isActive
            });  
        }
        catch (err) {
            console.log(chalk.red(err.message));
            res.status(400).json({ error: `Error updating user` });
        }
    },

    updateBussinesUser: async function (req, res, next) {
        try {
            const user = await User.findOne({ email: req.token.email });

            if (!user || !user.isActive || !user.isBiz) 
                throw 'User Not Found, Not Active or Not Bussines';

            const schema = joi.object({
                firstName: joi.string().required().min(2).max(255),
                lastName: joi.string().required().min(2).max(255),
                gender: joi.string().required().min(2).max(255),
                dateOfBirth: joi.date().required(),
                email: joi.string().min(6).max(255).required().email(),
                password: joi.string().min(6).max(1024).required(),
                phoneNumber: joi.string().required().min(9).max(17),
                mobileNumber: joi.string().min(0).max(17),
                company: joi.string().required().min(2).max(255),
                jobTitle: joi.string().min(0).max(255),
                city: joi.string().required().min(2).max(255),
                state: joi.string().required().min(2).max(255),
                zipCode: joi.string().required().min(2).max(255),
                isBiz: joi.boolean().required()
            });

            const { error, value } = schema.validate(req.body);
            if (error) {
                console.log(chalk.red(error.details[0].message));
                throw 'Error updating user';
            }

            const hash = await bcrypt.hash(value.password, 10);
            value.password = hash;

            const filter = {
                _id: req.params.id,
                userID: user._id,
            };

            const result = await User.findOneAndUpdate(filter, value);            

            if (!result) 
                throw "No user with this ID in the database";
            
            const updatedUser = await User.findById(result._id);

            // res.json(updatedUser); // Do Not Send Full User Info !!!
            res.json({
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                gender: updatedUser.gender,
                dateOfBirth: updatedUser.dateOfBirth,                 
                email: updatedUser.email,
                phoneNumber: updatedUser.phoneNumber,
                mobileNumber: updatedUser.mobileNumber,
                company: updatedUser.company,
                jobTitle: updatedUser.jobTitle,
                city: updatedUser.city,
                state: updatedUser.state,
                zipCode: updatedUser.zipCode,
                isBiz: updatedUser.isBiz,
                isAdmin: updatedUser.isAdmin,
                isActive: updatedUser.isActive,
                createdAt: updatedUser.createdAt
            });
        }
        catch (err) {
            console.log(chalk.red(err.message));
            res.status(400).json({ error: `Error updating user` });            
        }
    }
}
