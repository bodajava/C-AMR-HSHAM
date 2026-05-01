import { model, Schema, Document } from "mongoose";

export interface IMeal extends Document {
    name: string;
    ingredients: string[];
    instructions: string[];
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    prepTime: string;
    image?: string; // S3 key or URL
    videoUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const mealSchema = new Schema<IMeal>({
    name: { type: String, required: true },
    ingredients: { type: [String], required: true },
    instructions: { type: [String], required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fats: { type: Number, required: true },
    prepTime: { type: String, required: true },
    image: { type: String },
    videoUrl: { type: String },
}, {
    timestamps: true,
    collection: "Meal",
});

const MealModel = model<IMeal>("Meal", mealSchema);

export default MealModel;
