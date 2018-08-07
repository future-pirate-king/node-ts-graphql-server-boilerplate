import { request } from 'graphql-request';
import { User } from '../entity/User';
import { startServer } from '../startServer';

let getHost = () => '';

beforeAll(async () => {
  const app = await startServer();
  const { port } = app.address();
  getHost = () => `http://127.0.0.1:${port}`;
});

const email = 'samd851@mail.com';
const password = 'gsfgsgsf';

const mutation = `
  mutation {
    register(email: "${email}", password: "${password}")
  }
`;

test('Register User', async () => {
  const response = await request(getHost(), mutation);
  expect(response).toEqual({ register: true });

  const users = await User.find({ where: { email } });
  expect(users.length).toEqual(1);

  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);
});
