import { Box, Message, MessageToolbox } from "@rocket.chat/fuselage";
import React from "react";
import styles from "./ChatBody.module.css";
import PropTypes from "prop-types";
import CustomEmojiPicker from "./EmojiPicker";
import Popup from "reactjs-popup";
import JSEMOJI from "emoji-js";

let jsemoji = new JSEMOJI();
jsemoji.img_set = "emojione";
jsemoji.img_sets.emojione.path =
  "https://cdn.jsdelivr.net/emojione/assets/3.0/png/32/";
jsemoji.supports_css = false;
jsemoji.allow_native = false;
jsemoji.replace_mode = "unified";

const ChatBody = ({ height }) => {
  const arr = [
    1, 22, 3, 4, 5543, 6436, 346, 574, 73, 64, 463, 324, 313, 523, 412, 212,
    124, 1224, 35, 25, 255, 32,
  ];
  const handleEmojiClick = (n, e) => {
    // let emoji = jsemoji.replace_colons(`:${e.name}:`);
    // setEmoji(emoji);
  };

  return (
    <Box className={styles.container} height={height}>
      {arr.map((val) => (
        <Message key={val} className="customclass">
          <Message.Container>
            <Message.Header>
              <Message.Name>Sidharth Mohanty</Message.Name>
              <Message.Username>@sidharth.mohanty</Message.Username>
              <Message.Timestamp>12:00 PM</Message.Timestamp>
            </Message.Header>
            <Message.Body>Hello everyone! Whats up?</Message.Body>
          </Message.Container>
          <MessageToolbox.Wrapper>
            <MessageToolbox>
              <MessageToolbox.Item icon="thread" />
              <MessageToolbox.Item icon="star" />
              <Popup
                trigger={
                  <MessageToolbox.Item
                    icon="emoji"
                    onClick={() => console.log("saf")}
                  />
                }
                position="left center"
              >
                <CustomEmojiPicker handleEmojiClick={handleEmojiClick} />
              </Popup>
              <MessageToolbox.Item icon="pin" />
            </MessageToolbox>
          </MessageToolbox.Wrapper>
        </Message>
      ))}
    </Box>
  );
};

export default ChatBody;

ChatBody.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
