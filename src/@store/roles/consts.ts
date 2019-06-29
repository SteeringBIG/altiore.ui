import { ROLE } from '@types';

export const ROLES = {
  ADMINS: [ROLE.ADMIN, ROLE.SUPER_ADMIN],
  ALL: [ROLE.GUEST, ROLE.USER, ROLE.ADMIN, ROLE.SUPER_ADMIN],
  GUESTS: [ROLE.GUEST],
  SUPER_ADMINS: [ROLE.SUPER_ADMIN],
  USERS: [ROLE.USER, ROLE.ADMIN, ROLE.SUPER_ADMIN],
};
