/**
 * Deep Cloning upto 2 levels
 * @param {*} array
 * @returns
 */
const cloneArray = (array) => {
  const newArray = [...array].map((item) =>
    typeof item === 'object' ? { ...item } : item
  );
  return newArray;
};
export default cloneArray;
