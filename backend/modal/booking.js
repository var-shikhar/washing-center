import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true,
    },
    userPhone: {
        type: String,
        required: true,
    },
    centerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Center',
        required: true
    },
    serviceID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    servicePrice: {
        type: Number,
        required: true
    },
    isCustomizable: {
        type: Boolean,
        default: false
    },
    bookingDate: {
        type: Date,
        required: true
    },
    bookingTime: {
        type: String,
        required: true
    },
    isReschedules: {
        type: Boolean,
    },
    bookingLog: [{
        bookingDate: {
            type: Date,
            required: true
        },
        bookingTime: {
            type: String,
            required: true
        },
    }],
    serviceAddons:  [{
        addonID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            required: false
        },
        addonPrice: {
            type: Number,
            required: false
        },
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Rescheduled', 'Cancelled', 'Completed'],
        default: 'Pending',
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Paid', 'Unpaid'],
        default: 'Unpaid',
        required: true
    },
    message: {
        type: String,
    },
    isPublicBooking: {
        type: Boolean,
        default: false
    },
    vehicleNo: {
        type: String,
        required: false
    }
}, { timestamps: true });

const Booking = mongoose.model('Booking', BookingSchema);
export default Booking;
