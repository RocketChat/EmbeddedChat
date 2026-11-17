export const Value = { value: undefined, blockId: undefined };

const hasInitialValue = (element) => 'initialValue' in element;

const hasInitialTime = (element) => 'initialTime' in element;

const hasInitialDate = (element) => 'initialDate' in element;

const hasInitialOption = (element) => 'initialOption' in element;

const hasInitialOptions = (element) => 'initialOptions' in element;

export const getInitialValue = (element) => {
  if (!element) {
    return undefined;
  }
  if (hasInitialValue(element)) {
    return element.initialValue;
  }
  if (hasInitialTime(element)) {
    return element.initialTime;
  }
  if (hasInitialDate(element)) {
    return element.initialDate;
  }
  if (hasInitialOption(element)) {
    return element.initialOption?.value;
  }
  if (hasInitialOptions(element)) {
    return element.initialOptions?.map((option) => option.value);
  }
  return undefined;
};
