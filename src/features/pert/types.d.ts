declare namespace Pert {
  type FormState = {
    unit: string;
    tasks: Task[];
  };

  type StorageState = {
    unit: string;
    keys: TaskKey[];
    rows: string[]; // as name,1,2,3
  };

  type Task = {
    name: string;
    optimisticEstimate: number;
    likelyEstimate: number;
    pessimisticEstimate: number;
  };

  type TaskKey = keyof Task;
}
