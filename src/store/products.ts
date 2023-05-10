import { create } from 'zustand';
import defaultProducts from '../data/products.json';
import { persist } from 'zustand/middleware';

export interface Product {
  name: string;
  tags: string;
}

export interface ProductState {
  products: Product[];
  addProduct: (name: string) => void;
}

export const useProductStore = create<ProductState>()(
persist((set, get) => ({
  products: defaultProducts as Product[],
  addProduct: (name: string) => {
    const products = get().products;
    if (products.find(p => p.name === name)) return;

    set({
      products: [...products, { name, tags: '' }],
    });
  }
}), {
  name: 'product-storage',
}));
