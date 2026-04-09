export const APP_NAME = 'Super Amber';
export const APP_SLUG = 'superamber';
export const APP_TITLE = `${APP_NAME} | 班级排座与轮转`;
export const BACKUP_FILE_PREFIX = `${APP_SLUG}-backup`;

type StorageKeySpec = {
  current: string;
  legacy: string[];
};

const createStorageKeySpec = (current: string, legacy: string[] = []): StorageKeySpec => ({
  current,
  legacy
});

export const storageKeys = {
  classData: createStorageKeySpec('superamberClassData', ['classSeatingData']),
  userProfile: createStorageKeySpec('superamberUserProfile', ['classSeatingProfile']),
  batchUndo: createStorageKeySpec('superamberBatchUndoData', ['classSeatingBatchUndoData']),
  ocrSettings: createStorageKeySpec('superamberOCRSettings', ['classSeatingOCRSettings']),
  cnfSyncProfile: createStorageKeySpec('superamberCnfSyncProfile', ['classSeatingCnfSyncProfile']),
  usageGuideDismissed: createStorageKeySpec('superamberUsageGuideDismissed', ['classSeatingUsageGuideDismissed']),
  notesPanelWidth: createStorageKeySpec('superamberNotesPanelWidth', ['classSeatingNotesPanelWidth']),
  notesSectionHeight: createStorageKeySpec('superamberNotesSectionHeight', ['classSeatingNotesSectionHeight']),
  notesToolbarCollapsed: createStorageKeySpec('superamberNotesToolbarCollapsed', ['classSeatingNotesToolbarCollapsed']),
  editorToolsCollapsed: createStorageKeySpec('superamberEditorToolsCollapsed', ['classSeatingEditorToolsCollapsed'])
} as const;

export const readStorageValue = (spec: StorageKeySpec): string | null => {
  const currentValue = window.localStorage.getItem(spec.current);
  if (currentValue !== null) {
    return currentValue;
  }

  for (const key of spec.legacy) {
    const legacyValue = window.localStorage.getItem(key);
    if (legacyValue !== null) {
      window.localStorage.setItem(spec.current, legacyValue);
      return legacyValue;
    }
  }

  return null;
};

export const writeStorageValue = (spec: StorageKeySpec, value: string): void => {
  window.localStorage.setItem(spec.current, value);
};

export const removeStorageValue = (spec: StorageKeySpec): void => {
  window.localStorage.removeItem(spec.current);
  spec.legacy.forEach((key) => window.localStorage.removeItem(key));
};
