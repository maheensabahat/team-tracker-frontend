export type GoalStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export interface Goal {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO date string
  status: GoalStatus;
}
