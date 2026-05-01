import { model, Schema, Document } from "mongoose";

export interface IPerformanceMetrics extends Document {
    livePulse: number;
    intensity: number;
    dailyFuel: number;
    hydration: number;
    performanceLevel: string;
    targetThreshold: string;
    goalAchievement: string;
    protein: number;
    proteinGoal: number;
    carbs: number;
    carbsGoal: number;
    fats: number;
    fatsGoal: number;
    sleepScore: number;
    updatedAt: Date;
}

const performanceMetricsSchema = new Schema<IPerformanceMetrics>({
    livePulse: { type: Number, default: 0 },
    intensity: { type: Number, default: 0 },
    dailyFuel: { type: Number, default: 0 },
    hydration: { type: Number, default: 0 },
    performanceLevel: { type: String, default: "Standard" },
    targetThreshold: { type: String, default: "N/A" },
    goalAchievement: { type: String, default: "0%" },
    protein: { type: Number, default: 0 },
    proteinGoal: { type: Number, default: 210 },
    carbs: { type: Number, default: 0 },
    carbsGoal: { type: Number, default: 320 },
    fats: { type: Number, default: 0 },
    fatsGoal: { type: Number, default: 85 },
    sleepScore: { type: Number, default: 88 },
}, {
    timestamps: true,
    collection: "PerformanceMetrics",
});

const PerformanceMetricsModel = model<IPerformanceMetrics>("PerformanceMetrics", performanceMetricsSchema);

export default PerformanceMetricsModel;
