import React, { memo, useMemo, useCallback } from 'react';

import { StaticSelect } from '@embeddedchat/ui-elements';
import { useUiKitState } from '../hooks/useUiKitState';
import { fromTextObjectToString } from '../utils/fromTextObjectToString';

const StaticSelectElement = ({ block, context, surfaceRenderer }) => {
  const [{ loading, value }, action] = useUiKitState(block, context);

  const options = useMemo(
    () =>
      block.options.map((option, i) => ({
        value: option.value,
        label: fromTextObjectToString(surfaceRenderer, option.text, i) ?? '',
      })),
    [block.options, surfaceRenderer]
  );

  const handleSelect = useCallback(
    (selectedValue) => {
      action({ target: { value: selectedValue } });
    },
    [action]
  );
  return (
    <StaticSelect
      value={value}
      options={options}
      disabled={loading}
      placeholder={fromTextObjectToString(
        surfaceRenderer,
        block.placeholder,
        0
      )}
      onSelect={handleSelect}
    />
  );
};

export default memo(StaticSelectElement);
