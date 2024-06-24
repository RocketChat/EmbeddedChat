import { useCallback } from 'react';

const useShowCommands = (commands, setFilteredCommands, setShowCommandList) =>
  useCallback(
    async (e) => {
      const getFilteredCommands = (cmd) =>
        commands.filter((c) => c.command.startsWith(cmd.replace('/', '')));

      const cursor = e.target.selectionStart;
      const tokens = e.target.value.slice(0, cursor).split(/\s+/);

      if (tokens.length === 1 && tokens[0].startsWith('/')) {
        setFilteredCommands(getFilteredCommands(tokens[0]));
        setShowCommandList(true);
      } else {
        setFilteredCommands([]);
        setShowCommandList(false);
      }
    },
    [commands, setFilteredCommands, setShowCommandList]
  );

export default useShowCommands;
