export const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
  let timeout: any;

  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise((resolve) => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
};

export const debounceAsync = <F extends (...args: any[]) => Promise<any>>(
  func: F,
  waitFor: number
) => {
  let timeout: any;

  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise((resolve) => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
};

export const throttle = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
  let timeout: any;

  return (...args: Parameters<F>): void => {
    if (!timeout) {
      func(...args);
      timeout = setTimeout(() => {
        timeout = undefined;
      }, waitFor);
    }
  };
};
