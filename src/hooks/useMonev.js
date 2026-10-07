import { useData } from './useData.js';
import { monevService } from '../services/monevService.js';

export function useMonevBatches() {
  return useData(({ signal }) => monevService.batches({ signal }), []);
}

export function useMonevBatch(batchId) {
  return useData(({ signal }) => monevService.batch(batchId, { signal }), [batchId], { enabled: !!batchId });
}

export function useOpds({ enabled = true } = {}) {
  return useData(({ signal }) => monevService.opds({ signal }), [], { enabled });
}

export function useMyMonevEntries() {
  return useData(({ signal }) => monevService.myEntries({ signal }), []);
}
