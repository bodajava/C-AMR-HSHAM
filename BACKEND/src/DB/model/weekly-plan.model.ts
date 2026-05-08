import { model, Schema, Document } from "mongoose";

export interface IWeeklyPlan extends Document {
    day: string; // 'monday', 'tuesday', etc.
    workouts: Schema.Types.ObjectId[];
    meals: Schema.Types.ObjectId[];
    notes?: string;
    userId: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const weeklyPlanSchema = new Schema<IWeeklyPlan>({
    day: { 
        type: String, 
        required: true, 
        lowercase: true,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    workouts: [{ type: Schema.Types.ObjectId, ref: 'Workout' }],
    meals: [{ type: Schema.Types.ObjectId, ref: 'Meal' }],
    notes: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true,
    collection: "WeeklyPlan",
});

weeklyPlanSchema.index({ userId: 1, day: 1 }, { unique: true });

const WeeklyPlanModel = model<IWeeklyPlan>("WeeklyPlan", weeklyPlanSchema);

export default WeeklyPlanModel;
