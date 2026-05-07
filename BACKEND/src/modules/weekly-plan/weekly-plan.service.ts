import WeeklyPlanModel from '../../DB/model/weekly-plan.model.js';
import { Types } from 'mongoose';

class WeeklyPlanService {
    async getByDay(day: string) {
        return await WeeklyPlanModel.findOne({ day: day.toLowerCase() })
            .populate('workouts')
            .populate('meals');
    }

    async updateByDay(day: string, data: { workouts?: string[], meals?: string[], notes?: string }) {
        const update: any = {};
        if (data.workouts) update.workouts = data.workouts.map(id => new Types.ObjectId(id));
        if (data.meals) update.meals = data.meals.map(id => new Types.ObjectId(id));
        if (data.notes !== undefined) update.notes = data.notes;

        return await WeeklyPlanModel.findOneAndUpdate(
            { day: day.toLowerCase() },
            update,
            { upsert: true, new: true }
        );
    }

    async getAll() {
        return await WeeklyPlanModel.find()
            .populate('workouts')
            .populate('meals');
    }
}

export const weeklyPlanService = new WeeklyPlanService();
