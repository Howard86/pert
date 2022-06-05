const STORAGE_KEY = 'pert';

const convertIntoStorage = (form: Pert.FormState): Pert.StorageState => {
  const keys = Object.keys(form.tasks[0]) as unknown as Pert.TaskKey[];

  return {
    unit: form.unit,
    keys,
    rows: form.tasks.map((task) => keys.map((key) => task[key]).join(',')),
  };
};

const convertIntoForm = (storage: Pert.StorageState): Pert.FormState => ({
  unit: storage.unit,
  tasks: storage.rows.map((row) => {
    const [name, optimistic, likely, pessimistic] = row.split(',');

    return {
      name,
      optimisticEstimate: Number(optimistic),
      likelyEstimate: Number(likely),
      pessimisticEstimate: Number(pessimistic),
    };
  }),
});

export const saveToLocalStorage = (form: Pert.FormState): void => {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(convertIntoStorage(form)),
  );
};

export const importFromLocalStorage = (
  defaultForm: Pert.FormState,
): Pert.FormState => {
  const storageInString = window.localStorage.getItem(STORAGE_KEY);

  if (!storageInString) return defaultForm;

  const storage = JSON.parse(storageInString) as Pert.StorageState;

  return convertIntoForm(storage);
};
