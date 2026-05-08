import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, 'config/.env') });

async function checkCollections() {
  try {
    const dbUrl = process.env.DB_URL;
    if (!dbUrl) {
      console.error('DB_URL not found in .env');
      process.exit(1);
    }
    
    await mongoose.connect(dbUrl);
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections in database:');
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`- ${col.name}: ${count} documents`);
      if (count > 0) {
        const sample = await db.collection(col.name).findOne();
        console.log(`  Sample keys: ${Object.keys(sample).join(', ')}`);
      }
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkCollections();
