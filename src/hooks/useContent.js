import { useData } from './useData.js';
import { contentService } from '../services/contentService.js';

export function useFunding({ status = '', scheme = '' } = {}) {
  return useData(({ signal }) => contentService.listFunding({ status, scheme, signal }), [status, scheme]);
}

export function useSettings() {
  return useData(({ signal }) => contentService.getSettings({ signal }), []);
}

export function useStats() {
  return useData(({ signal }) => contentService.getStats({ signal }), []);
}
