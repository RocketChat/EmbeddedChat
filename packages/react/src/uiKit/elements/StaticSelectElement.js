import React, { memo, useMemo, useCallback } from 'react';

import { useUiKitState } from '../hooks/useUiKitState';
import { fromTextObjectToString } from '../utils/fromTextObjectToString';
import { StaticSelect } from '../../components/StaticSelect';

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

  const handleChange = useCallback(
    (event) => {
      action({ target: { value: event.target.value } });
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
      onChange={handleChange}
    />
  );
};

export default memo(StaticSelectElement);
