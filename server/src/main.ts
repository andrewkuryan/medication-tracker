import express, {
  Express, NextFunction, Request, Response,
} from 'express';
import { ValidationError } from 'yup';
import * as path from 'node:path';
import cors from 'cors';
import morgan from 'morgan';
import useragent from 'express-useragent';
import dotenv from 'dotenv';

import SRPGenerator from './utils/crypto/srp';
import userRoutes from './routes/user';
import medicationRoutes from './routes/medication';
import { ClientError } from './routes/utils/errors';

dotenv.config();
dotenv.config({ path: path.resolve('..', '.env') });

const expressApp = express();

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace, no-shadow
  namespace Express {
    // eslint-disable-next-line no-shadow
    export interface Request {
      srpGenerator: SRPGenerator;
    }
  }
}

const startServer = (app: Express) => {
  app.use(cors());
  app.use(express.json());
  app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));
  app.use(useragent.express());

  const srpGenerator = new SRPGenerator(
    BigInt(process.env.SRP_N ?? 0),
    BigInt(process.env.SRP_G ?? 2),
  );

  app.use((req, _, next) => {
    req.srpGenerator = srpGenerator;
    next();
  });

  app.use('/users', userRoutes);
  app.use('/medications', medicationRoutes);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof ClientError) {
      res.status(error.code);
    } else if (error instanceof ValidationError) {
      res.status(400);
    } else {
      res.status(500);
    }
    res.send(error.message);
  });

  app.listen(process.env.SERVER_PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is listening on port ${process.env.SERVER_PORT}`);
  });
};

startServer(expressApp);
