const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255
    },
    subject: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255
    },
    body: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 65535
    },
    email: {
        type: String,
        required: false,
        minlength: 2,
        maxlength: 255
    },    
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255
    },
    lastName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255
    },
    postNumber: {
        type: String,
        required: true,
        minlength: 7,
        maxlength: 7                
    },    
    creator_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },  
    comments: [
        {
            firstName: {
                type: String,
                require: true,
                minlength: 2,
                maxlength: 255
            },
            lastName: {
                type: String,
                require: true,
                minlength: 2,
                maxlength: 255
            },
            email: {
                type: String,
                require: true,
                minlength: 6,
                maxlength: 255,
                unique: false
            },
            body: {
                type: String,
                required: true,
                minlength: 2,
                maxlength: 65535
            },
            createdAt: {
                type: Date,
                required: true,
                default: new Date()      
            }   
        }
    ],    
    users_likes_id: [mongoose.SchemaTypes.ObjectId],
    createdAt: {
        type: Date,
        required: true,
        default: new Date()        
    }    
});

const Post = mongoose.model("post", postSchema);

exports.Post = Post;