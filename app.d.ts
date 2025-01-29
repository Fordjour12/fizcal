export type Account = {
  id: string;
  name: string;
  type: string;
  balance: number;
  accountNumber?: string;
  currency?: string; // Add this field
};

export type FormData = {
  name: string;
  type: string;
  balance: string;
  accountNumber: string;
};
