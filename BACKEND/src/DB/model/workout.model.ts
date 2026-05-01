import { model, Schema, Document } from "mongoose";

export interface ISubExercise {
    name: string;
    videoUrl?: string;
    sets: number;
    reps: string;
    notes?: string;
}

export interface IWorkout extends Document {
    name: string;
    category: string;
    description: string;
    subExercises: ISubExercise[];
    videoUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const subExerciseSchema = new Schema<ISubExercise>({
    name: { type: String, required: true },
    videoUrl: { type: String },
    sets: { type: Number, default: 0 },
    reps: { type: String, default: "0" },
    notes: { type: String },
});

const workoutSchema = new Schema<IWorkout>({
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    subExercises: [subExerciseSchema],
    videoUrl: { type: String },
}, {
    timestamps: true,
    collection: "Workout",
});

const WorkoutModel = model<IWorkout>("Workout", workoutSchema);

export default WorkoutModel;
