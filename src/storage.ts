import type { ClassData, UserProfile } from './types';
import { makeDefaultProfile } from './state';

const CLASS_STORAGE_KEY = 'classSeatingData';
const PROFILE_STORAGE_KEY = 'classSeatingProfile';
const BATCH_UNDO_STORAGE_KEY = 'classSeatingBatchUndoData';
const VALID_THEMES = new Set(['paper', 'classic', 'mint', 'rose', 'apricot', 'golden', 'plum']);
const isThemeName = (theme: string): theme is UserProfile['theme'] => VALID_THEMES.has(theme);

export const loadClassData = (): ClassData => {
  const saved = localStorage.getItem(CLASS_STORAGE_KEY);
  if (!saved) {
    return {};
  }

  try {
    return JSON.parse(saved) as ClassData;
  } catch {
    return {};
  }
};

export const saveClassData = (classData: ClassData): void => {
  localStorage.setItem(CLASS_STORAGE_KEY, JSON.stringify(classData));
};

export const loadBatchUndoData = (): ClassData | null => {
  const saved = localStorage.getItem(BATCH_UNDO_STORAGE_KEY);
  if (!saved) {
    return null;
  }

  try {
    return JSON.parse(saved) as ClassData;
  } catch {
    return null;
  }
};

export const saveBatchUndoData = (classData: ClassData): void => {
  localStorage.setItem(BATCH_UNDO_STORAGE_KEY, JSON.stringify(classData));
};

export const clearBatchUndoData = (): void => {
  localStorage.removeItem(BATCH_UNDO_STORAGE_KEY);
};

export const loadUserProfile = (): UserProfile => {
  const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!saved) {
    return makeDefaultProfile();
  }

  try {
    const parsed = JSON.parse(saved) as Record<string, unknown>;
    const username = typeof parsed.username === 'string' ? parsed.username : '';
    const rawTheme = typeof parsed.theme === 'string' ? parsed.theme : undefined;
    const legacyTheme = rawTheme === 'sky'
      ? 'mint'
      : rawTheme === 'sunny'
        ? 'golden'
        : rawTheme;

    return {
      username: username.trim(),
      theme: legacyTheme && isThemeName(legacyTheme) ? legacyTheme : 'paper'
    };
  } catch {
    return makeDefaultProfile();
  }
};

export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
};
