/**
 * Deep Cloning up to 2 levels
 * @param array - Array to clone
 * @returns Cloned array
 */
const cloneArray = <T extends Record<string, unknown>>(array: T[]): T[] => {
  const newArray = [...array].map((item) =>
    typeof item === "object" && item !== null ? ({ ...item } as T) : item
  );
  return newArray;
};
export default cloneArray;
