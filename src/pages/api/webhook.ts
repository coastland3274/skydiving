import type { NextApiRequest, NextApiResponse } from 'next';
import { WebhookEvent } from '@line/bot-sdk';
import lineMiddleware from '@/applications/lineMiddleware';
import followEventHandler from '@/events/followEventHandler';
import textEventHandler from '@/events/textEventHandler';
import { isIterable } from '@/utils/common';

export const config = {
  api: {
    bodyParser: false,
  },
};

const runMiddlweware = async (req: NextApiRequest, res: NextApiResponse) =>
  new Promise((resolve, reject) =>
    lineMiddleware(req, res, (result) =>
      result instanceof Error ? reject(result) : resolve(result)
    )
  );

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      await runMiddlweware(req, res);
    } catch {
      return res.status(401).json({ status: 'error' });
    }

    const events: WebhookEvent[] | undefined = req.body?.events;

    if (!isIterable(events)) {
      return res.status(401).json({ status: 'error' });
    }

    const results = await Promise.all(
      events.map(async (event: WebhookEvent) => {
        try {
          await followEventHandler(event);
          await textEventHandler(event);
        } catch (err: unknown) {
          return res.status(500).json({
            status: 'error',
          });
        }
      })
    );

    return res.status(200).json({
      status: 'success',
      results,
    });
  }
};

export default handler;
