type IdentificationModel = {
    type: string;
    number: string;
}

type UserModel = {
    _id: string;
    chatId: string;
    name?: string;
    customerFormattedNumber: string;
    email?: string;
    identification?: IdentificationModel;
}

export default UserModel;