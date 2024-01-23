import { useContext } from 'react';
import QuoteMessageContext from '../context/QuoteMessageContext';

export const useQuoteMessage = () => {
   const context = useContext(QuoteMessageContext);

   if (!context) {
      throw new Error('useQuotedMessages must be used within a QuotedMessagesProvider');
   }

   return context;
};
