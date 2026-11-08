export interface EnvEntry {
  key: string;
  value: string;
  hasValue: boolean;
}

export type EnvMap = Map<string, EnvEntry>;

export interface CheckResult {
  missing: string[];
  extra: string[];
  empty: string[];
  ok: boolean;
}

export interface CompareOptions {
  ignore: string[];
  allowExtra: boolean;
  allowEmpty: boolean;
}
