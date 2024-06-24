export const Value = { value: undefined, blockId: undefined };

const hasInitialValue = (element) => 'initialValue' in element;

const hasInitialTime = (element) => 'initialTime' in element;

const hasInitialDate = (element) => 'initialDate' in element;

const hasInitialOption = (element) => 'initialOption' in element;

const hasInitialOptions = (element) => 'initialOptions' in element;

export const getInitialValue = (element) =>
  (hasInitialValue(element) && element.initialValue) ||
  (hasInitialTime(element) && element.initialTime) ||
  (hasInitialDate(element) && element.initialDate) ||
  (hasInitialOption(element) && element.initialOption.value) ||
  (hasInitialOptions(element) &&
    element.initialOptions.map((option) => option.value)) ||
  undefined;
