import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../modal/user.js';
import DEFAULT_DATA from '../constant/defaultData.js';
import Month from '../modal/month.js';
import Vehicle from '../modal/vehicle.js';
import ServiceCategory from '../modal/serviceCategory.js';
import ServiceItem from '../modal/serviceItem.js';

dotenv.config();
const { MONGO_URI, SALT } = process.env;
const { MONTH_LIST, SERVICE_VEHICLE_LIST, SERVICE_CATEGORY_LIST, SERVICE_LIST } = DEFAULT_DATA;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);

        const userCount = await User.countDocuments();
        const monthCount = await Month.countDocuments();
        const vehicleCount = await Vehicle.countDocuments();
        const categoryCount = await ServiceCategory.countDocuments();
        const serviceItemCount = await ServiceItem.countDocuments();

        if (userCount === 0) {
            const hashedPassword = await bcrypt.hash('Admin@123', Number(SALT));
            let user = new User({
                name: 'Admin User',
                email: 'admin@washingcenter.com',
                phone: 9876543210,
                password: hashedPassword,
                isActive: true,
                isAdmin: true,
                isEmailVerified: true,
            });

            await user.save();
            console.log('Default user created');
        }     
        
        if(monthCount === 0){
            await Month.insertMany(MONTH_LIST);
            console.log('Month data inserted');
        }

        if(vehicleCount === 0){
            await Vehicle.insertMany(SERVICE_VEHICLE_LIST);
            console.log('Vehicle data inserted');
        }

        if(categoryCount === 0){
            await ServiceCategory.insertMany(SERVICE_CATEGORY_LIST);
            console.log('Service category data inserted');
        }

        if(serviceItemCount === 0){
            if(SERVICE_LIST?.length > 0){
                const vehicleList = await Vehicle.find();
                const categoryList = await ServiceCategory.find();

                for (const item of SERVICE_LIST) {
                    const foundVehicle = vehicleList.find(option => option.name === item.vehicle)
                    const foundCategory = categoryList.find(option => option.name === item.category)
                    if(foundVehicle && foundCategory){
                        let serviceItem = new ServiceItem({
                            name: item.name,
                            description: item.description,
                            coverImage: item.coverImage,
                            category: foundCategory._id,
                            vehicle: foundVehicle._id,
                        });
                        await serviceItem.save();
                    }
                }
            }
        }
        
        console.log('MongoDB connected successfully');
        mongoose.connection.emit('connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

export default connectDB;
