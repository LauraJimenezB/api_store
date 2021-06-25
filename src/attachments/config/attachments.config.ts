import { registerAs } from '@nestjs/config';

export default registerAs('attachment', () => ({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
  bucket: process.env.AWS_BUCKET,
  expirationTime: +process.env.AWS_PRESIGNED_EXPIRES_IN,
}));
