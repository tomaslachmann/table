export type parentComponent = {
  children?: React.ReactNode;
};

export type FlashMessage = {
  variant: FlashMessageVariant,
  text: string,
};

export enum FlashMessageVariant {
  SUCCESS = 'success',
  WARNING = 'warning',
  DANGER = 'danger',
}

export enum UserRoleVariant {
  editor = 'editor',
  admin = 'admin',
  reader = 'reader',
}

export type User = {
  uuid: number;
  email: string;
  password: string;
  role: UserRoleVariant;
};

export type UserPrompt = {
  email?: string;
  password?: string;
};

export enum PermissionVariant {
  write = 'write',
  read = 'read',
  edit = 'edit',
  delete = 'delete',
}

export interface FilterParams {}

export enum SortOrder {
  ASC = 'ascending',
  DESC = 'descending',
}

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

export enum ButtonVariant {
  warn = 'warn',
  success = 'success',
  info = 'info',
  normal = 'normal',
}

export enum FilterVariant {
  select = 'SELECT',
  multiSelect = 'MULTISELECT',
  input = 'INPUT',
}