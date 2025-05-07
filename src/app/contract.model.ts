

export interface Contract {
  idContrat?: number;
  date: string;
  name: string;
  contact: string;
  coverageLimit: number;
  premium: number;
  sinistre: Sinistre | null;
  profitabilityRatio?: number;
}
export interface Sinistre {
  idSinistre: number;

}
