import mongoose from 'mongoose';

const ServiceCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
}, { timestamps: true });

const ServiceCategory = mongoose.model('ServiceCategory', ServiceCategorySchema);
export default ServiceCategory;