import type { NextApiRequest, NextApiResponse } from 'next';
import type { Profile } from '@line/bot-sdk';
import axios from 'axios';
import { isUserWithToken, type User } from '@/types/user';
import { createOrUpdate, readAfterCreate } from '@/utils/user';

type Message = {
  message: string;
};

const getUserId = async (token: string) => {
  const res = await axios.get<Profile>('https://api.line.me/v2/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.userId;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Message | User>
) => {
  switch (req.method) {
    case 'GET': {
      const query = req.query;
      const token = String(query.token);
      try {
        const userId = await getUserId(token);
        const user = await readAfterCreate(userId);

        return res.status(200).json(user);
      } catch (e) {
        return axios.isAxiosError(e) && e.response
          ? res.status(e.response.status).json(e.response.data)
          : res.status(500).json({ message: 'Internal Server Error' });
      }
    }
    case 'POST': {
      const body = req.body;
      if (!isUserWithToken(body)) {
        return res.status(400).json({ message: 'Bad Request' });
      }
      const { token, ...user } = body;
      try {
        const userId = await getUserId(token);
        await createOrUpdate(userId, user);
        res.status(200).end();
      } catch (e) {
        return axios.isAxiosError(e) && e.response
          ? res.status(e.response.status).json(e.response.data)
          : res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  }
};

export default handler;
