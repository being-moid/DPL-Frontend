export interface Category {
  categoryId: string;
  categoryName: string;
  description: string;
  imageURL: string;
  imageBinnary: string;
  imageName: string;
  imageFormat: string;
  parentGuidID: string;
  subCategories: Category[];
}
export interface Product {
  productID: string;
  productName: string;
  amount: number;
  imageURL: string;
  image64: string;
  categoryId: string;
  category: Category;
}
