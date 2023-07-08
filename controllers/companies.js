const joi = require('joi');
const { User } = require('../models/User');
const { Company } = require('../models/Company');
const chalk = require('chalk');  // Importing the chalk module

module.exports = {
    // CRUD operations
    // Create
    create: async function (req, res, next) {
        try {
            const user = await User.findOne({ email: req.token.email});
            if (!user || !user.isBiz)
                throw "Not a business user";

            const schema = joi.object({
                title: joi.string().required().min(2).max(255),
                subTitle: joi.string().required().min(2).max(255),
                description: joi.string().required().min(2).max(1024),
                address: joi.string().required().min(2).max(255),
                city: joi.string().required().min(2).max(255),
                state: joi.string().required().min(2).max(255),
                phoneNumber: joi.string().required().min(9).max(17),
                imageUrl: joi.string().min(2).max(1024)
            }); 

            const { error, value } = schema.validate(req.body);
            
            if (error) {
                console.log(chalk.red(error.details[0].message));
                throw 'Error adding company';
            }

            const company = new Company({
                title: value.title,
                subTitle: value.subTitle,
                description: value.description,
                address: value.address,
                city: value.city,
                state: value.state,
                phoneNumber: value.phoneNumber,
                imageUrl: value.imageUrl,
                bizNumber: Math.floor(Math.random() * 10000000),
                rating: 1,
                creator_id: user._id
            });

            const newCompany = await company.save();
            res.json(newCompany);
        }
        catch (err) {
            console.log(chalk.red(err.message));
            res.status(400).json({ error: 'Error adding company'});
        }
    }, 

    // Read
    list: async function (req, res, next) {
        try {
            const result = await Company.find({});
            res.json(result);
        }
        catch (err) {
            console.log(chalk.red(err));
            res.status(400).json({ error: 'Error getting companies' });
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
                throw `Error get details`;
            }

            const company = await Company.findById(value.id);
            if (!company) 
                throw "Invalid company id, no such company.";
            
            res.json(company);
        }
        catch (err) {
            res.status(400).json({ error: "Invalid data" });
            console.log(chalk.red(`Error: ${err}`));
        }
    },

    userCompanies: async function (req, res, next) {
        try {
            const schema = joi.object({
                id: joi.string().required(),
            });

            const { error, value } = schema.validate(req.params);

            if (error) {
                console.log(chalk.red(error.details[0].message));
                throw 'Error get details';
            }

            const user = await User.findById(value.id);
            if (!user || !user.isBiz) 
                throw "Invalid user id, no such user.";

            const companies = await Company.find({ creator_id: user._id });
            res.json(companies);
        }
        catch (err) {
            res.status(400).json({ error: `Error get companies of a user` });
            console.log(chalk.red(err.message));
        }
    },

    // Update
    updateDetails: async function (req, res, next) {
        try {
            const user = await User.findOne({ email: req.token.email });
            if (!user || !user.isBiz) throw "Not a business user";

            const schema = joi.object({
                title: joi.string().required().min(2).max(255),
                subTitle: joi.string().required().min(2).max(255),
                description: joi.string().required().min(2).max(1024),
                address: joi.string().required().min(2).max(255),
                city: joi.string().required().min(2).max(255),
                state: joi.string().required().min(2).max(255),
                phoneNumber: joi.string().required().min(9).max(17),
                imageUrl: joi.string().min(2).max(1024)
            });

            const { error, value } = schema.validate(req.body);
            if (error) {
                console.log(chalk.red(error.details[0].message));
                throw 'Error updating company';
            }

            const filter = {
                _id: req.params.id,
                userID: user._id,
            };

            const company = await Company.findOneAndUpdate(filter, value);

            if (!company) 
                throw "No company with this ID in the database";
            
            const updatedCompany = await Company.findById(company._id);
            res.json(updatedCompany);
        }
        catch (err) {
            console.log(chalk.red(err.message));
            res.status(400).json({ error: `Error updating company` });
        }
    }, 

    updateLikesList: async function (req, res, next) {
        try {
            const user = await User.findOne({ email: req.token.email });
            if (!user) throw "Not a user";

            // Validate item id
            const schema = joi.object({
                id: joi.string().required(),
            });
            const { error, value } = schema.validate(req.params);
            
            if (error) {
                console.log(chalk.red(error.details[0].message));
                throw 'Error get details';
            }

            const company = await Company.findById(value.id);
            
            if (!company.users_likes_id.includes(user._id))
            {
                company.users_likes_id.push(user._id);
            } 
            else if (company.users_likes_id.includes(user._id))
            {
                company.users_likes_id.pull(user._id);
            }                       

            // Update document
            const updatedDoc = await company.save();                

            res.json(updatedDoc);
        } 
        catch (err) {
            console.log(chalk.red(err.message));
            res.status(400).json({ error: `Error updating like` });            
        }
    },
   
    // Delete    
    delete: async function (req, res, next) {
        try {
            const user = await User.findOne({ email: req.token.email });
            if (!user || !user.isBiz) throw "Not a business user";

            const schema = joi.object({
                id: joi.string().required(),
            });

            const { error, value } = schema.validate(req.params);

            if (error) {
                console.log(chalk.red(error.details[0].message));
                throw `Error delete company`;
            }

            const deleted = await Company.findOneAndRemove({
                _id: value.id,
                user_id: user._id,
            });

            if (!deleted) 
                throw "Failed to delete";
            
            res.json(deleted);
        }
        catch (err) {
            console.log(chalk.red(err.message));
            res.status(400).json({ error: `Error delete company` });
        }
    }
}