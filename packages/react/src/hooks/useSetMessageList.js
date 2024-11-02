import { useState, useEffect, useMemo } from 'react';

export const useSetMessageList = (messages, shouldRender) => {
  const [loading, setLoading] = useState(true);

  const messageList = useMemo(
    () => messages.filter(shouldRender),
    [messages, shouldRender]
  );

  useEffect(() => {
    setLoading(false);
  }, [messages, shouldRender]);

  return { loading, messageList };
};
