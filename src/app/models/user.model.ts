export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  enabled: boolean;
  roles?: string[];
  // Add any other properties that might be needed
}