import { useCallback } from 'react';

const useShowCommands = (commands, setFilteredCommands, setShowCommandList) =>
  useCallback(
    async (e) => {
      const getFilteredCommands = (cmd) =>
        commands.filter((c) => c.command.startsWith(cmd.replace('/', '')));

      const cursor = e.target.selectionStart;
      const tokens = e.target.value.slice(0, cursor).split(/\s+/);

      if (tokens.length === 1 && tokens[0].startsWith('/')) {
        const filtered = getFilteredCommands(tokens[0]);
        setFilteredCommands(filtered);
        setShowCommandList(filtered.length > 0);
      } else {
        setFilteredCommands([]);
        setShowCommandList(false);
      }
    },
    [commands, setFilteredCommands, setShowCommandList]
  );

export default useShowCommands;
