import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = "mongodb+srv://ozgur:ozgur@cluster0.wjju3xz.mongodb.net/atolye15?retryWrites=true&w=majority";

if (!MONGODB_URI) {
  throw new Error('MongoDB URI bulunamadı. Lütfen .env dosyasını kontrol edin.');
}

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB bağlantısı başarılı');
  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error);
    process.exit(1);
  }
};

export default connectDB; 