import mongoose from 'mongoose';
import ServiceItem from './serviceItem.js';

const ServiceCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
}, { timestamps: true });

ServiceCategorySchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const categoryID = this._id;

    try {
        const associatedServiceItems = await ServiceItem.find({ category: categoryID });

        if (associatedServiceItems.length > 0) {
            let undefinedServiceCategory = await mongoose.model('ServiceCategory').findOne({ name: 'undefined' });
            if (!undefinedServiceCategory) {
                undefinedServiceCategory = await mongoose.model('ServiceCategory').create({ name: 'undefined' });
            }

            await ServiceItem.updateMany({ category: categoryID }, { $set: { category: undefinedServiceCategory._id } });
        }

        next();
    } catch (error) {
        next(error);
    }
});
const ServiceCategory = mongoose.model('ServiceCategory', ServiceCategorySchema);
export default ServiceCategory;