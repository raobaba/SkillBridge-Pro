import { useRef, useEffect, useContext, forwardRef } from 'react';
import {
  Checkbox, ScrollBar, Tooltip
} from "../../ui-controls";

import { ScrollContext } from '.';

const CustomScrollbars = forwardRef(({ children, onScroll }, ref) => {
  const ofRef = useRef(null);
  const {
    horizontal = 'hidden',
    verticle = 'scroll',
    maxHeight,
    maxWidth = '100%',
  } = useContext(ScrollContext);
  useEffect(() => {
    const os = ofRef?.current?.osInstance?.();
    const el = os?.getElements?.viewport; // not calling getElements()

    if (onScroll && el) {
      el.addEventListener("scroll", onScroll);
    }

    return () => {
      if (onScroll && el) {
        el.removeEventListener("scroll", onScroll);
      }
    };
  }, [onScroll]);


  return (
    <ScrollBar
      sbRef={ofRef}
      horizontal={horizontal}
      verticle={verticle}
      maxHeight={maxHeight}
      maxWidth={maxWidth}
    >
      {children}
    </ScrollBar>
  );
});

export default CustomScrollbars;
