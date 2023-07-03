import type { NextApiRequest, NextApiResponse } from 'next';
import { scheduleJob } from 'node-schedule';
import lineClient from '@/applications/lineClient';
import { notificationTime } from '@/consts/time';
import { convertToCron } from '@/utils/common';
import { filter, format, readFromCache } from '@/utils/reservation';
import { readAll } from '@/utils/user';

const push = async () => {
  try {
    const users = await readAll();
    const filteredUsers = users.filter((user) => user.notification === 'ON');
    if (filteredUsers.length === 0) return;
    const reservations = await readFromCache();
    filteredUsers.forEach((user) => {
      const filteredReservations = filter(reservations, user);
      const text = format(filteredReservations);
      lineClient.pushMessage(user.id, {
        type: 'text',
        text,
      });
    });
  } catch (err) {
    console.error(err);
  }
};

scheduleJob(convertToCron(notificationTime), push);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).end();
};

export default handler;
