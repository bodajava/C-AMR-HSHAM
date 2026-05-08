import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, 'config/.env') });

async function checkUsers() {
  try {
    const dbUrl = process.env.DB_URL;
    if (!dbUrl) {
      console.error('DB_URL not found in .env');
      process.exit(1);
    }
    
    await mongoose.connect(dbUrl);
    
    const db = mongoose.connection.db;
    const UserCol = db.collection('User');
    
    const count = await UserCol.countDocuments();
    console.log('Total documents in "User" collection (Native Driver):', count);
    
    const users = await UserCol.find().toArray();
    console.log('User Details:');
    users.forEach(u => {
      console.log(`- ID: ${u._id}, Email: ${u.email}, Role: ${u.role}, DeletedAt: ${u.deletedAt}, Name: ${u.firstName} ${u.lastName}`);
    });
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkUsers();
