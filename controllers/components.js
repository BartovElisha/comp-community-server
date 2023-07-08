const joi = require('joi');
const { User } = require('../models/User');
const { Component } = require('../models/Component');
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
                manufacturer: joi.string().required().min(2).max(255),
                mfrPartNumber: joi.string().required().min(2).max(255),
                catalogNumber: joi.string().required().min(2).max(255),
                description: joi.string().required().min(2).max(1024),
                category: joi.string().required().min(2).max(255),
                avalibleStock: joi.number().required().min(0).max(100000),
                dateCode: joi.string().required().min(2).max(255)
            }); 

            const { error, value } = schema.validate(req.body);
            
            if (error) {
                console.log(chalk.red(error.details[0].message));
                throw 'Error adding component';
            }

            const component = new Component({
                manufacturer: value.manufacturer,
                mfrPartNumber: value.mfrPartNumber,
                catalogNumber: value.catalogNumber,
                description: value.description,
                category: value.category,
                avalibleStock: value.avalibleStock,
                dateCode: value.dateCode,
                creator_id: user._id
            });

            const newComponent = await component.save();
            res.json(newComponent);
        }
        catch (err) {
            console.log(chalk.red(err.message));
            res.status(400).json({ error: 'Error adding component'});
        }
    }, 

    // Read
    list: async function (req, res, next) {
        try {
            const result = await Component.find({});
            res.json(result);
        }
        catch (err) {
            console.log(chalk.red(err));
            res.status(400).json({ error: 'Error getting cpmponents' });
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

            const component = await Component.findById(value.id);
            if (!component) 
                throw "Invalid component id, no such component.";
            
            res.json(component);
        }
        catch (err) {
            res.status(400).json({ error: "Invalid data" });
            console.log(chalk.red(`Error: ${err}`));
        }
    },

    userComponents: async function (req, res, next) {
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

            const component = await Component.find({ creator_id: user._id });
            res.json(component);
        }
        catch (err) {
            res.status(400).json({ error: `Error get components of a user` });
            console.log(chalk.red(err.message));
        }
    },

    // Update
    updateDetails: async function (req, res, next) {
        try {
            const user = await User.findOne({ email: req.token.email });
            if (!user || !user.isBiz) throw "Not a business user";

            const schema = joi.object({
                manufacturer: joi.string().required().min(2).max(255),
                mfrPartNumber: joi.string().required().min(2).max(255),
                catalogNumber: joi.string().required().min(2).max(255),
                description: joi.string().required().min(2).max(1024),
                category: joi.string().required().min(2).max(255),
                avalibleStock: joi.number().required().min(0).max(100000),
                dateCode: joi.string().required().min(2).max(255)
            });

            const { error, value } = schema.validate(req.body);
            if (error) {
                console.log(chalk.red(error.details[0].message));
                throw 'Error updating component';
            }

            const filter = {
                _id: req.params.id,
                userID: user._id,
            };

            const component = await Component.findOneAndUpdate(filter, value);

            if (!component) 
                throw "No component with this ID in the database";
            
            const updatedComponent = await Component.findById(component._id);
            res.json(updatedComponent);
        }
        catch (err) {
            console.log(chalk.red(err.message));
            res.status(400).json({ error: `Error updating component` });
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

            const component = await Component.findById(value.id);
            
            if (!component.users_likes_id.includes(user._id))
            {
                component.users_likes_id.push(user._id);
            } 
            else if (component.users_likes_id.includes(user._id))
            {
                component.users_likes_id.pull(user._id);
            }                       

            // Update document
            const updatedDoc = await component.save();                

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
                throw `Error delete component`;
            }

            const deleted = await Component.findOneAndRemove({
                _id: value.id,
                user_id: user._id,
            });

            if (!deleted) 
                throw "Failed to delete";
            
            res.json(deleted);
        }
        catch (err) {
            console.log(chalk.red(err.message));
            res.status(400).json({ error: `Error delete component` });
        }
    }
}