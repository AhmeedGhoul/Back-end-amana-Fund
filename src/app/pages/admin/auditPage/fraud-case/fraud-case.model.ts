import { Audit } from '../audit/audit.model';
import { User } from '../../user/user.model';
export enum CaseType {
  RISK = 'RISK',
  FINANCIAL = 'FINANCIAL',
  COMPLIANCE = 'COMPLIANCE',
  CORRUPTION = 'CORRUPTION'
}
export interface FraudCase {
  id_Fraud?: number;
  caseType: CaseType;
  detectionDateTime: string; // format ISO
  caseStatus: 'PENDING' | 'FAILED' | 'FINISHED'| 'PAUSED';
  audit?: Audit;
  responsibleUser?: User;
}
