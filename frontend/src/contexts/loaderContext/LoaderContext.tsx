'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface LoaderContextType {
  isLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const showLoader = useCallback(() => setIsLoading(true), []);
  const hideLoader = useCallback(() => setIsLoading(false), []);

  return <LoaderContext.Provider value={{ isLoading, showLoader, hideLoader }}>{children}</LoaderContext.Provider>;
};

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }
  return context;
};
