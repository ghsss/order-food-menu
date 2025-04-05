type ProductModel = {
    _id?: string;
    id: string;
    name: string;
    price: number;
    description: string;
    image_url?: string;
    image_base64?: string;
}

export default ProductModel;