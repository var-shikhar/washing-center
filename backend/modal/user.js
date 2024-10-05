import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'] 
    },
    phone: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: false,
        default: true
    },
    isAdmin: {
        type: Boolean,
        required: false,
        default: true
    },
    isEmailVerified: {
        type: Boolean,
        required: false,
        default: true
    },
    resetToken: { 
        type: String,
        required: false,
    },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
export default User;
