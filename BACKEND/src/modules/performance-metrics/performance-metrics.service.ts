import PerformanceMetricsModel from "../../DB/model/performance-metrics.model.js";

class PerformanceMetricsService {
    async getMetrics() {
        let metrics = await PerformanceMetricsModel.findOne().sort({ createdAt: -1 });
        if (!metrics) {
            // Create default metrics if none exist
            metrics = await PerformanceMetricsModel.create({
                livePulse: 12480,
                intensity: 94,
                dailyFuel: 2850,
                hydration: 4.5,
                performanceLevel: "Elite Performance Level",
                targetThreshold: "Target Threshold Met",
                goalAchievement: "Goal: 100% Achieved",
                protein: 168,
                proteinGoal: 210,
                carbs: 256,
                carbsGoal: 320,
                fats: 68,
                fatsGoal: 85,
                sleepScore: 88
            });
        }
        return metrics;
    }

    async updateMetrics(data: any) {
        return await PerformanceMetricsModel.findOneAndUpdate({}, data, { upsert: true, new: true });
    }
}

export default new PerformanceMetricsService();
