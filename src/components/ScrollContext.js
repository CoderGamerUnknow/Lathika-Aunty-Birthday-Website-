import { createContext, useContext } from "react";

export const ScrollContext = createContext({
  lenis: null,
  wrapperRef: { current: null },
  contentRef: { current: null },
});

export const useScrollContext = () => useContext(ScrollContext);
