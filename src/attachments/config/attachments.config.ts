import { registerAs } from '@nestjs/config';

export default registerAs('attachment', () => ({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  bucket: process.env.AWS_BUCKET,
  expirationTime: +process.env.PRESIGNED_EXPIRES_IN,
}));