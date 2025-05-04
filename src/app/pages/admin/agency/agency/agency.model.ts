export interface Agency {
  id_agency: number;
  governorate: string;
  address: string;
  city: string;
  phoneNumber: string;
  email: string;
  latitude?: number;
  longitude?: number;
}

export enum Governorate {
  TUNIS = 'TUNIS',
  NABEUL = 'NABEUL',
  SFAX = 'SFAX',
  GABES = 'GABES'
}
