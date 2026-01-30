"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FavoritesContextType {
  favorites: string[]; // Array of product handles
  addFavorite: (handle: string) => void;
  removeFavorite: (handle: string) => void;
  toggleFavorite: (handle: string) => void;
  isFavorite: (handle: string) => boolean;
  favoriteCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const STORAGE_KEY = 'locra-favorites';

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error('Failed to save favorites:', error);
      }
    }
  }, [favorites, isLoaded]);

  const addFavorite = (handle: string) => {
    setFavorites(prev => {
      if (prev.includes(handle)) return prev;
      return [...prev, handle];
    });
  };

  const removeFavorite = (handle: string) => {
    setFavorites(prev => prev.filter(h => h !== handle));
  };

  const toggleFavorite = (handle: string) => {
    if (favorites.includes(handle)) {
      removeFavorite(handle);
    } else {
      addFavorite(handle);
    }
  };

  const isFavorite = (handle: string) => favorites.includes(handle);

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      isFavorite,
      favoriteCount: favorites.length,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
