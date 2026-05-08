import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, 'config/.env') });

async function debugDB() {
  try {
    const dbUrl = process.env.DB_URL;
    await mongoose.connect(dbUrl);
    const db = mongoose.connection.db;
    
    const collections = await db.listCollections().toArray();
    console.log('Collections in "social-app":');
    for (let col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`- ${col.name}: ${count} documents`);
      
      if (col.name === 'User' || col.name === 'users') {
        const docs = await db.collection(col.name).find().toArray();
        docs.forEach(d => {
          console.log(`  [${col.name}] Email: ${d.email}, Role: ${d.role}, Name: ${d.firstName} ${d.lastName}`);
        });
      }
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
  }
}

debugDB();
