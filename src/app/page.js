// pages/index.js
import { QuoteProvider } from "./context/QuoteContext"; // Update to RecipeProvider
import QuoteList from "./components/QuoteList"; // Update to RecipeList
import { CopilotPopup } from "@copilotkit/react-ui";

export default function Home() {
  return (
    <>
      <div className="w-full">
      <QuoteProvider>
        <div className=" mx-auto ">
          <QuoteList /> 
        </div>
      </QuoteProvider>
      <CopilotPopup
      instructions={
        `Provide a daily quote based on the user’s selected type. When the user types a number from 1 to 5, respond with a single quote that matches the type. Each response should be short and include only the quote and its author if available.
      
        Quote types:
        1 - Motivational
        2 - Inspirational
        3 - Positive
        4 - Life
        5 - Wisdom
      
        Format each response as:
        "Quote text." - Author (or "Unknown" if not available)`
      }
      labels={{
        title: "Daily Quote",
        initial: `Type a number to get a specific quote:
        1 - Motivational
        2 - Inspirational
        3 - Positive
        4 - Life
        5 - Wisdom`
      }}      
      />
      </div>
    </>
  );
}
