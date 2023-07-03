const fs = require('fs');
const path = require('path');

const jsonFile = path.resolve(process.cwd(), 'cert.json');
const envFile = path.resolve(process.cwd(), '.env.local');

const json = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
const env = fs.readFileSync(envFile, 'utf8');

const newEnv = Object.entries(json)
  .map(([key, value]) => ['FIREBASE_' + key.toUpperCase(), value])
  .reduce(
    (acc, [key, value]) =>
      acc.replace(new RegExp(`${key}=\n`), `${key}=${JSON.stringify(value)}\n`),
    env
  );

fs.writeFileSync(envFile, newEnv);
