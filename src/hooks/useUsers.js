import { useData } from './useData.js';
import { userService } from '../services/userService.js';

export function useUsers({ page = 1, limit = 20, q = '' } = {}) {
  return useData(({ signal }) => userService.list({ page, limit, q, signal }), [page, limit, q]);
}
