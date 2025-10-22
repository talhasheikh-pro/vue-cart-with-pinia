export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  quantity?: number;
  category: string;
  image: string;
  rating: Rating;
}

interface Rating {
  rate: number;
  count: number;
}