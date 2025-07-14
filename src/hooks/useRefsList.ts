import React from 'react';
import { useRef } from 'react';

export function useRefsList<T>(length: number) {
  const refs = useRef<Array<React.RefObject<T>>>([]);

  // Ensure refs array always has the correct length
  while (refs.current.length < length) {
    refs.current.push(React.createRef<T>());
  }

  // Optional: trim excess if length decreases
  if (refs.current.length > length) {
    refs.current = refs.current.slice(0, length);
  }

  return refs.current;
}
