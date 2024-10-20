import mongoose from 'mongoose';

const AdminUserSchema = new mongoose.Schema({
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
    isEmailVerified: {
        type: Boolean,
        required: false,
        default: true
    },
    userRole: {
        type: String,
        enum: ['Super-Admin', 'Manager'],
        required: true,
        default: 'Manager'
    }
}, { timestamps: true });

const AdminUser = mongoose.model('AdminUser', AdminUserSchema);
export default AdminUser;
