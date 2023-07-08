const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
    gender: {
        type: String,
        require: false,
        minlength: 2,
        maxlength: 255
    },
    dateOfBirth: {
        type: Date,
        required: false
    },      
    email: {
        type: String,
        require: true,
        minlength: 6,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024
    },
    phoneNumber: {
        type: String,
        require: false,
        minlength: 9,
        maxlength: 17
    },
    mobileNumber: {
        type: String,
        require: false,
        minlength: 0,
        maxlength: 17
    },
    company: {
        type: String,
        require: false,
        minlength: 2,
        maxlength: 255        
    },
    jobTitle: {
        type: String,
        require: false,
        minlength: 0,
        maxlength: 255        
    },
    city: {
        type: String,
        require: false,
        minlength: 2,
        maxlength: 255        
    },
    state: {
        type: String,
        require: false,
        minlength: 2,
        maxlength: 255        
    },
    zipCode: {
        type: String,
        require: false,
        minlength: 2,
        maxlength: 255        
    },    
    isBiz: {
        type: Boolean,
        required: true,
        default: false        
    },
    isAdmin: {
        type: Boolean,
        required: false,
        default: false        
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true        
    },
    users_likes_id: [mongoose.SchemaTypes.ObjectId],
    createdAt: {
        type: Date,
        required: true,
        default: new Date()        
    }
});

const User = mongoose.model('User', userSchema);

exports.User = User;