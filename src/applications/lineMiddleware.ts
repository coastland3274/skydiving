import { middleware } from '@line/bot-sdk';
import { MiddlewareConfig } from '@line/bot-sdk';

const middlewareConfig: MiddlewareConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.CHANNEL_SECRET || '',
};

const lineMiddleware = middleware(middlewareConfig);

export default lineMiddleware;
