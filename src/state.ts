import type {
  AppState,
  ArcGroups,
  ClassData,
  LayoutType,
  LocationInfo,
  RowGroups,
  ThemeName,
  TimeModeData,
  UserProfile
} from './types';

export const CIRCULAR_GROUP_SIZE = 6;
export const ROW_GROUP_SIZE = 6;
export const ARC_ROW_SIZE = 18;

export const makeEmptyCircularGroups = (): string[][] =>
  Array.from({ length: 6 }, () => Array(CIRCULAR_GROUP_SIZE).fill(''));

export const makeEmptyRowGroups = (): RowGroups => ({
  rows: Array.from({ length: 3 }, () => ({
    left: Array(ROW_GROUP_SIZE).fill(''),
    right: Array(ROW_GROUP_SIZE).fill('')
  }))
});

export const makeEmptyArcGroups = (): ArcGroups => ({
  rows: [Array(ARC_ROW_SIZE).fill(''), Array(ARC_ROW_SIZE).fill('')]
});

export const makeEmptyLocationInfo = (): LocationInfo => ({
  date: '',
  day: '',
  weekday: '',
  time: '',
  campus: '',
  floor: '',
  room: '',
  notes: '',
  fullDate: ''
});

export const makeModeData = (layout: LayoutType = 'circular'): TimeModeData => ({
  layout,
  groups: null,
  rowGroups: null,
  arcGroups: null,
  currentArrangement: 0,
  locationInfo: makeEmptyLocationInfo()
});

export const makeClassShell = (layout: LayoutType = 'circular') => ({
  weekday: makeModeData(layout),
  weekend: makeModeData(layout)
});

export const makeDefaultProfile = (): UserProfile => ({
  username: '',
  theme: 'classic' as ThemeName
});

export const createInitialState = (): AppState => ({
  isEditMode: false,
  currentArrangement: 0,
  currentTimeMode: 'weekday',
  currentLayout: 'circular',
  currentView: 'home',
  groups: makeEmptyCircularGroups(),
  rowGroups: makeEmptyRowGroups(),
  arcGroups: makeEmptyArcGroups(),
  classData: {} as ClassData,
  userProfile: makeDefaultProfile()
});
