import { useState, useEffect } from "react";

const IS_SERVER = typeof window === "undefined";

export function useMediaQuery(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = useState<boolean>(defaultValue);

  useEffect(() => {
    if (IS_SERVER) return; // Không chạy trong server-side

    const matchMedia = window.matchMedia(query);
    const handleChange = () => setMatches(matchMedia.matches);

    handleChange(); // Trigger ngay lập tức để lấy giá trị ban đầu

    matchMedia.addEventListener("change", handleChange);
    return () => matchMedia.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}
