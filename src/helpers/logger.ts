import pino from 'pino';

const logger = pino({
  level: process.env.LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
  base: {
    pid: false,
  },
});
export default logger;
