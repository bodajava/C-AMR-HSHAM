import { Request, Response } from 'express';
import bootstrap from '../src/app.bootstrap.js';

let appInstance: any;

export default async function handler(req: Request, res: Response) {
  if (!appInstance) {
    appInstance = await bootstrap();
  }
  return appInstance(req, res);
}
