import WeeklyPlanModel from '../../DB/model/weekly-plan.model.js';
import { Types } from 'mongoose';

class WeeklyPlanService {
    async getByDay(userId: string, day: string) {
        return await WeeklyPlanModel.findOne({ userId, day: day.toLowerCase() })
            .populate('workouts')
            .populate('meals');
    }

    async updateByDay(userId: string, day: string, data: { workouts?: string[], meals?: string[], notes?: string }) {
        const update: any = {};
        if (data.workouts) update.workouts = data.workouts.map(id => new Types.ObjectId(id));
        if (data.meals) update.meals = data.meals.map(id => new Types.ObjectId(id));
        if (data.notes !== undefined) update.notes = data.notes;

        return await WeeklyPlanModel.findOneAndUpdate(
            { userId, day: day.toLowerCase() },
            { ...update, userId, day: day.toLowerCase() },
            { upsert: true, new: true }
        );
    }

    async getAll(userId: string) {
        return await WeeklyPlanModel.find({ userId })
            .populate('workouts')
            .populate('meals');
    }
}

export const weeklyPlanService = new WeeklyPlanService();
