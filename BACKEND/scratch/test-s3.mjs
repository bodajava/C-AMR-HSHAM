
import { S3Client, GetBucketLocationCommand } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";
import { join } from "path";

dotenv.config({ path: join(process.cwd(), "BACKEND/config/.env") });

const client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
  },
});

async function testS3() {
  try {
    const data = await client.send(new GetBucketLocationCommand({ Bucket: process.env.S3_BUCKET_NAME }));
    console.log("Bucket Name:", process.env.S3_BUCKET_NAME);
    console.log("Bucket Region:", data.LocationConstraint || "us-east-1");
  } catch (err) {
    console.error("Error getting bucket location:", err);
  }
}

testS3();
