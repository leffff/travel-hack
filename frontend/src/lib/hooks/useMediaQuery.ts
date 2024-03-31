import { useState, useEffect } from "react";

// Define the hook using TypeScript
const useMediaQuery = (query: string): boolean => {
  // Initialize state with current match
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Ensure `window` is defined (avoid errors during server-side rendering)
    if (typeof window !== "undefined") {
      // Use `matchMedia` to check the query
      const media = window.matchMedia(query);
      // Update state if the query matches
      if (media.matches !== matches) {
        setMatches(media.matches);
      }

      // Event listener for changes
      const listener = () => setMatches(media.matches);
      media.addEventListener("change", listener);

      // Clean up
      return () => media.removeEventListener("change", listener);
    }
  }, [query, matches]);

  // Return the current match state
  return matches;
};

export default useMediaQuery;
