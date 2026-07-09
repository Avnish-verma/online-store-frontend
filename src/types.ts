export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  images: string[];
  sizes: string[];
  colours: string[];
}

export interface Offer {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
}

export interface Settings {
  whatsappNumber: string;
  storeName: string;
  address: string;
}

export interface PaginatedResponse<T> {
  products: T[];
  total: number;
  page: number;
  limit: number;
}
