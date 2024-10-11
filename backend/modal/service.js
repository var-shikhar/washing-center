import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
    centerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Center',
        required: true
    },
    serviceID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceItem',
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    discPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    isAvailable: {
        type: Boolean,
        required: true,
        default: true,
    },
    isCustomizable: {
        type: Boolean,
    },
    addons: [{
        addonID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ServiceItem',
            required: true
        },
        price: {
            type: Number,
            required: true,
            default: 0 // Price for the addon
        },
        discPrice: {
            type: Number,
            required: true,
            default: 0,
        },
    }],
}, { timestamps: true });

const Service = mongoose.model('Service', ServiceSchema);
export default Service;