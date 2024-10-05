import mongoose from 'mongoose';

const CenterSchema = new mongoose.Schema({
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
        unique: true,
        match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number']  // Indian phone number validation without country code
    },
    isActive: {
        type: Boolean,
        default: true
    },
    geoAddress: {
        type: String,
        required: true,
    },
    coordinates: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    city: {
        type: String,
        required: true,
        default: ''
    },
    state: {
        type: String,
        required: true,
        default: ''
    },
    coverImage: { 
        type: String,
        required: false,
    },
    centerGallery: { 
        type: [String],
        required: false,
    },
    doi: {
        type: Date,
        default: Date.now
    },
    openingTiming: {
        stTime: {
            type: String,
            required: true,
        },
        edTime: {
            type: String,
            required: true,
        }
    },
    ownerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

CenterSchema.index({ coordinates: '2dsphere' });
const Center = mongoose.model('Center', CenterSchema);
export default Center;
