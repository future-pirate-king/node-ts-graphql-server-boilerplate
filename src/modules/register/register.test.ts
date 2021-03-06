import { request } from 'graphql-request';
import { User } from '../../entity/User';
import {
  duplicateEmail,
  emailNotLongEnough,
  emailNotValid,
  passwordNotLongEnough,
} from './errorMessages';
import { createTypeormConn } from '../../utils/createTypeormConn';

beforeAll(async () => {
  await createTypeormConn();
});

const email = 'samd851@mail.com';
const password = 'gsfgsgsf';

const mutation = (e: string, p: string) => `
  mutation {
    register(email: "${e}", password: "${p}") {
      path
      message
    }
  }
`;

describe('Register User', async () => {
  it('check for duplicate email', async () => {
    // register new user
    const response = await request(
      process.env.TEST_HOST as string,
      mutation(email, password)
    );
    expect(response).toEqual({ register: null });

    const users = await User.find({ where: { email } });
    expect(users.length).toEqual(1);

    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);

    // duplicate email
    const response2: any = await request(
      process.env.TEST_HOST as string,
      mutation(email, password)
    );
    expect(response2.register).toHaveLength(1);
    expect(response2.register[0]).toEqual({
      path: 'email',
      message: duplicateEmail,
    });
  });

  it('check for bad email', async () => {
    const response3: any = await request(
      process.env.TEST_HOST as string,
      mutation('sd', password)
    );
    expect(response3).toEqual({
      register: [
        {
          path: 'email',
          message: emailNotLongEnough,
        },
        {
          path: 'email',
          message: emailNotValid,
        },
      ],
    });
  });

  it('check for bad password', async () => {
    const response4: any = await request(
      process.env.TEST_HOST as string,
      mutation(email, 'sd')
    );
    expect(response4).toEqual({
      register: [
        {
          path: 'password',
          message: passwordNotLongEnough,
        },
      ],
    });
  });

  it('check for bad password and email', async () => {
    const response5: any = await request(
      process.env.TEST_HOST as string,
      mutation('em', 'sd')
    );
    expect(response5).toEqual({
      register: [
        {
          path: 'email',
          message: emailNotLongEnough,
        },
        {
          path: 'email',
          message: emailNotValid,
        },
        {
          path: 'password',
          message: passwordNotLongEnough,
        },
      ],
    });
  });
});
