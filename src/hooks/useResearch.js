import { useData } from './useData.js';
import { researchService } from '../services/researchService.js';

export function useMyResearches({ page = 1, limit = 50, q = '' } = {}) {
  return useData(({ signal }) => researchService.listMine({ page, limit, q, signal }), [page, limit, q]);
}

export function useResearchDetail(slug) {
  return useData(({ signal }) => researchService.detail(slug, { signal }), [slug], { enabled: !!slug });
}

export function usePublicResearches({ page = 1, limit = 12, q = '', category = '', location = '', sort = '' } = {}) {
  return useData(
    ({ signal }) => researchService.listPublic({ page, limit, q, category, location, sort, signal }),
    [page, limit, q, category, location, sort]
  );
}

export function usePublicResearch(slug) {
  return useData(({ signal }) => researchService.publicDetail(slug, { signal }), [slug], { enabled: !!slug });
}

export function useResearchFacets(by) {
  return useData(({ signal }) => researchService.facets(by, { signal }), [by]);
}

export function useDocumentations({ page = 1, limit = 12, research = '', category = '' } = {}) {
  return useData(
    ({ signal }) => researchService.documentations({ page, limit, research, category, signal }),
    [page, limit, research, category]
  );
}

export function useStaffResearches({ page = 1, limit = 20, q = '', status = '' } = {}) {
  return useData(({ signal }) => researchService.staffList({ page, limit, q, status, signal }), [page, limit, q, status]);
}
