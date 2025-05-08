export class Police {
  idPolice?: number;
  active: boolean = true;
  start: Date | null;
  end: Date | null;
  amount: number;
  frequency: 'MONTHLY' | 'QUARTERLY' | 'HALF_YEARLY' | 'YEARLY';
  renewalDate: Date | null;
  userId: number = 0;

  constructor() {
    this.active = true
    this.userId = 0;
  }

  static fromJson(json: any): Police {
    const police = new Police();
    police.idPolice = json.idPolice;
    police.active = json.active;
    police.start = json.start ? new Date(json.start) : null;
    police.end = json.end ? new Date(json.end) : null;
    police.amount = json.amount;
    police.frequency = json.frequency;
    police.renewalDate = json.renewalDate ? new Date(json.renewalDate) : null;
    police.userId = json.userId;
    return police;
  }
}
