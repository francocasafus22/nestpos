import { create } from "zustand";
import { Coupon, CouponResponseSchema, Product, ShoopingCart } from "./schemas";
import { devtools } from "zustand/middleware";

interface Store {
  total: number;
  contents: ShoopingCart;
  coupon: Coupon;
  addToCart: (product: Product) => void;
  updateQuantity: (id: Product["id"], quantity: number) => void;
  removeFromCart: (id: Product["id"]) => void;
  calculateTotal: () => void;
  applyCoupon: (couponName: string) => Promise<void>;
}

export const useStore = create<Store>()(
  devtools((set, get) => ({
    total: 0,
    contents: [],
    coupon: {
      percentage: 0,
      name: "",
      message: "",
    },
    calculateTotal: () => {
      const total = get().contents.reduce(
        (t, item) => item.price * item.quantity + t,
        0,
      );

      set(() => ({
        total,
      }));
    },
    addToCart: (product) => {
      const { id: productId, categoryId, ...data } = product;
      let contents: ShoopingCart = [];
      // Verificar si está duplicado
      const duplicated = get().contents.findIndex(
        (item) => item.productId == productId,
      );
      if (duplicated >= 0) {
        // Validar que no supere el stock
        if (
          get().contents[duplicated].quantity >=
          get().contents[duplicated].inventory
        )
          return;
        // Si esta duplicado sumarle a quantity, sino devolver el item como está
        contents = get().contents.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      } else {
        // Añadir el product a contents
        contents = [...get().contents, { ...data, productId, quantity: 1 }];
      }

      set(() => ({ contents }));
      get().calculateTotal();
    },
    updateQuantity: (id, quantity) => {
      set((state) => ({
        contents: state.contents.map((item) =>
          item.productId === id ? { ...item, quantity } : item,
        ),
      }));
      get().calculateTotal();
    },
    removeFromCart: (id) => {
      set((state) => ({
        contents: state.contents.filter((item) => item.productId !== id),
      }));
      get().calculateTotal();
    },
    applyCoupon: async (couponName) => {
      const req = await fetch("/coupons/api", {
        method: "POST",
        body: JSON.stringify({
          name: couponName,
        }),
      });
      const json = await req.json();
      const coupon = CouponResponseSchema.parse(json);
      set(() => ({
        coupon,
      }));
    },
  })),
);
