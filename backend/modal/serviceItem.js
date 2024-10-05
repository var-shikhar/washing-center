import mongoose from 'mongoose';

const ServiceItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceCategory',
        required: true
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    description: {
        type: String,
        required: false,
        trim: true,
    },
    coverImage: {
        type: String,
    }
}, { timestamps: true });

const ServiceItem = mongoose.model('ServiceItem', ServiceItemSchema);
export default ServiceItem;