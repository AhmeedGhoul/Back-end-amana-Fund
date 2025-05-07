export class Sinistres {
  idSinistre: number | null;
  claimAmount: number;
  reinsuranceShaire: number;
  settlementDate: string;
  settlementAmount: number;
  user: User | null; // Keep the User reference

  constructor(
    idSinistre: number | null,
    claimAmount: number,
    reinsuranceShaire: number,
    settlementDate: string,
    settlementAmount: number,
    user: User | null
  ) {
    this.idSinistre = idSinistre;
    this.claimAmount = claimAmount;
    this.reinsuranceShaire = reinsuranceShaire;
    this.settlementDate = settlementDate;
    this.settlementAmount = settlementAmount;
    this.user = user; // Assign User object
  }
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
}
