import React, { memo, useMemo, useCallback } from 'react';

import { useUiKitState } from '../hooks/useUiKitState';
import { fromTextObjectToString } from '../utils/fromTextObjectToString';
import { MultiSelect } from '../../MultiSelect';

const MultiStaticSelectElement = ({ block, context, surfaceRenderer }) => {
  const [{ loading }, action] = useUiKitState(block, context);

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
      action({ target: { val } });
    },
    [action]
  );

  return (
    <MultiSelect
      options={options}
      placeholder={fromTextObjectToString(
        surfaceRenderer,
        block.placeholder,
        0
      )}
      onChange={handleChange}
    />
  );
};

export default memo(MultiStaticSelectElement);

// import { MultiSelectFiltered } from '@rocket.chat/fuselage';
// import React, { memo, useCallback, useMemo } from 'react';

// import { useUiKitState } from '../hooks/useUiKitState';
// import { fromTextObjectToString } from '../utils/fromTextObjectToString';

// const MultiStaticSelectElement = ({ block, context, surfaceRenderer }) => {
//   const [{ loading, value, error }, action] = useUiKitState(block, context);

//   const options = useMemo(
//     () =>
//       // eslint-disable-next-line no-shadow
//       block.options.map(({ value, text }, i) => [
//         value,
//         fromTextObjectToString(surfaceRenderer, text, i) ?? '',
//       ]),
//     [block.options, surfaceRenderer]
//   );

//   const handleChange = useCallback(
//     // eslint-disable-next-line no-shadow
//     (value) => {
//       action({ target: { value } });
//     },
//     [action]
//   );

//   return (
//     <MultiSelectFiltered
//       value={value}
//       disabled={loading}
//       error={error}
//       options={options}
//       placeholder={fromTextObjectToString(
//         surfaceRenderer,
//         block.placeholder,
//         0
//       )}
//       onChange={handleChange}
//     />
//   );
// };

// export default memo(MultiStaticSelectElement);
