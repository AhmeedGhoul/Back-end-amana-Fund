export class Sinistres {
  idSinistre: number | null;
  claimAmount: number;
  reinsuranceShaire: number;
  settlementDate: string;
  settlementAmount: number;
  user: User | null;
  police: any;

  constructor(
    idSinistre: number | null,
    claimAmount: number,
    reinsuranceShaire: number,
    settlementDate: string,
    settlementAmount: number,
    user: User | null,
    police: any
  ) {
    this.idSinistre = idSinistre;
    this.claimAmount = claimAmount;
    this.reinsuranceShaire = reinsuranceShaire;
    this.settlementDate = settlementDate;
    this.settlementAmount = settlementAmount;
    this.user = user;
    this.police = police;
  }
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
}
