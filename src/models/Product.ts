import ProductTypeModel from "./ProductType";

type ProductModel = {
    _id?: string;
    id: string;
    name: string;
    price: number;
    description: string;
    image_url?: string;
    image_base64?: string;
    product_type: ProductTypeModel; 
}

export default ProductModel;