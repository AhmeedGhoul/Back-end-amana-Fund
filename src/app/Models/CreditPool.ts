export class CreditPool {
  // Match exact field names from Spring Boot entity
  id_credit_pool: number = 0;
  maxValue: number = 0;      // Changed from max_value to match backend
  minValue: number = 0;      // Changed from min_value to match backend
  n_Echeance: number = 0;    // Changed from n_echeance to match backend
  pool_Sum: number = 0;      // Changed from pool_sum to match backend
  full: boolean = false;
  open_Date: Date | null = null;  // Changed from open_date to match backend
  close_Date: Date | null = null; // Changed from close_date to match backend
  grace_Period: Date | null = null; // Changed from grace_period to match backend
  Period: Date | null = null;      // Changed from period to match backend (capital P)
  contracts: any[] = [];
  message?: string;
  
  // Legacy field names for backward compatibility
  get max_value(): number { return this.maxValue; }
  set max_value(value: number) { this.maxValue = value; }
  
  get min_value(): number { return this.minValue; }
  set min_value(value: number) { this.minValue = value; }
  
  get n_echeance(): number { return this.n_Echeance; }
  set n_echeance(value: number) { this.n_Echeance = value; }
  
  get pool_sum(): number { return this.pool_Sum; }
  set pool_sum(value: number) { this.pool_Sum = value; }
  
  get open_date(): Date | null { return this.open_Date; }
  set open_date(value: Date | null) { this.open_Date = value; }
  
  get close_date(): Date | null { return this.close_Date; }
  set close_date(value: Date | null) { this.close_Date = value; }
  
  get grace_period(): Date | null { return this.grace_Period; }
  set grace_period(value: Date | null) { this.grace_Period = value; }
  
  get period(): Date | null { return this.Period; }
  set period(value: Date | null) { this.Period = value; }

  static fromJson(json: any): CreditPool {
    const cp = new CreditPool();
    
    // Log the raw data for debugging
    console.log('Raw credit pool data:', JSON.stringify(json, null, 2));
    
    // Handle ID field - check for different possible names
    cp.id_credit_pool = json.id_credit_pool || json.id || json.creditPoolId || json.credit_pool_id || 0;
    
    // Handle numeric fields with fallbacks - prioritize exact backend field names
    // maxValue is the primary field name in the backend
    cp.maxValue = typeof json.maxValue === 'string' ? parseFloat(json.maxValue) : 
                 (json.maxValue !== undefined && json.maxValue !== null) ? Number(json.maxValue) :
                 typeof json.max_value === 'string' ? parseFloat(json.max_value) :
                 json.max_value || 0;
                  
    // minValue is the primary field name in the backend
    cp.minValue = typeof json.minValue === 'string' ? parseFloat(json.minValue) : 
                 (json.minValue !== undefined && json.minValue !== null) ? Number(json.minValue) :
                 typeof json.min_value === 'string' ? parseFloat(json.min_value) :
                 json.min_value || 0;
                  
    // n_Echeance is the primary field name in the backend (note the capital E)
    cp.n_Echeance = typeof json.n_Echeance === 'string' ? parseInt(json.n_Echeance) : 
                   (json.n_Echeance !== undefined && json.n_Echeance !== null) ? Number(json.n_Echeance) :
                   typeof json.n_echeance === 'string' ? parseInt(json.n_echeance) :
                   json.n_echeance || json.nEcheance || 0;
                   
    // pool_Sum is the primary field name in the backend (note the capital S)
    cp.pool_Sum = typeof json.pool_Sum === 'string' ? parseFloat(json.pool_Sum) : 
                 (json.pool_Sum !== undefined && json.pool_Sum !== null) ? Number(json.pool_Sum) :
                 typeof json.pool_sum === 'string' ? parseFloat(json.pool_sum) :
                 json.pool_sum || json.poolSum || 0;
    
    // Log numeric field values for debugging
    console.log('Parsed numeric values:', {
      id: cp.id_credit_pool,
      maxValue: cp.maxValue,
      minValue: cp.minValue,
      n_Echeance: cp.n_Echeance,
      pool_Sum: cp.pool_Sum
    });
    
    // Handle boolean fields
    cp.full = json.full || json.isFull || false;
    
    // Handle date fields safely - prioritize exact backend field names
    // open_Date is the primary field name in the backend (note the capital D)
    if (json.open_Date) {
      try {
        cp.open_Date = new Date(json.open_Date);
        console.log('Parsed open_Date:', cp.open_Date);
      } catch (e) {
        console.warn('Invalid open_Date format:', json.open_Date);
        cp.open_Date = null;
      }
    } else if (json.open_date) {
      try {
        cp.open_Date = new Date(json.open_date);
        console.log('Parsed open_date:', cp.open_Date);
      } catch (e) {
        console.warn('Invalid open_date format:', json.open_date);
        cp.open_Date = null;
      }
    } else if (json.openDate) {
      try {
        cp.open_Date = new Date(json.openDate);
        console.log('Parsed openDate:', cp.open_Date);
      } catch (e) {
        console.warn('Invalid openDate format:', json.openDate);
        cp.open_Date = null;
      }
    } else {
      cp.open_Date = null;
    }
    
    // close_Date is the primary field name in the backend (note the capital D)
    if (json.close_Date) {
      try {
        cp.close_Date = new Date(json.close_Date);
        console.log('Parsed close_Date:', cp.close_Date);
      } catch (e) {
        console.warn('Invalid close_Date format:', json.close_Date);
        cp.close_Date = null;
      }
    } else if (json.close_date) {
      try {
        cp.close_Date = new Date(json.close_date);
        console.log('Parsed close_date:', cp.close_Date);
      } catch (e) {
        console.warn('Invalid close_date format:', json.close_date);
        cp.close_Date = null;
      }
    } else if (json.closeDate) {
      try {
        cp.close_Date = new Date(json.closeDate);
        console.log('Parsed closeDate:', cp.close_Date);
      } catch (e) {
        console.warn('Invalid closeDate format:', json.closeDate);
        cp.close_Date = null;
      }
    } else {
      cp.close_Date = null;
    }
    
    // grace_Period is the primary field name in the backend (note the capital P)
    if (json.grace_Period) {
      try {
        cp.grace_Period = new Date(json.grace_Period);
        console.log('Parsed grace_Period:', cp.grace_Period);
      } catch (e) {
        console.warn('Invalid grace_Period format:', json.grace_Period);
        cp.grace_Period = null;
      }
    } else if (json.grace_period) {
      try {
        cp.grace_Period = new Date(json.grace_period);
        console.log('Parsed grace_period:', cp.grace_Period);
      } catch (e) {
        console.warn('Invalid grace_period format:', json.grace_period);
        cp.grace_Period = null;
      }
    } else if (json.gracePeriod) {
      try {
        cp.grace_Period = new Date(json.gracePeriod);
        console.log('Parsed gracePeriod:', cp.grace_Period);
      } catch (e) {
        console.warn('Invalid gracePeriod format:', json.gracePeriod);
        cp.grace_Period = null;
      }
    } else {
      cp.grace_Period = null;
    }
    
    // Period is the primary field name in the backend (note the capital P)
    if (json.Period) {
      try {
        cp.Period = new Date(json.Period);
        console.log('Parsed Period:', cp.Period);
      } catch (e) {
        console.warn('Invalid Period format:', json.Period);
        cp.Period = null;
      }
    } else if (json.period) {
      try {
        cp.Period = new Date(json.period);
        console.log('Parsed period:', cp.Period);
      } catch (e) {
        console.warn('Invalid period format:', json.period);
        cp.Period = null;
      }
    } else {
      cp.Period = null;
    }
    
    // Handle array fields
    cp.contracts = json.contracts || [];
    
    return cp;
  }
}
