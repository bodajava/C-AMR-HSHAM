import { Request, Response } from 'express';
import bootstrap from './app.bootstrap.js';

let appInstance: any;

const handler = async (req: Request, res: Response) => {
  if (!appInstance) {
    appInstance = await bootstrap();
  }
  return appInstance(req, res);
};

if (!process.env.VERCEL) {
  bootstrap();
}

export default handler;
