/**
 * Converts a file size in bytes to a more readable format (KB, MB, GB, etc.).
 * @param bytes The file size in bytes.
 * @param decimals The number of decimal places to include in the output.
 * @returns A string representing the file size in a more readable format.
 */
export const convertFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};
