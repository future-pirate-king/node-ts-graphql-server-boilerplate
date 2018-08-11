import { startServer } from '../startServer';

export const setup = async () => {
  const app: any = await startServer();
  const { port } = app.address();
  process.env.TEST_HOST = `http://127.0.0.1:${port}`;
};
