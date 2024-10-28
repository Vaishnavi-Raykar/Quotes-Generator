"use client";
import React, { useEffect, useState } from "react";
import { useQuotes } from "../context/QuoteContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Heart, RefreshCw, Share2 } from "lucide-react";

const QuoteList = () => {
  const { quotes, generateQuote, deleteQuote, isLoading } = useQuotes();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse -top-48 -left-48"></div>
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse -bottom-48 -right-48"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Clock Section */}
        <div className="text-center pt-20 pb-10">
          <Clock />
        </div>

        {/* Generate Button */}
        <div className="flex justify-center mb-10">
          <Button
            onClick={generateQuote}
            disabled={isLoading}
            className="relative group bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
            <span className="relative flex items-center gap-2">
              {isLoading ? (
                <>
                  <RefreshCw className="animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate New Quote"
              )}
            </span>
          </Button>
        </div>

        {/* Quotes Display */}
        <div className="max-w-3xl mx-auto space-y-6">
          {quotes.map((quote, index) => (
            <div
              key={index}
              className="transform transition-all duration-300 hover:scale-105"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.2}s both`,
              }}
            >
              <QuoteCard
                quote={quote}
                onDelete={() => deleteQuote(quote.quotetype)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Clock = () => {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!time) return null;

  return (
    <div className="text-white backdrop-blur-lg bg-white/5 p-8 rounded-2xl inline-block transform hover:scale-105 transition-transform duration-300">
      <div className="text-6xl font-bold mb-2 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
        {time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </div>
      <div className="text-xl text-blue-100/80">
        {time.toLocaleDateString([], {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
    </div>
  );
};

const QuoteCard = ({ quote }) => {
  // Use localStorage to persist likes between refreshes
  const [likedQuotes, setLikedQuotes] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("likedQuotes");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load liked quotes from localStorage on mount
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("likedQuotes");
      if (saved) {
        setLikedQuotes(JSON.parse(saved));
      }
    }
  }, []);

  useEffect(() => {
    // Save liked quotes to localStorage whenever they change
    if (typeof window !== "undefined") {
      localStorage.setItem("likedQuotes", JSON.stringify(likedQuotes));
    }
  }, [likedQuotes]);

  const handleLike = () => {
    setLikedQuotes(prev => ({
      ...prev,
      // Use a unique identifier for each quote (combination of quote text and author)
      [`${quote.quote}-${quote.author}`]: !prev[`${quote.quote}-${quote.author}`]
    }));
  };

  const handleShare = () => {
    const quoteText = `"${quote.quote}" — ${quote.author}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      quoteText
    )}`;

    if (typeof window !== "undefined") {
      window.open(twitterUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (!mounted) return null;

  const isLiked = likedQuotes[`${quote.quote}-${quote.author}`] || false;

  return (
    <Card className="p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex items-start">
        <CardTitle className="text-4xl text-primary font-serif mb-1">
          &quot;
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-medium leading-relaxed mb-4 text-foreground">
          {quote.quote}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-md text-muted-foreground">— {quote.author}</p>
        <div className="flex gap-4">
          <button
            onClick={handleLike}
            className={`text-muted-foreground hover:text-pink-500 transition-transform duration-300 transform hover:scale-110 ${
              isLiked ? "text-pink-500 fill-current" : ""
            }`}
          >
            <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
          </button>

          <button
            onClick={handleShare}
            className="text-muted-foreground hover:text-purple-400 transition-transform duration-300 transform hover:scale-110"
          >
            <Share2 size={20} />
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default QuoteList;



// 'use client'
// import React, { useEffect, useState } from "react";
// import { useQuotes } from "../context/QuoteContext";
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
// import { Heart, RefreshCw, Share2 } from "lucide-react";

// const QuoteList = () => {
//   const { quotes, generateQuote, isLoading } = useQuotes();
//   const [currentQuote, setCurrentQuote] = useState(null);
//   const [key, setKey] = useState(0); // Add a key to force re-render

//   // Generate initial quote when component mounts
//   useEffect(() => {
//     const fetchInitialQuote = async () => {
//       const initialQuote = await generateQuote();
//       setCurrentQuote(initialQuote);
//     };

//     if (!currentQuote) {
//       fetchInitialQuote();
//     }
//   }, []);

//   // Update currentQuote when quotes array changes
//   useEffect(() => {
//     if (quotes && quotes.length > 0) {
//       setCurrentQuote(quotes[quotes.length - 1]);
//     }
//   }, [quotes]);

//   // const handleNewQuote = async () => {
//   //   await generateQuote();
//   //   setKey(prevKey => prevKey + 1); // Increment key to force re-render
//   // };

//   const handleNewQuote = async () => {
//     const newQuote = await generateQuote(); // Directly get new quote
//     setCurrentQuote(newQuote); // Update current quote immediately
//     setKey(prevKey => prevKey + 1);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4 relative overflow-hidden">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse -top-48 -left-48"></div>
//         <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse -bottom-48 -right-48"></div>
//       </div>

//       {/* Floating particles */}
//       <div className="absolute inset-0">
//         {[...Array(20)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute w-2 h-2 bg-white/10 rounded-full animate-float"
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animationDelay: `${Math.random() * 5}s`,
//               animationDuration: `${5 + Math.random() * 10}s`
//             }}
//           ></div>
//         ))}
//       </div>

//       {/* Main content */}
//       <div className="relative z-10">
//         {/* Clock Section */}
//         <div className="text-center pt-20 pb-10">
//           <Clock />
//         </div>

// <div className="max-w-3xl mx-auto">
//           {currentQuote ? (
//             <div className="transform transition-all duration-300 hover:scale-105">
//               <QuoteCard
//                 quote={currentQuote}
//                 onRefresh={handleNewQuote}
//                 isLoading={isLoading}
//               />
//             </div>
//           ) : (
//             <div className="flex justify-center items-center h-48">
//               <RefreshCw className="animate-spin text-white" size={32} />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const Clock = () => {
//   const [time, setTime] = useState(null);

//   useEffect(() => {
//     setTime(new Date());
//     const timer = setInterval(() => setTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   if (!time) return null;

//   return (
//     <div className="text-white backdrop-blur-lg bg-white/5 p-8 rounded-2xl inline-block transform hover:scale-105 transition-transform duration-300">
//       <div className="text-6xl font-bold mb-2 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
//         {time.toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//           second: "2-digit",
//         })}
//       </div>
//       <div className="text-xl text-blue-100/80">
//         {time.toLocaleDateString([], {
//           weekday: "long",
//           year: "numeric",
//           month: "long",
//           day: "numeric",
//         })}
//       </div>
//     </div>
//   );
// };

// const QuoteCard = ({ quote, onRefresh, isLoading }) => {
// const [liked, setLiked] = useState(false);
// const [mounted, setMounted] = useState(false);

// useEffect(() => {
//   setMounted(true);
// }, []);

// const handleLike = () => {
//   setLiked(!liked);
// };

// const handleShare = () => {
//   const quoteText = `"${quote.quote}" — ${quote.author}`;
//   const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(quoteText)}`;

//   if (typeof window !== 'undefined') {
//     window.open(twitterUrl, '_blank', 'noopener,noreferrer');
//   }
// };

// if (!mounted) return null;

//   return (
//     <Card className="p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
//       <CardHeader className="flex items-start">
//         <CardTitle className="text-4xl text-primary font-serif mb-1">
//           &quot;
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <p className="text-lg font-medium leading-relaxed mb-4 text-foreground">
//           {quote.quote}
//         </p>
//       </CardContent>
//       <CardFooter className="flex justify-between items-center">
//         <p className="text-md text-muted-foreground">— {quote.author}</p>
//         <div className="flex gap-4">
// <button
//   onClick={handleLike}
//   className={`text-muted-foreground hover:text-pink-500 transition-transform duration-300 transform hover:scale-110 ${
//     liked ? "text-pink-500 fill-current" : ""
//   }`}
// >
//   <Heart
//     size={20}
//     fill={liked ? "currentColor" : "none"}
//   />
// </button>

//           <button
//             onClick={onRefresh}
//             disabled={isLoading}
//             className="text-muted-foreground hover:text-blue-400 transition-transform duration-300 transform hover:scale-110"
//           >
//             <RefreshCw
//               size={20}
//               className={isLoading ? "animate-spin" : ""}
//             />
//           </button>

// <button
//   onClick={handleShare}
//   className="text-muted-foreground hover:text-purple-400 transition-transform duration-300 transform hover:scale-110"
// >
//   <Share2 size={20} />
// </button>
//         </div>
//       </CardFooter>
//     </Card>
//   );
// };

// export default QuoteList;
