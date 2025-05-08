export class Person {
  idGarantie: number | null;
  name: string;
  lastName: string;
  cin: string;
  email: string;
  age: number;
  revenue: number;
  active: boolean;
  documents: string;
  policeId: number;
  filePath?: string;

  constructor(
    idGarantie: number | null = null,
    name: string,
    lastName: string,
    cin: string,
    email: string,
    age: number,
    revenue: number,
    active: boolean,
    documents: string,
    policeId: number
  ) {
    this.idGarantie = idGarantie;
    this.name = name;
    this.lastName = lastName;
    this.cin = cin;
    this.email = email;
    this.age = age;
    this.revenue = revenue;
    this.active = active;
    this.documents = documents;
    this.policeId = policeId;
  }
}
