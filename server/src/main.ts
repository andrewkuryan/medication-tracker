import express, { Express } from 'express';
import cors from 'cors';

import userRoutes from './routes/user';

const expressApp = express();
const port = 8090;

const startServer = (app: Express) => {
  app.use(cors());
  app.use(express.json());

  app.use('/users', userRoutes);

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is listening on port ${port}`);
  });
};

startServer(expressApp);
