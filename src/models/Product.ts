import ProductTypeModel from "./ProductType";

type ProductModel = {
  _id?: string;
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  image_url?: string;
  image_base64?: string;
  productType: ProductTypeModel;
};

export default ProductModel;
