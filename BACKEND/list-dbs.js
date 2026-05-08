import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, 'config/.env') });

async function listDatabases() {
  try {
    const dbUrl = process.env.DB_URL;
    if (!dbUrl) {
      console.error('DB_URL not found in .env');
      process.exit(1);
    }
    
    // Connect without specifying a DB to list all
    const clusterUrl = dbUrl.split('?')[0].replace(/\/[^/]+$/, '');
    await mongoose.connect(clusterUrl);
    
    const admin = mongoose.connection.db.admin();
    const dbs = await admin.listDatabases();
    console.log('Databases in cluster:');
    for (const dbInfo of dbs.databases) {
      console.log(`- ${dbInfo.name}`);
      const db = mongoose.connection.useDb(dbInfo.name);
      const collections = await db.db.listCollections().toArray();
      for (const col of collections) {
          const count = await db.db.collection(col.name).countDocuments();
          if (col.name === 'User' || col.name === 'users') {
              console.log(`  * ${col.name}: ${count} documents`);
          }
      }
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

listDatabases();
