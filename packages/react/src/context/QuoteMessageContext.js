import React, { createContext, useState, useCallback } from 'react';

const QuoteMessageContext = createContext();

export const QuoteMessageProvider = ({ children }) => {
   const [quotedMessages, setQuotedMessages] = useState([]);

   const addQuotedMessage = useCallback((message) => {
      setQuotedMessages((prevMessages) => {
         const newMessages = [...prevMessages, message];
         console.log(newMessages);
         return newMessages;
      });
   }, []);

   const removeQuotedMessage = useCallback((index) => {
      setQuotedMessages((prevMessages) => {
         const newMessages = [...prevMessages];
         newMessages.splice(index, 1);
         return newMessages;
      });
   }, []);

   const clearQuotedMessages = useCallback(() => {
      setQuotedMessages([]);
   }, []);

   const onCancel = useCallback((index) => {
      const updatedQuotedMessages = [...quotedMessages];
      updatedQuotedMessages.splice(index, 1);
      // Update the state or perform any other necessary actions
      // For example, if using React hooks, you can do something like this:
      setQuotedMessages(updatedQuotedMessages);
   }, [quotedMessages, setQuotedMessages]);

   return (
      <QuoteMessageContext.Provider
         value={{
            quotedMessages,
            onCancel,
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
