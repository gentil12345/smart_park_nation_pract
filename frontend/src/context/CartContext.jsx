import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../lib/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setCart({ items: [] }); return; }
    try {
      const { data } = await api.get("/cart");
      setCart(data);
    } catch {
      setCart({ items: [] });
    }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, qty = 1) => {
    setCartLoading(true);
    try {
      const { data } = await api.post("/cart", { productId, qty });
      setCart(data);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to add" };
    } finally {
      setCartLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await api.delete(`/cart/${productId}`);
      setCart(data);
    } catch {}
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart");
      setCart({ items: [] });
    } catch {}
  };

  const cartCount = cart.items.reduce((acc, i) => acc + i.qty, 0);
  const cartTotal = cart.items.reduce((acc, i) => acc + (i.product?.price || 0) * i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, cartLoading, cartCount, cartTotal, addToCart, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
