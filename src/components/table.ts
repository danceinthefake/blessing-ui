export interface BlessColumn<T = Record<string, unknown>> {
  key: keyof T & string;
  label: string;
  align?: "left" | "center" | "right";
  width?: string;
  /** marks the row header cell (th scope=row) */
  header?: boolean;
}

export interface BlessDataColumn<T = Record<string, unknown>> extends BlessColumn<T> {
  sortable?: boolean;
  hideable?: boolean;
}
