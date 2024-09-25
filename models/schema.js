//schema for blog db
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const {isEmail} = require('validator');
const bcrypt = require('bcrypt')

const schemaObj = new schema({
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Email is invalid"]
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: [7, "Passwords have to be 7 characters long"]
    }
}, { timestamps: true });

//Mongoose Hook that fires once a new user is registered
schemaObj.pre('save', async function(next) {
    if (!this.isModified('password')) return next(); // Only hash the password if it has been modified

    try {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds); // Hash the password
        next();
    } catch (err) {
        console.error(err);
        next(err);
    }
});

//Method that logs in a user
schemaObj.statics.login = async function(email,password) {
    const user = await this.findOne({ email })
    
    if (user) {
        
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user
        }
        throw new Error('Incorrect Password')
    }
    throw new Error('Incorrect Email')
    
}

const users = mongoose.model('user', schemaObj);
module.exports = users