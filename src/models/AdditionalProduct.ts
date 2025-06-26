import ProductTypeModel from "./ProductType";

export type AdditionalProductModel = {
    _id?: string;
    id: string;
    name: string;
    price: number;
    stock: number;
    description: string;
    image_url?: string;
    image_base64?: string;
    availableProductType: ProductTypeModel[]
};

export default AdditionalProductModel;