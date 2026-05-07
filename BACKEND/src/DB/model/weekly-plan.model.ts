import { model, Schema, Document } from "mongoose";

export interface IWeeklyPlan extends Document {
    day: string; // 'monday', 'tuesday', etc.
    workouts: Schema.Types.ObjectId[];
    meals: Schema.Types.ObjectId[];
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const weeklyPlanSchema = new Schema<IWeeklyPlan>({
    day: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    workouts: [{ type: Schema.Types.ObjectId, ref: 'Workout' }],
    meals: [{ type: Schema.Types.ObjectId, ref: 'Meal' }],
    notes: { type: String },
}, {
    timestamps: true,
    collection: "WeeklyPlan",
});

const WeeklyPlanModel = model<IWeeklyPlan>("WeeklyPlan", weeklyPlanSchema);

export default WeeklyPlanModel;
