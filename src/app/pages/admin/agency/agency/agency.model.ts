/**
 * Represents an agency location with contact information
 */
export interface Agency {
  /** Unique identifier for the agency */
  id_agency: number;
  
  /** Governorate where the agency is located */
  governorate: Governorate;
  
  /** Full street address of the agency */
  address: string;
  
  /** City where the agency is located */
  city: string;
  
  /** Contact phone number in international format */
  phoneNumber: string;
  
  /** Contact email address */
  email: string;
  
  /** Geographic latitude (optional) */
  latitude?: number;
  
  /** Geographic longitude (optional) */
  longitude?: number;
  
  /** Timestamp when the agency was created */
  createdAt?: Date;
  
  /** Timestamp when the agency was last updated */
  updatedAt?: Date;
}

/**
 * Available governorates in Tunisia
 */
export enum Governorate {
  TUNIS = 'TUNIS',
  ARIANA = 'ARIANA',
  BEN_AROUS = 'BEN_AROUS',
  MANOUBA = 'MANOUBA',
  NABEUL = 'NABEUL',
  SOUSSE = 'SOUSSE',
  MONASTIR = 'MONASTIR',
  MAHDIA = 'MAHDIA',
  SFAX = 'SFAX',
  KAIROUAN = 'KAIROUAN',
  KASSERINE = 'KASSERINE',
  SIDI_BOUZID = 'SIDI_BOUZID',
  KEF = 'KEF',
  JENDOUBA = 'JENDOUBA',
  BEJA = 'BEJA',
  BIZERTE = 'BIZERTE',
  ZAGHOUAN = 'ZAGHOUAN',
  SILIANA = 'SILIANA',
  GABES = 'GABES',
  MEDENINE = 'MEDENINE',
  TATAOUINE = 'TATAOUINE',
  GAFSA = 'GAFSA',
  TOZEUR = 'TOZEUR',
  KEBILI = 'KEBILI'
}

/**
 * Type for creating a new agency (without ID)
 */
export type CreateAgency = Omit<Agency, 'id_agency' | 'createdAt' | 'updatedAt'>;

/**
 * Type for updating an existing agency
 */
export type UpdateAgency = Partial<Omit<Agency, 'id_agency' | 'createdAt' | 'updatedAt'>> & {
  id_agency: number;
};

/**
 * Type for agency filters
 */
export interface AgencyFilters {
  governorate?: Governorate;
  city?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
}

/**
 * Type for paginated agency response
 */
export interface PaginatedAgencyResponse {
  content: Agency[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

/**
 * Type for agency form values
 */
export interface AgencyFormValues {
  governorate: Governorate | null;
  address: string;
  city: string;
  phoneNumber: string;
  email: string;
  latitude?: number | null;
  longitude?: number | null;
}
