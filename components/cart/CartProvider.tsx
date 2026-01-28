"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Cart } from "@/lib/shopify/types";
import {
  createCart,
  getCart,
  addToCart,
  updateCartLines,
  removeFromCart,
} from "@/lib/shopify";

const CART_ID_KEY = "locra-cart-id";

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  checkout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Initialize cart from localStorage
  useEffect(() => {
    const initCart = async () => {
      const storedCartId = localStorage.getItem(CART_ID_KEY);
      if (storedCartId) {
        setIsLoading(true);
        try {
          const existingCart = await getCart(storedCartId);
          if (existingCart) {
            setCart(existingCart);
          } else {
            // Cart expired or invalid, clear storage
            localStorage.removeItem(CART_ID_KEY);
          }
        } catch (error) {
          console.error("Failed to fetch cart:", error);
          localStorage.removeItem(CART_ID_KEY);
        } finally {
          setIsLoading(false);
        }
      }
    };

    initCart();
  }, []);

  // Create cart if doesn't exist
  const ensureCart = useCallback(async (): Promise<string | null> => {
    if (cart?.id) return cart.id;

    const storedCartId = localStorage.getItem(CART_ID_KEY);
    if (storedCartId) return storedCartId;

    const newCart = await createCart();
    if (newCart) {
      localStorage.setItem(CART_ID_KEY, newCart.id);
      setCart(newCart);
      return newCart.id;
    }

    return null;
  }, [cart?.id]);

  const addItem = useCallback(
    async (variantId: string, quantity: number = 1) => {
      setIsLoading(true);
      try {
        const cartId = await ensureCart();
        if (!cartId) throw new Error("Failed to create cart");

        const updatedCart = await addToCart(cartId, [
          { merchandiseId: variantId, quantity },
        ]);

        if (updatedCart) {
          setCart(updatedCart);
          setIsOpen(true); // Open cart drawer after adding
        }
      } catch (error) {
        console.error("Failed to add item:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [ensureCart]
  );

  const updateItem = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart?.id) return;

      setIsLoading(true);
      try {
        const updatedCart = await updateCartLines(cart.id, [
          { id: lineId, quantity },
        ]);

        if (updatedCart) {
          setCart(updatedCart);
        }
      } catch (error) {
        console.error("Failed to update item:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [cart?.id]
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cart?.id) return;

      setIsLoading(true);
      try {
        const updatedCart = await removeFromCart(cart.id, [lineId]);

        if (updatedCart) {
          setCart(updatedCart);
        }
      } catch (error) {
        console.error("Failed to remove item:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [cart?.id]
  );

  const checkout = useCallback(() => {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    }
  }, [cart?.checkoutUrl]);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        isOpen,
        setIsOpen,
        addItem,
        updateItem,
        removeItem,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
