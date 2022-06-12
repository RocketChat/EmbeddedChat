import { Box, Icon } from "@rocket.chat/fuselage";
import React, { useRef, useState } from "react";
import styles from "./ChatInput.module.css";
import JSEMOJI from "emoji-js";
import CustomEmojiPicker from "./EmojiPicker";
import Popup from "reactjs-popup";

let jsemoji = new JSEMOJI();
jsemoji.img_set = "emojione";
jsemoji.img_sets.emojione.path =
  "https://cdn.jsdelivr.net/emojione/assets/3.0/png/32/";
jsemoji.supports_css = false;
jsemoji.allow_native = false;
jsemoji.replace_mode = "unified";

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const [emoji, setEmoji] = useState(null);
  const [openEmoji, setOpenEmoji] = useState(false);

  const handleEmojiClick = (n, e) => {
    let emoji = jsemoji.replace_colons(`:${e.name}:`);
    setEmoji(emoji);
  };

  const ref = useRef();

  return (
    <Box>
      <Box m={2} className={styles.container} border={"2px solid #ddd"}>
        <Popup
          trigger={
            <Icon
              ref={ref}
              onClick={() => {}}
              name="emoji"
              size="x25"
              padding={6}
            />
          }
          position="top left"
        >
          <CustomEmojiPicker handleEmojiClick={handleEmojiClick} />
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
              setMessage("");
            }
          }}
        />
        <Icon
          onClick={() => {
            setMessage("");
          }}
          name="send"
          size="x25"
          padding={6}
        />
      </Box>
    </Box>
  );
};

export default ChatInput;
