import { CreditPool } from './CreditPool';
import { Payment } from './Payment';
import { User } from 'src/app/pages/admin/user/user.model';

export class Contract {
  // Primary key field - matches the Spring Boot entity
  id_Contract: number = 0;
  
  // Basic contract properties - matching Spring Boot entity field names
  date_Contract: Date | null = new Date(); // LocalDateTime in Spring Boot
  documents: string = '';
  withdrawal_date: Date | null = new Date(); // LocalDateTime in Spring Boot
  queue_Number: number = 0; // public int in Spring Boot
  amount: number = 0; // Double in Spring Boot
  payed: number = 0; // Double in Spring Boot
  
  // Foreign key fields for frontend convenience
  id_credit_pool: number = 0; // Derived from creditPool.id_credit_pool
  userId: number = 0; // Derived from user.id
  
  // Collection fields
  payments: Payment[] = []; // Set<Payment> in Spring Boot (JsonIgnore)
  
  // Nested objects to match backend structure with JPA relationships
  user: { id: number; firstName?: string; lastName?: string } = { id: 0 }; // ManyToOne relationship
  creditPool: { id_credit_pool: number; pool_sum?: number } = { id_credit_pool: 0 }; // ManyToOne relationship
  
  // Additional fields that might be present in the backend response
  id?: number; // For compatibility with generic REST conventions
  
  /**
   * Generates a PDF file name based on contract details
   * @returns A string with the generated file name
   */
  generatePdfFileName(): string {
    const contractId = this.id_Contract || 'new';
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    return `contract_${contractId}_${dateStr}.pdf`;
  }

