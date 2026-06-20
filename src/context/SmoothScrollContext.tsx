'use client';

import { createContext, useContext } from 'react';
import Lenis from 'lenis';

export const SmoothScrollContext = createContext<Lenis | null>(null);

export const useLenis = () => {
  const context = useContext(SmoothScrollContext);
  return context;
};
