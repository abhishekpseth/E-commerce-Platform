export interface CartItem {
  productName: string;
  brand: string;
  color: string;
  images: string[];
  price: number;
  quantity: number;
  size: string;
  stockSize: number;
  availableSizes: string[];
  productID: string;
  variantID: string;
  cartID: string;
}