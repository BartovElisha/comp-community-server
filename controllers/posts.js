const joi = require('joi');
const { User } = require('../models/User');
const { Post } = require('../models/Post');
const chalk = require('chalk');  // Importing the chalk module

module.exports = {
    // CRUD operations
    // Create
    create: async function (req, res, next) {
        try {
            const user = await User.findOne({ email: req.token.email});
            if (!user)
                throw "No user found";

            const schema = joi.object({
                title: joi.string().required().min(2).max(255),
                subject: joi.string().required().min(2).max(255),
                body: joi.string().required().min(2).max(65535)
            }); 

            const { error, value } = schema.validate(req.body);
            
            if (error) {
                console.log(chalk.red(error.details[0].message));
                throw 'Error adding post';
            }
            
            const post = new Post({
                title: value.title,
                subject: value.subject,
                body: value.body,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                postNumber: Math.floor(Math.random() * 10000000),
                creator_id: user._id
            });

            const newPost = await post.save();
            res.json(newPost);
        }
        catch (err) {
            console.log(chalk.red(err.message));
            res.status(400).json({ error: 'Error adding post'});
        }
    }, 

    // Read
    list: async function (req, res, next) {
        try {
            const result = await Post.find({});
            res.json(result);
        }
        catch (err) {
            console.log(chalk.red(err));
            res.status(400).json({ error: 'Error getting posts' });
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

            const post = await Post.findById(value.id);
            if (!post) 
                throw "Invalid post id, no such post.";
            
            res.json(post);
        }
        catch (err) {
            res.status(400).json({ error: "Invalid data" });
            console.log(chalk.red(`Error: ${err}`));
        }
    },   
    
    userPosts: async function (req, res, next) {
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
            if (!user) 
                throw "Invalid user id, no such user.";

            const posts = await Post.find({ creator_id: user._id });
            res.json(posts);
        }
        catch (err) {
            res.status(400).json({ error: `Error get posts of a user` });
            console.log(chalk.red(err.message));
        }
    },    

    // Update
    updateDetails: async function (req, res, next) {
        try {
            const user = await User.findOne({ email: req.token.email });
            if (!user) 
                throw "No user found";

            const schema = joi.object({
                title: joi.string().required().min(2).max(255),
                subject: joi.string().required().min(2).max(255),
                body: joi.string().required().min(2).max(1024)
            });

            const { error, value } = schema.validate(req.body);
            if (error) {
                console.log(chalk.red(error.details[0].message));
                throw 'Error updating post';
            }

            const filter = {
                _id: req.params.id,
                userID: user._id,
            };

            const post = await Post.findOneAndUpdate(filter, value);

            if (!post) 
                throw "No post with this ID in the database";
            
            const updatedPost = await Post.findById(post._id);
            res.json(updatedPost);
        }
        catch (err) {
            console.log(chalk.red(err.message));
            res.status(400).json({ error: `Error updating post` });
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

            const post = await Post.findById(value.id);
            
            if (!post.users_likes_id.includes(user._id))
            {
                post.users_likes_id.push(user._id);
            } 
            else if (post.users_likes_id.includes(user._id))
            {
                post.users_likes_id.pull(user._id);
            }                       

            // Update document
            const updatedDoc = await post.save();                

            res.json(updatedDoc);
        } 
        catch (err) {
            console.log(chalk.red(err.message));
            res.status(400).json({ error: `Error updating like` });            
        }
    }, 

    addComment: async function(req, res, next) {
        try {
            const schema = joi.object({
                id: joi.string().required(),
            });
            const { error, value } = schema.validate(req.params);
            
            if (error) {
                console.log(chalk.red(error.details[0].message));
                throw 'Error get details';
            }

            const post = await Post.findById(value.id);
            
            post.comments.push(req.body.comment);

            // Update document
            const updatedPost = await post.save();                

            res.json(updatedPost); 
        }
        catch (err) {
            res.status(400).json({ error: "Invalid data" });
            console.log(chalk.red(`Error: ${err}`));
        }               
    },

    // Delete    
    delete: async function (req, res, next) {
        try {
            const user = await User.findOne({ email: req.token.email });
            if (!user) 
                throw "No user found";

            const schema = joi.object({
                id: joi.string().required(),
            });

            const { error, value } = schema.validate(req.params);

            if (error) {
                console.log(chalk.red(error.details[0].message));
                throw `Error delete post`;
            }

            const deleted = await Post.findOneAndRemove({
                _id: value.id,
                user_id: user._id,
            });

            if (!deleted) 
                throw "Failed to delete";
            
            res.json(deleted);
        }
        catch (err) {
            console.log(chalk.red(err.message));
            res.status(400).json({ error: `Error delete post` });
        }
    }
}
