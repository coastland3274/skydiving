import {
  MessageAPIResponseBase,
  TextMessage,
  WebhookEvent,
} from '@line/bot-sdk';
import lineClient from '@/applications/lineClient';
import { filter, format, readFromCache } from '@/utils/reservation';
import { readAfterCreate } from '@/utils/user';

const textEventHandler = async (
  event: WebhookEvent
): Promise<MessageAPIResponseBase | undefined> => {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return;
  }

  const { replyToken } = event;
  const { text } = event.message;
  let resText = '';

  try {
    switch (text) {
      case '全件取得': {
        const reservations = await readFromCache();
        resText = format(reservations);
        break;
      }
      case 'カスタム取得': {
        const userId = event.source.userId as string;
        const user = await readAfterCreate(userId);
        const reservations = await readFromCache();
        const filteredReservations = filter(reservations, user);
        resText = format(filteredReservations);
        break;
      }
      case '公式': {
        resText = 'https://tokyoskydivingclub.jp';
        break;
      }
      case '設定': {
        resText = 'http://localhost:3000/';
        break;
      }
    }
  } catch (err) {
    console.error(err);
  }

  if (!resText) return;

  const response: TextMessage = {
    type: 'text',
    text: resText,
  };

  await lineClient.replyMessage(replyToken, response);
};

export default textEventHandler;
