import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: number;
}

interface ProductStore {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => void;
  createProduct: (productData: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Enterprise CRM License',
    description: 'Full-featured CRM software for enterprise-level businesses',
    price: 999.99,
    category: 'Software',
    inStock: 100
  },
  {
    id: '2',
    name: 'Sales Analytics Add-on',
    description: 'Advanced reporting and analytics module',
    price: 299.99,
    category: 'Software Extension',
    inStock: 50
  },
  {
    id: '3',
    name: 'Customer Support Package',
    description: 'Premium support and consulting services',
    price: 499.99,
    category: 'Service',
    inStock: 25
  }
];

export const useProductStore = create<ProductStore>((set) => ({
  products: mockProducts,
  loading: false,
  error: null,

  fetchProducts: () => {
    set({ 
      products: mockProducts, 
      loading: false,
      error: null 
    });
  },

  createProduct: (productData) => {
    const newProduct: Product = {
      id: `product_${Date.now()}`,
      ...productData
    };
    set((state) => ({ 
      products: [...state.products, newProduct],
      loading: false,
      error: null
    }));
  },

  updateProduct: (productId, updates) => {
    set((state) => ({
      products: state.products.map(product => 
        product.id === productId 
          ? { ...product, ...updates } 
          : product
      ),
      loading: false,
      error: null
    }));
  },

  deleteProduct: (productId) => {
    set((state) => ({
      products: state.products.filter(product => product.id !== productId),
      loading: false,
      error: null
    }));
  }
}));
