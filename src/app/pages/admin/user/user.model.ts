export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  age: number;
  address: string;
  civilStatus: string;
  createdDate: string;
  dateOfBirth: string;
  enabled: boolean;
  accountLocked: boolean;
  accountDeleted: boolean; // Change to match the backend field
  lastModifiedDate: string;
  userScore: number;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page number
}
