export enum TypeObject {
  ANIMALS = 'ANIMALS',
  HOUSE = 'HOUSE',
  LAND = 'LAND'
}

export const getTypeObjectValues = () => {
  return Object.values(TypeObject) as TypeObject[];
}

export interface PoliceOption {
  idPolice: number;
  amount: number;
  displayText: string;
}

export interface ObjectG {
  idGarantie?: number;
  active: boolean;
  documents: string;
  ownershipCertifNumber: number;
  estimatedValue: number;
  type: TypeObject;
  policeId: number;
}
