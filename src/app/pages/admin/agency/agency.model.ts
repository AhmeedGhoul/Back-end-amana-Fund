export interface Agency {
  id_agency?: number;
  governorate: string;
  address: string;
  city: string;
  phoneNumber: string;
  email: string;
  user?: any; // Adjust the type for User if you have a specific model
  latitude?: number;
  longitude?: number;
}

export enum Governorate {
  TUNIS = 'TUNIS',
  NABEUL = 'NABEUL',
  SFAX = 'SFAX',
  GABES = 'GABES'
}
