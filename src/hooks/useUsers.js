import { useData } from './useData.js';
import { userService } from '../services/userService.js';

export function useUsers({ page = 1, limit = 20, q = '', role = '' } = {}) {
  return useData(({ signal }) => userService.list({ page, limit, q, role, signal }), [page, limit, q, role]);
}
