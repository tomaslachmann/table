import { User, UserRoleVariant } from '../types';

export const users: User[] = [
  {
    uuid: 1,
    email: 'admin@gmail.com',
    password: 'admin',
    role: UserRoleVariant.admin,
  },
  {
    uuid: 2,
    email: 'editor@gmail.com',
    password: 'editor',
    role: UserRoleVariant.editor,
  },
  {
    uuid: 3,
    email: 'reader@gmail.com',
    password: 'reader',
    role: UserRoleVariant.reader,
  },
];