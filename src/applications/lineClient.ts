import { Client } from '@line/bot-sdk';
import { ClientConfig } from '@line/bot-sdk';

const lineClientConfig: ClientConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.CHANNEL_SECRET || '',
};

const lineClient = new Client(lineClientConfig);

export default lineClient;
