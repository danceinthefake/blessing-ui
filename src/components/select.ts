export interface BlessOption<T = string | number> {
  value: T;
  label: string;
  disabled?: boolean;
}
