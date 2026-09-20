export type Status = "active" | "invited" | "suspended";
export interface Member {
  id: number;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Member";
  status: Status;
  joined: string;
}
export const statusColor: Record<Status, "success" | "warning" | "danger"> = {
  active: "success",
  invited: "warning",
  suspended: "danger",
};
