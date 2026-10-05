import { useData } from './useData.js';
import { newsService } from '../services/newsService.js';

export function usePublishedNews({ page = 1, limit = 10, q = '', category = '', sort = '' } = {}) {
  return useData(
    ({ signal }) => newsService.listPublished({ page, limit, q, category, sort, signal }),
    [page, limit, q, category, sort]
  );
}

export function useNewsCategories() {
  return useData(({ signal }) => newsService.listCategories({ signal }), []);
}

export function useAdminNews({ page = 1, limit = 20, q = '' } = {}) {
  return useData(({ signal }) => newsService.listAll({ page, limit, q, signal }), [page, limit, q]);
}

export function useNewsDetail(id) {
  return useData(({ signal }) => newsService.getById(id, { signal }), [id], { enabled: !!id });
}
