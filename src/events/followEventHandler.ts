import {
  MessageAPIResponseBase,
  TextMessage,
  WebhookEvent,
} from '@line/bot-sdk';
import lineClient from '@/applications/lineClient';
import { createOrUpdate, exists } from '@/utils/user';

const followEventHandler = async (
  event: WebhookEvent
): Promise<MessageAPIResponseBase | undefined> => {
  if (event.type !== 'follow') return;

  const { replyToken } = event;
  const userId = event.source.userId as string;
  if (!exists(userId)) createOrUpdate(userId);

  const response: TextMessage = {
    type: 'text',
    text: '登録ありがとうございます！',
  };

  await lineClient.replyMessage(replyToken, response);
};

export default followEventHandler;
