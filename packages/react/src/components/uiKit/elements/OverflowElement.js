import {
  IconButton,
  PositionAnimated,
  Options,
  useCursor,
} from '@rocket.chat/fuselage';
import React, { useRef, useCallback, useMemo } from 'react';

import { useUiKitState } from '../hooks/useUiKitState';
import { fromTextObjectToString } from '../utils/fromTextObjectToString';

const OverflowElement = ({ block, context, surfaceRenderer }) => {
  const [{ loading }, action] = useUiKitState(block, context);

  const fireChange = useCallback(
    ([value]) => action({ target: { value } }),
    [action]
  );

  const options = useMemo(
    () =>
      block.options.map(({ value, text, url }, i) => [
        value,
        fromTextObjectToString(surfaceRenderer, text, i) ?? '',
        undefined,
        undefined,
        undefined,
        url,
      ]),
    [block.options, surfaceRenderer]
  );

  const [cursor, handleKeyDown, handleKeyUp, reset, [visible, hide, show]] =
    // eslint-disable-next-line no-shadow
    useCursor(-1, options, (selectedOption, [, hide]) => {
      fireChange([selectedOption[0], selectedOption[1]]);
      reset();
      hide();
    });

  const ref = useRef(null);
  const onClick = useCallback(() => {
    ref.current?.focus();
    show();
  }, [show]);

  const handleSelection = useCallback(
    ([value, _label, _selected, _type, url]) => {
      if (url) {
        window.open(url);
      }
      action({ target: { value: String(value) } });
      reset();
      hide();
    },
    [action, hide, reset]
  );

  return (
    <>
      <IconButton
        ref={ref}
        small
        onClick={onClick}
        onBlur={hide}
        onKeyUp={handleKeyUp}
        onKeyDown={handleKeyDown}
        disabled={loading}
        icon="kebab"
      />
      <PositionAnimated
        width="auto"
        visible={visible}
        anchor={ref}
        placement="bottom-start"
      >
        <Options onSelect={handleSelection} options={options} cursor={cursor} />
      </PositionAnimated>
    </>
  );
};

export default OverflowElement;
