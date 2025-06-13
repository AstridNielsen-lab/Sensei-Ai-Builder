import React, { createContext, useContext, ReactNode } from 'react';

interface AIBuilderContextType {
  // Contexto vazio por agora
}

const AIBuilderContext = createContext<AIBuilderContextType | undefined>(undefined);

export function AIBuilderProvider({ children }: { children: ReactNode }) {
  return (
    <AIBuilderContext.Provider value={{}}>
      {children}
    </AIBuilderContext.Provider>
  );
}

export function useAIBuilder() {
  const context = useContext(AIBuilderContext);
  if (context === undefined) {
    return {};
  }
  return context;
}

