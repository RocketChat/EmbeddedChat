/* eslint-disable no-restricted-syntax */
import { getInitialValue } from './getInitialValue';
import { hasElement } from './hasElement';
import { hasElements } from './hasElements';

const isActionableElement = (element) =>
  'actionId' in element && typeof element.actionId === 'string';

const reduceInitialValuesFromLayoutBlock = (state, block) => {
  if (hasElement(block)) {
    if (isActionableElement(block.element)) {
      state[block.element.actionId] = {
        value: getInitialValue(block.element),
        blockId: block.blockId,
      };
    }
  }

  if (hasElements(block)) {
    for (const element of block.elements) {
      if (isActionableElement(element)) {
        state[element.actionId] = {
          value: getInitialValue(element),
          blockId: block.blockId,
        };
      }
    }
  }

  return state;
};

export const extractInitialStateFromLayout = (blocks) =>
  blocks.reduce(reduceInitialValuesFromLayoutBlock, {});
