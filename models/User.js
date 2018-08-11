const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//User Schema
const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    verified:{
        type: Number,
        default: 0
    },
    date:{
        type: Date,
        default: Date.now()
    },
    pwd_expiry:{
        type: Date
    }
});

mongoose.model('users', UserSchema);