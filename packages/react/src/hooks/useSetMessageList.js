import { useState, useEffect } from 'react';

export const useSetMessageList = (messages, shouldRender) => {
  const [loading, setLoading] = useState(true);
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    setLoading(true);
    const filteredMessages = messages.filter((message) =>
      shouldRender(message)
    );

    setMessageList(filteredMessages);
    setLoading(false);
  }, [messages, shouldRender]);

  return { loading, messageList };
};
