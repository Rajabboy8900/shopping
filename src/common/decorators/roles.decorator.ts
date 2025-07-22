import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/auth/role.enum'; // enum'ni to‘g‘ri import qilish esdan chiqmasin

export const ROLES_KEY = 'roles';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
