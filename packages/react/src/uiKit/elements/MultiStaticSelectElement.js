import React, { memo, useMemo, useCallback } from 'react';

import { useUiKitState } from '../hooks/useUiKitState';
import { fromTextObjectToString } from '../utils/fromTextObjectToString';
import { MultiSelect } from '../../components/MultiSelect';

const MultiStaticSelectElement = ({ block, context, surfaceRenderer }) => {
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
    (val) => {
      action({ target: { value: val } });
    },
    [action]
  );

  return (
    <MultiSelect
      options={options}
      value={value}
      placeholder={fromTextObjectToString(
        surfaceRenderer,
        block.placeholder,
        0
      )}
      disabled={loading}
      onChange={handleChange}
    />
  );
};

export default memo(MultiStaticSelectElement);
