type ProductTypeModel = {
    _id?: string;
    id: string;
    name: string;
    subtype?: ProductTypeModel;
}

export default ProductTypeModel;