  static fromJson(json: any): Contract {
    const contract = new Contract();

    // Log the raw data for debugging
    console.log('Raw contract data:', JSON.stringify(json, null, 2));

    // Handle ID fields - check all possible ID field names
    // First priority: id_Contract (our primary field name)
    if (json.id_Contract !== undefined && json.id_Contract !== null) {
      contract.id_Contract = Number(json.id_Contract);
      // Also set the id field for compatibility
      contract.id = Number(json.id_Contract);
    }
    // Second priority: id (common field name in REST APIs)
    else if (json.id !== undefined && json.id !== null) {
      contract.id_Contract = Number(json.id);
      contract.id = Number(json.id);
    }
    // Third priority: ID or Id (other common variations)
    else if (json.ID !== undefined && json.ID !== null) {
      contract.id_Contract = Number(json.ID);
      contract.id = Number(json.ID);
    }
    else if (json.Id !== undefined && json.Id !== null) {
      contract.id_Contract = Number(json.Id);
      contract.id = Number(json.Id);
    }
    
    // Log the ID assignment
    console.log(`Contract ID assignment: id_Contract=${contract.id_Contract}, id=${contract.id}`);
    
    // Check for different variations of queue number field name
    if (json.queue_Number !== undefined && json.queue_Number !== null) {
      contract.queue_Number = Number(json.queue_Number);
    } else if (json.queueNumber !== undefined && json.queueNumber !== null) {
      contract.queue_Number = Number(json.queueNumber);
    } else if (json.queue_number !== undefined && json.queue_number !== null) {
      contract.queue_Number = Number(json.queue_number);
    } else if (json.queuenumber !== undefined && json.queuenumber !== null) {
      contract.queue_Number = Number(json.queuenumber);
    } else if (json.QUEUE_NUMBER !== undefined && json.QUEUE_NUMBER !== null) {
      contract.queue_Number = Number(json.QUEUE_NUMBER);
    }
  
    // Log the queue number assignment
    console.log(`Queue number assignment: ${contract.queue_Number}`);
    // Handle numeric fields with proper type conversion
    contract.amount = typeof json.amount === 'string' ? parseFloat(json.amount) : (json.amount || 0);
    contract.payed = typeof json.payed === 'string' ? parseFloat(json.payed) : (json.payed || 0);
    
    // Log numeric field values for debugging
    console.log('Parsed numeric values:', {
      id_Contract: contract.id_Contract,
      queue_Number: contract.queue_Number,
      amount: contract.amount,
      payed: contract.payed
    });
    
    // Preserve the original nested objects for backend compatibility
    if (json.user) {
      contract.user = json.user;
      // Also set the flat userId for frontend compatibility
      if (json.user.id !== undefined && json.user.id !== null) {
        contract.userId = Number(json.user.id);
      }
      // Copy name fields if available
      if (json.user.firstName) contract.user.firstName = json.user.firstName;
      if (json.user.lastName) contract.user.lastName = json.user.lastName;
    } else if (json.userId !== undefined && json.userId !== null) {
      contract.userId = Number(json.userId);
      // Create a user object for backend compatibility
      contract.user = { id: Number(json.userId) };
    }
    
    console.log(`User assignment: userId=${contract.userId}, user=${JSON.stringify(contract.user)}`);
    
    // Handle credit pool - preserve the nested object
    if (json.creditPool) {
      contract.creditPool = json.creditPool;
      // Also set the flat id_credit_pool for frontend compatibility
      if (json.creditPool.id_credit_pool !== undefined && json.creditPool.id_credit_pool !== null) {
        contract.id_credit_pool = Number(json.creditPool.id_credit_pool);
      } else if (json.creditPool.id !== undefined && json.creditPool.id !== null) {
        contract.id_credit_pool = Number(json.creditPool.id);
        // Ensure the creditPool object has the id_credit_pool property
        contract.creditPool.id_credit_pool = Number(json.creditPool.id);
      }
      // Copy pool_sum if available
      if (json.creditPool.pool_sum !== undefined) {
        contract.creditPool.pool_sum = json.creditPool.pool_sum;
      }
    } else if (json.id_credit_pool !== undefined && json.id_credit_pool !== null) {
      contract.id_credit_pool = Number(json.id_credit_pool);
      // Create a creditPool object for backend compatibility
      contract.creditPool = { id_credit_pool: Number(json.id_credit_pool) };
    } else if (json.creditPoolId !== undefined && json.creditPoolId !== null) {
      contract.id_credit_pool = Number(json.creditPoolId);
      contract.creditPool = { id_credit_pool: Number(json.creditPoolId) };
    }
    
    console.log(`CreditPool assignment: id_credit_pool=${contract.id_credit_pool}, creditPool=${JSON.stringify(contract.creditPool)}`);

    // Handle string fields
    contract.documents = json.documents || '';

    // Handle date fields safely - don't default to today's date if not present
    if (json.date_Contract) {
      try {
        // Check if the date is already a Date object
        if (json.date_Contract instanceof Date) {
          contract.date_Contract = json.date_Contract;
        } else {
          contract.date_Contract = new Date(json.date_Contract);
        }
        console.log('Parsed date_Contract:', contract.date_Contract);
        
        // Validate the date is valid
        if (contract.date_Contract && isNaN(contract.date_Contract.getTime())) {
          console.warn('Invalid date after parsing date_Contract:', json.date_Contract);
          contract.date_Contract = null;
        }
      } catch (e) {
        console.warn('Error parsing date_Contract format:', json.date_Contract, e);
        contract.date_Contract = null;
      }
    } else if (json.dateContract) {
      try {
        // Check if the date is already a Date object
        if (json.dateContract instanceof Date) {
          contract.date_Contract = json.dateContract;
        } else {
          contract.date_Contract = new Date(json.dateContract);
        }
        console.log('Parsed dateContract:', contract.date_Contract);
        
        // Validate the date is valid
        if (contract.date_Contract && isNaN(contract.date_Contract.getTime())) {
          console.warn('Invalid date after parsing dateContract:', json.dateContract);
          contract.date_Contract = null;
        }
      } catch (e) {
        console.warn('Error parsing dateContract format:', json.dateContract, e);
        contract.date_Contract = null;
      }
    } else {
      contract.date_Contract = null;
    }

    if (json.withdrawal_date) {
      try {
        // Check if the date is already a Date object
        if (json.withdrawal_date instanceof Date) {
          contract.withdrawal_date = json.withdrawal_date;
        } else {
          contract.withdrawal_date = new Date(json.withdrawal_date);
        }
        console.log('Parsed withdrawal_date:', contract.withdrawal_date);
        
        // Validate the date is valid
        if (contract.withdrawal_date && isNaN(contract.withdrawal_date.getTime())) {
          console.warn('Invalid date after parsing withdrawal_date:', json.withdrawal_date);
          contract.withdrawal_date = null;
        }
      } catch (e) {
        console.warn('Error parsing withdrawal_date format:', json.withdrawal_date, e);
        contract.withdrawal_date = null;
      }
    } else if (json.withdrawalDate) {
      try {
        // Check if the date is already a Date object
        if (json.withdrawalDate instanceof Date) {
          contract.withdrawal_date = json.withdrawalDate;
        } else {
          contract.withdrawal_date = new Date(json.withdrawalDate);
        }
        console.log('Parsed withdrawalDate:', contract.withdrawal_date);
        
        // Validate the date is valid
        if (contract.withdrawal_date && isNaN(contract.withdrawal_date.getTime())) {
          console.warn('Invalid date after parsing withdrawalDate:', json.withdrawalDate);
          contract.withdrawal_date = null;
        }
      } catch (e) {
        console.warn('Error parsing withdrawalDate format:', json.withdrawalDate, e);
        contract.withdrawal_date = null;
      }
    } else {
      contract.withdrawal_date = null;
    }

    // Handle arrays
    contract.payments = json.payments || [];

    return contract;
  }
}
