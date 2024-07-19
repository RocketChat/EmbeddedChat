import React, { useMemo, useCallback } from 'react';
import { Box, useTheme, StaticSelect } from '@embeddedchat/ui-elements';
import { getLayoutSettings } from './ThemeLab.styles';
import useLayoutStore from '../../store/layoutStore';
import SurfaceItem from '../../components/SurfaceMenu/SurfaceItem';
import useHeaderItemsStore from '../../store/headerItemsStore';
import useMessageItemsStore from '../../store/messageItemsStore';
import useChatInputItemsStore from '../../store/chatInputItemsStore';

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

  const {
    surfaceItems: messageSurfaceItems,
    setSurfaceItems: setMessageSurfaceItems,
    menuItems: messageMenuItems,
  } = useMessageItemsStore((state) => ({
    surfaceItems: state.surfaceItems,
    setSurfaceItems: state.setSurfaceItems,
    menuItems: state.menuItems,
  }));

  const {
    surfaceItems: inputSurfaceItems,
    setSurfaceItems: setInputSurfaceItems,
    formatters,
    setFormatters,
  } = useChatInputItemsStore((state) => ({
    surfaceItems: state.surfaceItems,
    setSurfaceItems: state.setSurfaceItems,
    formatters: state.formatters,
    setFormatters: state.setFormatters,
  }));

  const addHeaderSurfaceItem = useCallback(
    (id) => {
      if (!headerSurfaceItems.includes(id) && !headerMenuItems.includes(id)) {
        setHeaderSurfaceItems([id, ...headerSurfaceItems]);
      }
    },
    [headerMenuItems, headerSurfaceItems, setHeaderSurfaceItems]
  );

  const addMessageSurfaceItem = useCallback(
    (id) => {
      if (!messageSurfaceItems.includes(id) && !messageMenuItems.includes(id)) {
        setMessageSurfaceItems([id, ...messageSurfaceItems]);
      }
    },
    [messageMenuItems, messageSurfaceItems, setMessageSurfaceItems]
  );

  const addInputSurfaceItem = useCallback(
    (id) => {
      if (!inputSurfaceItems.includes(id)) {
        setInputSurfaceItems([id, ...inputSurfaceItems]);
      }
    },
    [inputSurfaceItems, setInputSurfaceItems]
  );

  const addFormatters = useCallback(
    (id) => {
      if (!formatters.includes(id)) {
        setFormatters([id, ...formatters]);
      }
    },
    [formatters, setFormatters]
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

      close: {
        label: 'Close',
        id: 'close',
        onClick: () => {
          addHeaderSurfaceItem('close');
        },
        iconName: 'cross',
      },
    }),
    [addHeaderSurfaceItem]
  );

  const inputOptions = useMemo(() => {
    return {
      emoji: {
        label: 'Emoji',
        id: 'emoji',
        onClick: () => {
          addInputSurfaceItem('emoji');
        },
        iconName: 'emoji',
        visible: true,
      },
      audio: {
        label: 'Audio Message',
        id: 'audio',
        onClick: () => {
          addInputSurfaceItem('audio');
        },
        iconName: 'mic',
        visible: true,
      },
      video: {
        label: 'Video Message',
        id: 'video',
        onClick: () => {
          addInputSurfaceItem('video');
        },
        iconName: 'video-recorder',
        visible: true,
      },
      file: {
        label: 'Upload File',
        id: 'file',
        onClick: () => {
          addInputSurfaceItem('file');
        },
        iconName: 'attachment',
        visible: true,
      },
      formatter: {
        label: 'Formatter',
        id: 'formatter',
        onClick: () => {
          addInputSurfaceItem('formatter');
        },
        iconName: 'format-text',
        visible: true,
      },
    };
  }, [addInputSurfaceItem]);

  const formatterOptions = useMemo(() => {
    return {
      bold: {
        label: 'Bold',
        id: 'bold',
        onClick: () => {
          addFormatters('bold');
        },
        iconName: 'bold',
        visible: true,
      },
      italic: {
        label: 'Italic',
        id: 'italic',
        onClick: () => {
          addFormatters('italic');
        },
        iconName: 'italic',
        visible: true,
      },
      strike: {
        label: 'Strike',
        id: 'strike',
        onClick: () => {
          addFormatters('strike');
        },
        iconName: 'strike',
        visible: true,
      },
      code: {
        label: 'Code',
        id: 'code',
        onClick: () => {
          addFormatters('code');
        },
        iconName: 'code',
        visible: true,
      },
      multiline: {
        label: 'Multiline',
        id: 'multiline',
        onClick: () => {
          addFormatters('multiline');
        },
        iconName: 'multiline',
        visible: true,
      },
    };
  }, [addFormatters]);

  const messageOptions = useMemo(
    () => ({
      reply: {
        label: 'Reply in thread',
        id: 'reply',
        onClick: () => {
          addMessageSurfaceItem('reply');
        },
        iconName: 'thread',
      },
      quote: {
        label: 'Quote',
        id: 'quote',
        onClick: () => {
          addMessageSurfaceItem('quote');
        },
        iconName: 'quote',
      },
      star: {
        label: 'Star',
        id: 'star',
        onClick: () => {
          addMessageSurfaceItem('star');
        },
        iconName: 'star',
      },
      reaction: {
        label: 'Add reaction',
        id: 'reaction',
        onClick: () => {
          addMessageSurfaceItem('reaction');
        },
        iconName: 'emoji',
      },
      pin: {
        label: 'Pin',
        id: 'pin',
        onClick: () => {
          addMessageSurfaceItem('pin');
        },
        iconName: 'pin',
      },
      edit: {
        label: 'Edit',
        id: 'edit',
        onClick: () => {
          addMessageSurfaceItem('edit');
        },
        iconName: 'edit',
      },
      delete: {
        label: 'Delete',
        id: 'delete',
        onClick: () => {
          addMessageSurfaceItem('delete');
        },
        iconName: 'trash',
      },
      report: {
        label: 'Report',
        id: 'report',
        onClick: () => {
          addMessageSurfaceItem('report');
        },
        iconName: 'report',
      },
    }),
    [addMessageSurfaceItem]
  );

  const headerSurfaceOptions = Object.keys(headerOptions).map((key) => ({
    id: headerOptions[key].id,
    onClick: headerOptions[key].onClick,
    label: headerOptions[key].label,
    iconName: headerOptions[key].iconName,
  }));

  const messageSurfaceOptions = Object.keys(messageOptions).map((key) => ({
    id: messageOptions[key].id,
    onClick: messageOptions[key].onClick,
    label: messageOptions[key].label,
    iconName: messageOptions[key].iconName,
  }));

  const inputSurfaceOptions = Object.keys(inputOptions).map((key) => ({
    id: inputOptions[key].id,
    onClick: inputOptions[key].onClick,
    label: inputOptions[key].label,
    iconName: inputOptions[key].iconName,
  }));

  const formatterItems = Object.keys(formatterOptions).map((key) => ({
    id: formatterOptions[key].id,
    onClick: formatterOptions[key].onClick,
    label: formatterOptions[key].label,
    iconName: formatterOptions[key].iconName,
  }));

  return (
    <Box css={styles.main}>
      <Box css={styles.variantSection}>
        <h3>Variants</h3>
        <Box css={styles.commonSelect}>
          <Box is="span">
            <b>Message View</b>
          </Box>
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

        <Box css={styles.commonSelect}>
          <Box is="span">
            <b>Display Name</b>
          </Box>
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
          <Box is="span">
            <b>Header Items</b>
          </Box>
          <Box css={styles.itemContainer}>
            {headerSurfaceOptions?.map((item, idx) => (
              <SurfaceItem {...item} key={idx} cursor="pointer" />
            ))}
          </Box>

          <Box is="span">
            <b>Message Items</b>
          </Box>
          <Box css={styles.itemContainer}>
            {messageSurfaceOptions?.map((item, idx) => (
              <SurfaceItem {...item} key={idx} cursor="pointer" />
            ))}
          </Box>

          <Box is="span">
            <b>Input Items</b>
          </Box>
          <Box css={styles.itemContainer}>
            {inputSurfaceOptions?.map((item, idx) => (
              <SurfaceItem {...item} key={idx} cursor="pointer" />
            ))}
          </Box>

          <Box is="span">
            <b>Formatter Items</b>
          </Box>
          <Box css={styles.itemContainer}>
            {formatterItems?.map((item, idx) => (
              <SurfaceItem {...item} key={idx} cursor="pointer" />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LayoutSetting;
