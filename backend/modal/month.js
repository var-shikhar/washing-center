import mongoose from "mongoose";

const MonthSchema = mongoose.Schema({
    name: {
        type: String,
        required: true, 
        unique: true,
    },
    abbreviation: {
        type: String,
        required: true, 
        unique: true,
    },
})

const Month = mongoose.model('Month', MonthSchema);
export default Month;