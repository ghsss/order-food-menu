type IdentificationModel = {
    type: string;
    number: string;
}

type UserModel = {
    _id?: string;
    chatId: string;
    name?: string;
    phoneNumber: string;
    customerFormattedNumber?: string;
    isSuperAdmin: boolean;
    isAdmin: boolean;
    adminLevel: number;
    email?: string;
    identification?: IdentificationModel;
  };

export default UserModel;