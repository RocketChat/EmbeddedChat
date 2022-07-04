import { Box, Icon } from "@rocket.chat/fuselage";
import React, { useState, useContext } from "react";
import styles from "./ChatInput.module.css";
import { EmojiPicker } from "../EmojiPicker/index";
import Popup from "reactjs-popup";
import { useMediaQuery } from "@rocket.chat/fuselage-hooks";
import RCContext from '../../context/RCInstance';

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const isSmallScreen = useMediaQuery("(max-width: 992px)");
  const { RCInstance, cookies } = useContext(RCContext);

  const handleEmojiClick = (n, e) => {
    let emoji_inside_colons = `:${e.name}:`;
    setMessage(message + emoji_inside_colons);
  };

  const sendMessage = async () => {
    await RCInstance.sendMessage(message, cookies);
    setMessage('');
  };

  return (
    <Box>
      <Box m={2} className={styles.container} border={'2px solid #ddd'}>
        <Popup
          trigger={
            <Icon
              name="emoji"
              size="x25"
              padding={6}
            />
          }
          position={isSmallScreen ? "right top" : "top left"}
        >
          <EmojiPicker handleEmojiClick={handleEmojiClick} />
        </Popup>
        <input
          placeholder="Message"
          value={message}
          className={styles.textInput}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              sendMessage();
            }
          }}
        />
        <Icon onClick={sendMessage} name="send" size="x25" padding={6} />
      </Box>
    </Box>
  );
};

export default ChatInput;
