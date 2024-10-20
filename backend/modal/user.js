import mongoose from 'mongoose';
import Center from './washingCenter.js';
import Booking from './booking.js';

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
        required: false,
        unique: true,
        sparse: true
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
    isMember: {
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
    userRole: {
        type: String,
        enum: ['Client', 'Admin'],
        required: false,
        default: 'Client'
    }
}, { timestamps: true });

UserSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    try {
        const userId = this._id;
        const centers = await Center.find({ ownerID: userId });

        for (const center of centers) {
            await Booking.deleteMany({ centerID: center._id });
        }

        await Center.deleteMany({ ownerID: userId });

        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model('User', UserSchema);
export default User;
