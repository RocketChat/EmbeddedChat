import React, { useContext, useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
import { Avatar } from '../Avatar/Avatar';
import RCContext from '../../context/RCInstance';
import classes from './RoomInformation.module.css';
import { useChannelStore } from '../../store';
import { Icon } from '../Icon';
import { Box } from '../Box';
import { ActionButton } from '../ActionButton';

const Roominfo = () => {
  const { RCInstance } = useContext(RCContext);
  const channelInfo = useChannelStore((state) => state.channelInfo);
  const showChannelinfo = useChannelStore((state) => state.showChannelinfo);
  const setShowChannelinfo = useChannelStore((state) => state.setShowChannelinfo);
  const [visiblState, setvisibleState] = useState(false);

  const toggleshowRoominfo = () => {
    setShowChannelinfo(false);
  };

  const getChannelAvatarURL = (channelname) => {
    const host = RCInstance.getHost();
    return `${host}/avatar/${channelname}`;
  };

  const componentRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setvisibleState(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (componentRef.current) {
      observer.observe(componentRef.current);
    }
    return () => {
      if (componentRef.current) {
        observer.unobserve(componentRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (componentRef.current && !componentRef.current.contains(event.target) && visiblState) {
        setShowChannelinfo(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [visiblState]);

  return (
    <Box ref={componentRef} className={classes.component} style={{ padding: '16px', overflow: "hidden" }}>
      <Box
        css={css`
          display: flex;
        `}
      >
        <h3 style={{ display: 'contents' }}>
          <Icon
            name="info"
            size="1.25rem"
            style={{ padding: '0px 20px 20px 0px' }}
          />
          <Box
            css={css`
              width: 100%;
              color: #4a4a4a;
            `}
          >
            Room Information
          </Box>
          <ActionButton onClick={toggleshowRoominfo} ghost size="small">
            <Icon name="cross" size="1.25rem" />
          </ActionButton>
        </h3>
      </Box>

      <Avatar size="100%" url={getChannelAvatarURL(channelInfo.name)} />
      <Box
        css={css`
          margin: 16px;
        `}
      >
        <Box
          css={css`
            margin-block: 16px;
            font-size: 1.25rem;
          `}
        >
          # {channelInfo.name}
        </Box>
        <Box
          css={css`
            margin-block: 5px;
          `}
        >
          Description
        </Box>
        <Box
          css={css`
            opacity: 0.5rem;
          `}
        >
          {channelInfo.description}
        </Box>
      </Box>
    </Box>
  );
};
export default Roominfo;
