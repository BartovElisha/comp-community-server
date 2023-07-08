const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255
    },
    subTitle: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255        
    },
    description: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 1024        
    },
    address: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255          
    },
    city: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255          
    },
    state: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255          
    },
    phoneNumber: {
        type: String,
        required: true,
        minlength: 9,
        maxlength: 17          
    },
    imageUrl: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 1024         
    },
    bizNumber: {
        type: String,
        required: true,
        minlength: 7,
        maxlength: 7                
    },
    rating: {
        type: Number,
        required: true,
        minlength: 1,
        maxlength: 10                
    },
    creator_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    users_likes_id: [mongoose.SchemaTypes.ObjectId],
    createdAt: {
        type: Date,
        required: true,
        default: new Date()        
    }
});

const Company = mongoose.model("company", companySchema);

exports.Company = Company;