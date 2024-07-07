import React, { useMemo, memo } from 'react';
import { Menu } from '@embeddedchat/ui-elements';
import { useUiKitState } from '../hooks/useUiKitState';
import { fromTextObjectToString } from '../utils/fromTextObjectToString';

const OverflowElement = ({ block, context, surfaceRenderer }) => {
  const [{ loading }, action] = useUiKitState(block, context);

  const options = useMemo(
    () =>
      block.options.map(({ value, text, url }, i) => ({
        id: value,
        label: fromTextObjectToString(surfaceRenderer, text, i) ?? '',
        icon: undefined,
        action: () => {
          if (url) {
            window.open(url);
          }
          action({ target: { value: String(value) } });
        },
      })),
    [action, block.options, surfaceRenderer]
  );

  return (
    <Menu
      options={options}
      tooltip={{ isToolTip: false, position: 'bottom', text: 'Options' }}
    />
  );
};

export default memo(OverflowElement);
