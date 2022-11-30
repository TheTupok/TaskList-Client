export interface ITask {
  id: number;
  taskName: string;
  executor: string;
  members: string[] | string;
  deadline: string;
  dateOfCompleted: string;
  status: string;
  description: string;
}
