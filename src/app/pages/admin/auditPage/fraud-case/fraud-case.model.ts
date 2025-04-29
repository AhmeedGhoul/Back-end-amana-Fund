import { Audit } from '../audit/audit.model';
import { User } from '../../user/user.model';

export interface FraudCase {
  id_Fraud?: number;
  caseType: 'FINANCIAL' | 'COMPLIANCE' | 'RISK' | 'CORRUPTION';
  detectionDateTime: string; // format ISO
  caseStatus: 'PENDING' | 'FAILED' | 'FINISHED'| 'PAUSED';
  audit?: Audit;
  responsibleUser?: User;
}
