import React, { useState } from "react";
import { Heading, Box, Icon } from "@embeddedchat/ui-elements";
import useChatHeaderStyles from "./ChatHeader.styles";
import SortableHeaderOptions from "./SortableHeaderOptions";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

const ChatHeader = ({
  optionConfig = {
    menuOptions: [
      "minmax",
      "thread",
      "mentions",
      "starred",
      "pinned",
      "files",
      "close",
      "members",
      "search",
      "rInfo",
      "logout",
    ],
  },
}) => {
  const [menuOptions, setMenuOptions] = useState(optionConfig.menuOptions);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setMenuOptions((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const styles = useChatHeaderStyles();

  return (
    <Box css={styles.chatHeaderParent}>
      <Box css={styles.chatHeaderChild}>
        <Box css={styles.channelDescription}>
          <Icon name="hash" size="1.25rem" />
          <Box>
            <Heading
              level={3}
              className="ec-chat-header--channelName"
              css={styles.clearSpacing}
            >
              general
            </Heading>

            <p
              className="ec-chat-header--channelDescription"
              css={styles.clearSpacing}
            >
              Channel description
            </p>
          </Box>
        </Box>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={menuOptions}
            strategy={horizontalListSortingStrategy}
          >
            <Box css={styles.chatHeaderIconRow}>
              {menuOptions.map((key) => (
                <SortableHeaderOptions key={key} id={key} />
              ))}
            </Box>
          </SortableContext>
        </DndContext>
      </Box>
    </Box>
  );
};

export default ChatHeader;
