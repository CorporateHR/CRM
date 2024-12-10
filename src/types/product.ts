export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  features: string[];
  specifications: Record<string, string>;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  features: string[];
  specifications: Record<string, string>;
  meta_title: string;
  meta_description: string;
}