export const defaultStatus = () => ({
  detail: {
    type: "blank" as "blank" | "addNewRSS" | "detail",
    id: null as null | number,
  },
});

export type IStatus = ReturnType<typeof defaultStatus>;
