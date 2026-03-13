import React, { useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { Box, useComponentOverrides, useTheme } from '@embeddedchat/ui-elements';
import getCommandListStyles from './CommandList.style';

/**
 * CommandsList — keyboard-first slash command autocomplete.
 *
 * Navigation:
 *   ArrowDown / ArrowUp  → move selection
 *   Enter / Tab          → confirm selection
 *   Escape               → dismiss list
 *
 * The keydown listener is attached to the messageRef <textarea> rather than
 * the document to avoid interfering with other global keyboard handlers.
 */
function CommandsList({
  className = '',
  style = {},
  messageRef,
  setFilteredCommands,
  filteredCommands,
  commandIndex,
  setCommandIndex,
  setShowCommandList,
  ...props
}) {
  const { classNames, styleOverrides } = useComponentOverrides('CommandsList');
  const { theme } = useTheme();
  const styles = getCommandListStyles(theme);
  const itemRefs = useRef([]);
  const setItemRef = (el, index) => {
    itemRefs.current[index] = el;
  };

  /**
   * Replaces the partial slash token in the textarea with the chosen command.
   * Keeps any trailing text/params the user may have typed after the command.
   */
  const selectCommand = useCallback(
    (command) => {
      if (!messageRef.current) return;

      const currentValue = messageRef.current.value || '';
      const tokens = currentValue.split(' ');
      const slashIdx = tokens.findIndex((t) => /^\/\w*$/.test(t));

      if (slashIdx !== -1) {
        tokens[slashIdx] = `/${command.command}`;
        // Add a trailing space so the user can type params immediately
        const newValue = tokens.join(' ') + ' ';
        messageRef.current.value = newValue;
        // Move cursor to end
        messageRef.current.selectionStart = newValue.length;
        messageRef.current.selectionEnd = newValue.length;
      }

      setFilteredCommands([]);
      setCommandIndex(0);
      setShowCommandList(false);
      messageRef.current.focus();
    },
    [messageRef, setCommandIndex, setFilteredCommands, setShowCommandList]
  );

  // Attach keyboard listener to the textarea input, not document
  useEffect(() => {
    const input = messageRef.current;
    if (!input) return;

    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'Enter': {
          const selected = filteredCommands[commandIndex];
          if (selected) {
            event.preventDefault();
            selectCommand(selected);
          }
          break;
        }

        case 'Tab': {
          // Tab = confirm, same as Enter — standard terminal-style UX
          const selected = filteredCommands[commandIndex];
          if (selected) {
            event.preventDefault();
            selectCommand(selected);
          }
          break;
        }

        case 'ArrowDown': {
          event.preventDefault();
          setCommandIndex((prev) =>
            prev + 1 >= filteredCommands.length ? 0 : prev + 1
          );
          break;
        }

        case 'ArrowUp': {
          event.preventDefault();
          setCommandIndex((prev) =>
            prev - 1 < 0 ? filteredCommands.length - 1 : prev - 1
          );
          break;
        }

        case 'Escape': {
          setFilteredCommands([]);
          setCommandIndex(0);
          setShowCommandList(false);
          break;
        }

        default:
          break;
      }
    };

    input.addEventListener('keydown', handleKeyDown);
    return () => input.removeEventListener('keydown', handleKeyDown);
  }, [
    messageRef,
    commandIndex,
    filteredCommands,
    selectCommand,
    setCommandIndex,
    setFilteredCommands,
    setShowCommandList,
  ]);

  // Scroll selected item into view whenever commandIndex changes
  useEffect(() => {
    const el = itemRefs.current[commandIndex];
    if (el) {
      el.scrollIntoView({ block: 'nearest' });
    }
  }, [commandIndex]);

  if (!filteredCommands.length) return null;

  return (
    <Box
      css={styles.main}
      className={`ec-commands-list ${className} ${classNames}`}
      style={{ ...styleOverrides, ...style }}
      role="listbox"
      aria-label="Slash commands"
      {...props}
    >
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {filteredCommands.map((command, index) => {
          const isActive = index === commandIndex;
          return (
            <li
              key={command.command}
              role="option"
              aria-selected={isActive}
              css={[styles.listItem, isActive && styles.listItemActive]}
              ref={(el) => setItemRef(el, index)}
              onClick={() => selectCommand(command)}
              onMouseEnter={() => setCommandIndex(index)}
            >
              <Box css={styles.leftSection}>
                <Box is="span" css={styles.commandName}>
                  /{command.command}
                </Box>
                {command.params && (
                  <Box is="span" css={styles.commandParams}>
                    {command.params}
                  </Box>
                )}
              </Box>
              {command.description && (
                <Box css={styles.commandDescription}>
                  {command.description}
                </Box>
              )}
            </li>
          );
        })}
      </ul>
    </Box>
  );
}

CommandsList.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  messageRef: PropTypes.object.isRequired,
  setFilteredCommands: PropTypes.func.isRequired,
  filteredCommands: PropTypes.array,
  commandIndex: PropTypes.number.isRequired,
  setCommandIndex: PropTypes.func.isRequired,
  setShowCommandList: PropTypes.func.isRequired,
};

export default CommandsList;
