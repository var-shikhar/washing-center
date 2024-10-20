import mongoose from 'mongoose';
import ServiceItem from './serviceItem.js';

const vehicleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
}, { timestamps: true });

vehicleSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const vehicleId = this._id;

    try {
        const associatedServiceItems = await ServiceItem.find({ vehicle: vehicleId });

        if (associatedServiceItems.length > 0) {
            let undefinedVehicle = await mongoose.model('Vehicle').findOne({ name: 'undefined' });
            if (!undefinedVehicle) {
                undefinedVehicle = await mongoose.model('Vehicle').create({ name: 'undefined' });
            }

            await ServiceItem.updateMany({ vehicle: vehicleId }, { $set: { vehicle: undefinedVehicle._id } });
        }

        next();
    } catch (error) {
        next(error);
    }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;