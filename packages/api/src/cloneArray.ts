/**
 * Deep Cloning upto 2 levels
 * @param {*} array
 * @returns
 */
const cloneArray = (array: any[]) => {
  const newArr = [...array].map((item) =>
    typeof item === "object" ? { ...item } : item
  );
  return newArr;
};
export default cloneArray;
