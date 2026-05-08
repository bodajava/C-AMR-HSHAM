import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: 'config/.env' });

const dbUrl = process.env.DB_URL;
const adminId = '69fd0759e01c91f6056496fe';

const meals = [
  {
    name: 'Chicken & Rice Meal Prep',
    ingredients: ['1 chicken breast', '1 cup rice', '2 cups water', 'Salt', 'Black pepper', 'Paprika', 'Garlic powder', 'Mixed vegetables'],
    instructions: [
      'Wash the rice well.',
      'Cook rice with water for 15–20 minutes.',
      'Season chicken with spices.',
      'Grill chicken for 5–7 minutes on each side.',
      'Serve with rice and vegetables.'
    ],
    calories: 500,
    protein: 35,
    carbs: 50,
    fats: 12,
    prepTime: '30 min',
    videoUrl: 'https://www.youtube.com/results?search_query=healthy+chicken+and+rice+recipe',
    userId: adminId
  },
  {
    name: 'Grilled Chicken Breast',
    ingredients: ['1 chicken breast', 'Lemon juice', 'Garlic', 'Salt', 'Black pepper', 'Olive oil'],
    instructions: [
      'Marinate chicken with all ingredients.',
      'Heat a grill pan.',
      'Grill chicken until fully cooked.',
      'Serve with salad or rice.'
    ],
    calories: 300,
    protein: 45,
    carbs: 0,
    fats: 8,
    prepTime: '20 min',
    videoUrl: 'https://www.youtube.com/results?search_query=healthy+grilled+chicken+recipe',
    userId: adminId
  },
  {
    name: 'Low Calorie Fried Rice',
    ingredients: ['1 cup cooked rice', 'Carrots', 'Peas', 'Soy sauce', 'Olive oil', 'Garlic'],
    instructions: [
      'Heat olive oil in a pan.',
      'Add vegetables and garlic.',
      'Add cooked rice and soy sauce.',
      'Mix everything well.',
      'Cook for 5 minutes and serve.'
    ],
    calories: 350,
    protein: 10,
    carbs: 60,
    fats: 7,
    prepTime: '15 min',
    videoUrl: 'https://www.youtube.com/results?search_query=low+calorie+fried+rice+recipe',
    userId: adminId
  },
  {
    name: 'Healthy Tuna Salad',
    ingredients: ['Tuna', 'Lettuce', 'Cucumber', 'Tomatoes', 'Lemon juice', 'Black pepper'],
    instructions: [
      'Chop all vegetables.',
      'Add tuna to a bowl.',
      'Mix vegetables with tuna.',
      'Add lemon juice and pepper.',
      'Serve fresh.'
    ],
    calories: 250,
    protein: 30,
    carbs: 5,
    fats: 10,
    prepTime: '10 min',
    videoUrl: 'https://www.youtube.com/results?search_query=healthy+tuna+salad+recipe',
    userId: adminId
  },
  {
    name: 'Healthy Pasta Recipe',
    ingredients: ['Pasta', 'Chicken breast', 'Tomato sauce', 'Garlic', 'Olive oil', 'Salt', 'Black pepper'],
    instructions: [
      'Boil pasta until soft.',
      'Cook chicken with garlic and spices.',
      'Add tomato sauce.',
      'Mix pasta with the sauce.',
      'Serve hot.'
    ],
    calories: 450,
    protein: 25,
    carbs: 55,
    fats: 12,
    prepTime: '25 min',
    videoUrl: 'https://www.youtube.com/results?search_query=healthy+pasta+recipe',
    userId: adminId
  },
  {
    name: 'Air Fryer Chicken Recipe',
    ingredients: ['Chicken pieces', 'Paprika', 'Garlic powder', 'Salt', 'Black pepper', 'Olive oil'],
    instructions: [
      'Season chicken with spices.',
      'Put chicken in the air fryer.',
      'Cook at 180°C for 15–20 minutes.',
      'Flip halfway through cooking.',
      'Serve hot.'
    ],
    calories: 350,
    protein: 40,
    carbs: 0,
    fats: 15,
    prepTime: '25 min',
    videoUrl: 'https://www.youtube.com/results?search_query=healthy+air+fryer+chicken+recipe',
    userId: adminId
  },
  {
    name: 'Oats Breakfast Recipe',
    ingredients: ['Oats', 'Milk', 'Banana', 'Honey', 'Peanut butter'],
    instructions: [
      'Add oats and milk to a bowl.',
      'Cook for 3–5 minutes.',
      'Add banana slices.',
      'Add honey or peanut butter.',
      'Serve warm.'
    ],
    calories: 400,
    protein: 15,
    carbs: 65,
    fats: 10,
    prepTime: '10 min',
    videoUrl: 'https://www.youtube.com/results?search_query=healthy+oats+breakfast+recipe',
    userId: adminId
  },
  {
    name: 'High Protein Omelette',
    ingredients: ['Eggs', 'Low-fat cheese', 'Tomatoes', 'Bell pepper', 'Salt', 'Black pepper'],
    instructions: [
      'Beat eggs in a bowl.',
      'Add vegetables and cheese.',
      'Pour into a non-stick pan.',
      'Cook until firm.',
      'Fold and serve.'
    ],
    calories: 300,
    protein: 25,
    carbs: 5,
    fats: 20,
    prepTime: '10 min',
    videoUrl: 'https://www.youtube.com/results?search_query=high+protein+omelette+recipe',
    userId: adminId
  },
  {
    name: 'Healthy Smoothie',
    ingredients: ['Milk', 'Banana', 'Oats', 'Peanut butter', 'Protein powder'],
    instructions: [
      'Add all ingredients to a blender.',
      'Blend for 30 seconds.',
      'Pour into a glass.',
      'Serve cold.'
    ],
    calories: 350,
    protein: 30,
    carbs: 40,
    fats: 8,
    prepTime: '5 min',
    videoUrl: 'https://www.youtube.com/results?search_query=healthy+protein+smoothie+recipe',
    userId: adminId
  }
];

async function insertMeals() {
  try {
    await mongoose.connect(dbUrl);
    console.log('Connected to DB');
    
    const db = mongoose.connection.db;
    const MealCol = db.collection('Meal');
    
    // Check if meals already exist to avoid duplicates if needed, 
    // but user asked to insert "every meal directly".
    
    const result = await MealCol.insertMany(meals.map(m => ({
      ...m,
      userId: new mongoose.Types.ObjectId(m.userId),
      createdAt: new Date(),
      updatedAt: new Date()
    })));
    
    console.log(`Successfully inserted ${result.insertedCount} meals`);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error inserting meals:', error);
  }
}

insertMeals();
