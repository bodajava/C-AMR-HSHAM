import MealModel, { IMeal } from "../../DB/model/meal.model.js";
import { NotFoundException } from "../../common/exception/domain.exception.js";
import { s3Service, S3Service } from "../../common/services/s3.service.js";

export class MealService {
    private readonly s3: S3Service;

    constructor() {
        this.s3 = s3Service;
    }

    async create(data: Partial<IMeal>) {
        const meal = new MealModel(data);
        return await meal.save();
    }

    async findAll() {
        return await MealModel.find().sort({ createdAt: -1 });
    }

    async findById(id: string) {
        const meal = await MealModel.findById(id);
        if (!meal) throw new NotFoundException("Meal not found");
        return meal;
    }

    async update(id: string, data: Partial<IMeal>) {
        const meal = await MealModel.findByIdAndUpdate(id, data, { new: true });
        if (!meal) throw new NotFoundException("Meal not found");
        return meal;
    }

    async delete(id: string) {
        const meal = await MealModel.findById(id);
        if (!meal) throw new NotFoundException("Meal not found");
        
        if (meal.image) {
            await this.s3.deleteImage({ Key: meal.image });
        }
        
        return await MealModel.findByIdAndDelete(id);
    }

    async createPresignedUrl(data: { ContentType: string, originalname: string, id?: string }) {
        const path = data.id ? `meals/${data.id}` : `meals/temp-${Date.now()}`;
        const { url, Key } = await this.s3.createPresignedUploadLink({
            path,
            ContentType: data.ContentType,
            originalname: data.originalname,
        });
        return { url, Key };
    }
}

export const mealService = new MealService();
export default mealService;
