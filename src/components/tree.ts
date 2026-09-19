export interface BlessTreeNode {
  label: string;
  /** stable id; defaults to label path */
  id?: string;
  href?: string;
  icon?: string;
  children?: BlessTreeNode[];
  open?: boolean;
  disabled?: boolean;
}
