const dotenv = require('dotenv');
const fs = require('fs');
const line = require('@line/bot-sdk');
const path = require('path');

const cwd = process.cwd();

dotenv.config({ path: path.resolve(cwd, '.env.local') });

const lineClient = new line.Client({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.CHANNEL_SECRET || '',
});

const richMenu = {
  size: {
    width: 2500,
    height: 843,
  },
  selected: true,
  name: 'skydiving',
  chatBarText: 'メニュー',
  areas: [
    {
      bounds: {
        x: 0,
        y: 0,
        width: 625,
        height: 843,
      },
      action: {
        type: 'message',
        text: '全件取得',
        label: '全件取得',
      },
    },
    {
      bounds: {
        x: 626,
        y: 0,
        width: 625,
        height: 843,
      },
      action: {
        type: 'message',
        text: 'カスタム取得',
        label: 'カスタム取得',
      },
    },
    {
      bounds: {
        x: 1251,
        y: 0,
        width: 625,
        height: 843,
      },
      action: {
        type: 'uri',
        uri: process.env.NEXT_PUBLIC_URL,
        label: '設定',
      },
    },
    {
      bounds: {
        x: 1876,
        y: 0,
        width: 625,
        height: 843,
      },
      action: {
        type: 'uri',
        uri: 'https://tokyoskydivingclub.jp/体験スカイダイビングご予約new/',
        label: '公式サイト',
      },
    },
  ],
};

(async () => {
  const richMenuList = await lineClient.getRichMenuList();
  richMenuList.forEach((menu) => lineClient.deleteRichMenu(menu.richMenuId));
  const richMenuId = await lineClient.createRichMenu(richMenu);
  const image = fs.readFileSync(path.resolve(cwd, 'images/richmenu.png'));
  await lineClient.setRichMenuImage(richMenuId, image, 'image/png');
  await lineClient.setDefaultRichMenu(richMenuId);
})();
