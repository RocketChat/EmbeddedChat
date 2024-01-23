import React, { createContext, useState, useCallback, useEffect } from 'react';

const QuoteMessageContext = createContext();

export const QuotedMessagesProvider = ({ children }) => {
   const [quotedMessages, setQuotedMessages] = useState([]);

   const addQuotedMessage = useCallback(async (message) => {
      console.log(message);
      const {
         attachments,
         channels,
         editedAt,
         editedBy,
         reactions,
         replies,
         t,
         tcount,
         tlm,
         md,
         file,
         files,
         groupable,
         mentions,
         msg,
         rid,
         ts,
         u,
         urls,
         _id,
         _updatedAt
      } = message;

      // Check if the message with the same _id already exists
      const isMessageAlreadyAdded = quotedMessages.some((quotedMsg) => quotedMsg._id === _id);

      if (!isMessageAlreadyAdded) {
         const quotedMessage = {
            attachments,
            channels,
            editedAt,
            editedBy,
            reactions,
            replies,
            t,
            tcount,
            tlm,
            md,
            file,
            files,
            groupable,
            mentions,
            msg,
            rid,
            ts,
            u,
            urls,
            _id,
            _updatedAt
         };
         setQuotedMessages((prevMessages) => [...prevMessages, quotedMessage]);
      }
   }, [quotedMessages]);

   useEffect(() => {
      console.log(quotedMessages);
   }, [quotedMessages])

   const removeQuotedMessage = useCallback(async (index) => {
      setQuotedMessages((prevMessages) => {
         const newMessages = [...prevMessages];
         newMessages.splice(index, 1);
         return newMessages;
      });
   }, []);

   const clearQuotedMessages = useCallback(async () => {
      setQuotedMessages([]);
   }, []);

   return (
      <QuoteMessageContext.Provider
         value={{
            quotedMessages,
            addQuotedMessage,
            removeQuotedMessage,
            clearQuotedMessages,
         }}
      >
         {children}
      </QuoteMessageContext.Provider>
   );
};

export default QuoteMessageContext;
