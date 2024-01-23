import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import RCContext from './RCInstance';

const QuoteMessageContext = createContext();

export const QuoteMessageProvider = ({ children }) => {
   const { RCInstance } = useContext(RCContext);
   let host = RCInstance.getHost();
   console.log(host);
   const [quotedMessages, setQuotedMessages] = useState([]);

   const addQuotedMessage = useCallback(async (message) => {
      console.log(message);
      const {
         attachments,
         channels,
         md,
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
            attachments: attachments,
            channels: channels,
            md: md,
            mentions: mentions,
            text: msg,
            rid: rid,
            ts: ts,
            author_icon: `/avatar/${u.username}`,
            author_name: u.name,
            author_username: u.username,
            urls: urls,
            _id: _id,
            _updatedAt: _updatedAt
         };
         setQuotedMessages((prevMessages) => [...prevMessages, quotedMessage]);
         console.log(quotedMessage);
      }
   }, [quotedMessages]);

   const removeQuotedMessage = useCallback(async (index) => {
      setQuotedMessages((prevMessages) => {
         const newMessages = [...prevMessages];
         newMessages.splice(index, 1);
         console.log(newMessages);
         return newMessages;
      });
   }, []);

   const clearQuotedMessages = useCallback(async () => {
      setQuotedMessages([]);
   }, []);

   console.log(quotedMessages);


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
