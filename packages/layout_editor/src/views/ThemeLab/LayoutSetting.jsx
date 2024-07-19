import React, { useMemo, useCallback } from 'react';
import { Box, useTheme, StaticSelect } from '@embeddedchat/ui-elements';
import { getLayoutSettings } from './ThemeLab.styles';
import useLayoutStore from '../../store/layoutStore';
import SurfaceItem from '../../components/SurfaceMenu/SurfaceItem';
import useHeaderItemsStore from '../../store/headerItemsStore';

const LayoutSetting = () => {
  const styles = getLayoutSettings(useTheme());

  const { messageView, setMessageView, displayName, setDisplayName } =
    useLayoutStore((state) => ({
      messageView: state.messageView,
      setMessageView: state.setMessageView,
      displayName: state.displayName,
      setDisplayName: state.setDisplayName,
    }));

  const messageViewOptions = [
    {
      label: 'Flat',
      value: 'flat',
    },

    {
      label: 'Bubble',
      value: 'bubble',
    },
  ];

  const displayNameOptions = [
    {
      label: 'Normal',
      value: 'normal',
    },

    {
      label: 'Colorize',
      value: 'colorize',
    },
  ];

  const {
    surfaceItems: headerSurfaceItems,
    setSurfaceItems: setHeaderSurfaceItems,
    menuItems: headerMenuItems,
  } = useHeaderItemsStore((state) => ({
    surfaceItems: state.surfaceItems,
    setSurfaceItems: state.setSurfaceItems,
    menuItems: state.menuItems,
  }));

  const addHeaderSurfaceItem = useCallback(
    (id) => {
      if (!headerSurfaceItems.includes(id) && !headerMenuItems.includes(id)) {
        setHeaderSurfaceItems([id, ...headerSurfaceItems]);
      }
    },
    [headerMenuItems, headerSurfaceItems, setHeaderSurfaceItems]
  );

  const headerOptions = useMemo(
    () => ({
      minmax: {
        label: 'Maximize',
        id: 'minmax',
        iconName: 'expand',
        onClick: () => {
          addHeaderSurfaceItem('minmax');
        },
      },
      close: {
        label: 'Close',
        id: 'close',
        onClick: () => {
          addHeaderSurfaceItem('close');
        },
        iconName: 'cross',
      },
      thread: {
        label: 'Threads',
        id: 'thread',
        onClick: () => {
          addHeaderSurfaceItem('thread');
        },
        iconName: 'thread',
      },
      mentions: {
        label: 'Mentions',
        id: 'mentions',
        onClick: () => {
          addHeaderSurfaceItem('mentions');
        },
        iconName: 'at',
      },
      starred: {
        label: 'Starred Messages',
        id: 'starred',
        onClick: () => {
          addHeaderSurfaceItem('starred');
        },
        iconName: 'star',
      },
      pinned: {
        label: 'Pinned Messages',
        id: 'pinned',
        onClick: () => {
          addHeaderSurfaceItem('pinned');
        },
        iconName: 'pin',
      },
      members: {
        label: 'Members',
        id: 'members',
        onClick: () => {
          addHeaderSurfaceItem('members');
        },
        iconName: 'members',
      },
      files: {
        label: 'Files',
        id: 'files',
        onClick: () => {
          addHeaderSurfaceItem('files');
        },
        iconName: 'clip',
      },
      search: {
        label: 'Search Messages',
        id: 'search',
        onClick: () => {
          addHeaderSurfaceItem('search');
        },
        iconName: 'magnifier',
      },
      rInfo: {
        label: 'Room Information',
        id: 'rInfo',
        onClick: () => {
          addHeaderSurfaceItem('rInfo');
        },
        iconName: 'info',
      },
      logout: {
        label: 'Logout',
        id: 'logout',
        onClick: () => {
          addHeaderSurfaceItem('logout');
        },
        iconName: 'reply-directly',
      },
    }),
    [addHeaderSurfaceItem]
  );

  const surfaceOptions = Object.keys(headerOptions).map((key) => ({
    id: headerOptions[key].id,
    onClick: headerOptions[key].onClick,
    label: headerOptions[key].label,
    iconName: headerOptions[key].iconName,
  }));

  return (
    <Box css={styles.main}>
      <Box css={styles.variantSection}>
        <h3>Variants</h3>
        <Box css={[styles.commonSelect, styles.messageView]}>
          <Box is="span">Message View</Box>
          <StaticSelect
            options={messageViewOptions}
            style={{
              position: 'absolute',
              top: '16px',
              right: 0,
              zIndex: '1',
            }}
            placeholder="Choose"
            value={messageView}
            onSelect={setMessageView}
          />
        </Box>

        <Box css={[styles.commonSelect, styles.displayName]}>
          <Box is="span">Display Name</Box>
          <StaticSelect
            options={displayNameOptions}
            style={{ position: 'absolute', top: '16px', right: 0 }}
            placeholder="Choose"
            value={displayName}
            onSelect={setDisplayName}
          />
        </Box>
      </Box>

      <Box css={styles.toolSection}>
        <h3>Tool Tray</h3>
        <Box css={styles.headerItems}>
          <Box is="span">Header Items</Box>
          <Box css={styles.itemContainer}>
            {surfaceOptions?.map((item, idx) => (
              <SurfaceItem {...item} key={idx} cursor="pointer" />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LayoutSetting;
