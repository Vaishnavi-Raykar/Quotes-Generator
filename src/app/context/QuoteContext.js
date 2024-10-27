'use client'

import { createContext, useState, useContext } from "react";

const QuoteContext = createContext();

export const QuoteProvider = ({ children }) => {
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateQuote = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quotes: "random" }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setQuotes((prev) => [
          {
            quotetype: data.quotetype,
            quote: data.quote,
            author: data.author,
            createdAt: new Date(),
          },
          ...prev,
        ]);
      }
    } catch (error) {
      console.error("Error generating quote:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteQuote = (quoteType) => {
    setQuotes((prev) => prev.filter((quote) => quote.quotetype !== quoteType));
  };

  return (
    <QuoteContext.Provider
      value={{
        quotes,
        generateQuote,
        deleteQuote,
        isLoading,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
};

export const useQuotes = () => useContext(QuoteContext);

