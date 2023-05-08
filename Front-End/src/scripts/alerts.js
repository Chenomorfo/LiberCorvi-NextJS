export const showWarn = (warn, msg) => {
  return {
    severity: "warn",
    summary: warn,
    detail: msg,
    life: 3000,
  };
};

export const showSuccess = (success, msg) => {
  return {
    severity: "success",
    summary: success,
    detail: msg,
    life: 3000,
  };
};

export const showError = (error, msg) => {
  return {
    severity: "error",
    summary: error,
    detail: msg,
    life: 3000,
  };
};

export const showInfo = (error, msg) => {
  return {
    severity: "info",
    summary: error,
    detail: msg,
    life: 3000,
  };
};
