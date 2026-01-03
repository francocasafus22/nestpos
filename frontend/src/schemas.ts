import { z } from "zod";

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  image: z.string(),
  price: z.coerce.number(),
  inventory: z.number(),
  categoryId: z.number(),
});

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const CategoryWithProductsResponseSchema = CategorySchema.extend({
  products: z.array(ProductSchema),
});

export const CategoriesResponseSchema = z.array(CategorySchema);

/** Shooping Cart */

const ShoopingCartContentsSchema = ProductSchema.pick({
  name: true,
  image: true,
  price: true,
  inventory: true,
}).extend({
  productId: z.number(),
  quantity: z.number(),
});

export const CouponResponseSchema = z.object({
  name: z.string().default(""),
  message: z.string(),
  percentage: z.coerce.number().min(0).max(100).default(0),
});
export const ShoopingCartSchema = z.array(ShoopingCartContentsSchema);
export type Product = z.infer<typeof ProductSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type ShoopingCart = z.infer<typeof ShoopingCartSchema>;
export type CartItem = z.infer<typeof ShoopingCartContentsSchema>;
export type Coupon = z.infer<typeof CouponResponseSchema>;
