#!/usr/bin/env sh

npm install
npx prisma generate
npx prisma migrate deploy

#Development:
# npx nodemon src/server.ts

# Production:
npm run clean
npm run build
npm start