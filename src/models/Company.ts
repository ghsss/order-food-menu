export type WorkingDay = {
  alwaysOpen: boolean;
  day: number;
  dayLabel: string;
  startHour: string;
  endHour: string;
};

type CompanyModel = {
  _id: string;
  name: string;
  cnpj: string;
  email: string;
  chatId: string;
  phoneNumber: string;
  haveDelivery: boolean;
  site: string;
  workingToday: boolean;
  workingDays: WorkingDay[];
  timezone: string;
  addressNumber?: string;
  street?: string;
  neighborhood?: string;
  postalCode?: string;
  city: string;
  state: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
};

export default CompanyModel;
