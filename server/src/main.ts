import express, { Express } from 'express';
import cors from 'cors';

const expressApp = express();
const port = 8090;

const startServer = (app: Express) => {
  app.use(cors());
  app.use(express.json());

  app.use('/', (_, res) => {
    res.status(200).json({ hello: 'Hello' });
  });

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is listening on port ${port}`);
  });
};

startServer(expressApp);
