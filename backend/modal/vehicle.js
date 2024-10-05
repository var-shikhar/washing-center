import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
}, { timestamps: true });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;