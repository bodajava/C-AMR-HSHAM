import WorkoutModel, { IWorkout } from "../../DB/model/workout.model.js";
import { NotFoundException } from "../../common/exception/domain.exception.js";
import { S3Service } from "../../common/services/s3.service.js";

export class WorkoutService {
    private s3 = new S3Service();

    async createPresignedUrl(data: { ContentType: string, originalname: string }) {
        const path = "workouts";
        const finalName = data.originalname;
        const { url, Key } = await this.s3.createPresignedUploadLink({
            path,
            ContentType: data.ContentType,
            originalname: finalName,
        });
        return { url, Key };
    }

    async create(data: Partial<IWorkout>) {
        const workout = new WorkoutModel(data);
        return await workout.save();
    }

    async findAll(filter: any = {}) {
        return await WorkoutModel.find(filter).sort({ createdAt: -1 });
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
