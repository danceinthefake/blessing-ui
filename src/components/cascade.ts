export interface BlessCascadeOption<T = string | number> {
  value: T;
  label: string;
  disabled?: boolean;
  children?: BlessCascadeOption<T>[];
}
