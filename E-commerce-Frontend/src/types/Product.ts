interface Size {
  size: string;
  stock: number;
}

export interface Product {
  availableSizes: string[];
  brand: string;
  color: string;
  imageSrc: string[];
  name: string;
  price: number;
  sizes: Size[];
  isWishlisted?: boolean,
  productID: string;
  variantID: string;
  createdAt: string;
  updatedAt: string;
  _id: string;
}