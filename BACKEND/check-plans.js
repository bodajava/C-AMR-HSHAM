import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: 'config/.env' });

const MONGODB_URI = process.env.DB_URL;

async function checkPlans() {
    try {
        await mongoose.connect(MONGODB_URI);
        const collection = mongoose.connection.collection('WeeklyPlan');
        const plans = await collection.find({ userId: new mongoose.Types.ObjectId('69fdaaac8d0b8b513f016eba') }).toArray();
        console.log('Plans for bbido761@gmail.com:');
        console.log(JSON.stringify(plans, null, 2));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

checkPlans();
