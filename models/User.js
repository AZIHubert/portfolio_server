const { model, Schema } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const bcrypt = require('bcryptjs');

const { PASSWORDREGISTRATION } = require('../config');

const validateEmail = email => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const SALT_WORK_FACTOR = 12;

const userSchema = new Schema({
    username: {
        type: String,
        trim: true,
        unique: true,
        required: 'Can\'t be empty',
        min: [4, 'Need to be at least 4 characters'],
        max: [15, 'Need to be at most 15 characters']
    },
    firstname: {
        type: String,
        trim: true,
        required: 'Can\'t be empty',
    },
    lastname: {
        type: String,
        trim: true,
        required:  'Can\'t be empty',
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Can\'t be empty',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: 'Can\'t be empty',
        min: [8, 'Need to be at least 8 characters'],
        max: [25, 'Need to be at most 25 characters']

    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: false
    },
    profilePicture: {
        type: Schema.Types.ObjectId,
        ref: 'Image',
        default: null
    }
}, {
    timestamps: true
});

userSchema.plugin(uniqueValidator, { message: '{PATH} already exist.' });

userSchema.virtual('confirmPassword')
    .get(() =>  this._confirmPassword)
    .set(value => this._confirmPassword = value);

userSchema.virtual('passwordRegistration')
    .get(() => this._passwordRegistration)
    .set(value => this._passwordRegistration = value);

userSchema.pre('validate', function(next){
    if (this.passwordRegistration !== PASSWORDREGISTRATION)
        this.invalidate('passwordRegistration', 'enter the correct password');
    if (this.password !== this.confirmPassword)
        this.invalidate('confirmPassword', 'enter the same password');
    next();
});

userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(12, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

module.exports = model('User', userSchema);