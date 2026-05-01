import WorkoutModel, { IWorkout } from "../../DB/model/workout.model.js";
import { NotFoundException } from "../../common/exception/domain.exception.js";

export class WorkoutService {
    async create(data: Partial<IWorkout>) {
        const workout = new WorkoutModel(data);
        return await workout.save();
    }

    async findAll() {
        return await WorkoutModel.find().sort({ createdAt: -1 });
    }

    async findById(id: string) {
        const workout = await WorkoutModel.findById(id);
        if (!workout) throw new NotFoundException("Workout not found");
        return workout;
    }

    async update(id: string, data: Partial<IWorkout>) {
        const workout = await WorkoutModel.findByIdAndUpdate(id, data, { new: true });
        if (!workout) throw new NotFoundException("Workout not found");
        return workout;
    }

    async delete(id: string) {
        const workout = await WorkoutModel.findByIdAndDelete(id);
        if (!workout) throw new NotFoundException("Workout not found");
        return workout;
    }
}

export const workoutService = new WorkoutService();
export default workoutService;
