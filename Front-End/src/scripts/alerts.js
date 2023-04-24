export const showWarn = (msg) => {
  toast.current.show({
    severity: "warn",
    summary: "Advertencia",
    detail: msg,
    life: 3000,
  });
};

export const showSuccess = (msg) => {
  toast.current.show({
    severity: "success",
    summary: "Exito",
    detail: msg,
    life: 3000,
  });
};

export const showError = (msg) => {
  toast.current.show({
    severity: "error",
    summary: "Error",
    detail: msg,
    life: 3000,
  });
};
