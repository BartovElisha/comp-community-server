const mongoose = require("mongoose");

const componentSchema = new mongoose.Schema({
    manufacturer: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255
    },
    mfrPartNumber: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255        
    },
    catalogNumber: {
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
    category: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255          
    },
    avalibleStock: {
        type: Number,
        required: true,
        min: 0,
        max: 100000
    },
    dateCode: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255          
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

const Component = mongoose.model("component", componentSchema);

exports.Component = Component;