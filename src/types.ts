export type TimeMode = 'weekday' | 'weekend';
export type LayoutType = 'circular' | 'rows' | 'arc';
export type ThemeName = 'classic' | 'sky' | 'sunny';
export type OcrEngineMode = 'hybrid' | 'tencent' | 'local';
export type TencentOcrAction = 'Auto' | 'ExtractDocMulti' | 'GeneralAccurateOCR' | 'GeneralBasicOCR';

export interface LocationInfo {
  date: string;
  day: string;
  weekday: string;
  time: string;
  campus: string;
  floor: string;
  room: string;
  notes: string;
  fullDate: string;
}

export interface RowGroup {
  left: string[];
  right: string[];
}

export interface RowGroups {
  rows: RowGroup[];
}

export interface ArcGroups {
  rows: string[][];
}

export interface TimeModeData {
  layout: LayoutType;
  groups: string[][] | null;
  rowGroups: RowGroups | null;
  arcGroups: ArcGroups | null;
  currentArrangement: number;
  locationInfo: LocationInfo;
}

export interface ClassConfig {
  weekday: TimeModeData;
  weekend: TimeModeData;
}

export type ClassData = Record<string, ClassConfig>;

export interface UserProfile {
  username: string;
  theme: ThemeName;
}

export interface OCRSettings {
  engine: OcrEngineMode;
  allowLocalFallback: boolean;
  tencentEndpoint: string;
  tencentRegion: string;
  tencentAction: TencentOcrAction;
}

export interface AppState {
  isEditMode: boolean;
  currentArrangement: number;
  currentTimeMode: TimeMode;
  currentLayout: LayoutType;
  currentView: 'home' | 'editor';
  groups: string[][];
  rowGroups: RowGroups;
  arcGroups: ArcGroups;
  classData: ClassData;
  userProfile: UserProfile;
}
