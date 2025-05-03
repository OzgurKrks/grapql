import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { json } from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './utils/database';
import typeDefs from './schemas';
import resolvers from './resolvers';
import { createContext } from './utils/context';

// .env dosyasını yükle
dotenv.config();

// Express uygulamasını oluştur
const app = express();

// Middleware'leri ayarla
app.use(cors());
app.use(json());

// MongoDB'ye bağlan
connectDB();

// Apollo Server'ı başlat
const startApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: createContext
  });

  await server.start();
  server.applyMiddleware({ app: app as any });

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startApolloServer().catch((error) => {
  console.error('Server başlatılırken hata oluştu:', error);
}); 