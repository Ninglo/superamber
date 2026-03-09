import type { ClassData, UserProfile } from './types';
import { makeDefaultProfile } from './state';

const CLASS_STORAGE_KEY = 'classSeatingData';
const PROFILE_STORAGE_KEY = 'classSeatingProfile';

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

export const loadUserProfile = (): UserProfile => {
  const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!saved) {
    return makeDefaultProfile();
  }

  try {
    const parsed = JSON.parse(saved) as Partial<UserProfile>;
    return {
      username: parsed.username?.trim() || '',
      theme: parsed.theme || 'classic'
    };
  } catch {
    return makeDefaultProfile();
  }
};

export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
};
