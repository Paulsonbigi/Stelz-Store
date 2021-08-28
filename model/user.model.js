const mongoose = require("mongoose")
const { Schema } = mongoose
const validator = require("validator")
const slug = require('mongoose-slug-generator')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const _ = require('lodash');

//Initialize
mongoose.plugin(slug);

const UserSchema = new Schema({
    fullName: {
        type: String,
        required: [true, 'Name field is required']
    },
    firstName: String,
    email: {
        type: String,
        required: [true, 'Email field is required'],
        unique: true,
        validate: [validator.isEmail, "invalid email format, email should be in the form example.gmail.com"],
        lowercase: true,
    },
    phoneNumber: {
        type: String, 
        required: [true, 'Phone nuber field is required']
    },
    rating: {
        type: Number,
        default: 0
    },
    slug: { type: String, slug: "email", unique: true },
    password: {
        type: String,
        minLength: 6,
        select: false,
        required: [true, "password field is required"]
    },
    confirmPassword: {
        type: String,
        validate: {
            validator: function(val){
                return val = this.email
            },
            message: 'password do not match',
        },
        required: [true, 'Confirm password to continue']
    },
    resetLink: {
        type: String,
        default: ""
    },
    mage: String,
    role: {
        type: String,
        enum: ['user', "admin"],
        default: "user"
    },
    forgotPasswordResetToken: {
        type: String,
    },
    forgotPasswordExpires: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    passwordChangedAt: {
        type: Date
    }
})

// hash the password before saving in the database
UserSchema.pre('save', async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);

    this.confirmPassword = undefined
})

UserSchema.pre('save', async function(next){
    if(!this.isModified("password") || this.isNew){
        return next();
    }
    this.passwordChangedAt = Date.now()
    next()
})

UserSchema.methods.getJwtToken = async function (){
    return await jwt.sign({ id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_COOKIE_EXPIRES
    })
};

UserSchema.methods.comparePassword = async function (candidate, savedPassword) {
    return await bcrypt.compare(candidate, savedPassword)
}

UserSchema.methods.createPasswordRestToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.forgotPasswordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex'); 

    
    this.forgotPasswordExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
    
}

module.exports = mongoose.model("user", UserSchema)