import { useData } from './useData.js';
import { groupService } from '../services/groupService.js';

export function useMyGroups({ admin = false } = {}) {
  return useData(({ signal }) => groupService.mine({ signal, admin }), [admin]);
}

export function useGroupDetail(id, { admin = false } = {}) {
  return useData(({ signal }) => groupService.detail(id, { signal, admin }), [id, admin], { enabled: !!id });
}

export function useGroupDeliverables(id) {
  return useData(({ signal }) => groupService.deliverables(id, { signal }), [id], { enabled: !!id });
}

export function useGroupDocumentations(id) {
  return useData(({ signal }) => groupService.documentations(id, { signal }), [id], { enabled: !!id });
}
