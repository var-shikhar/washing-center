import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
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
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
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
    }
}, { timestamps: true });

const Booking = mongoose.model('Booking', BookingSchema);
export default Booking;
