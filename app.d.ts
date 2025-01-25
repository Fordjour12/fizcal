export type Account = {
  id: string;
  name: string;
  type: string;
  balance: number;
  accountNumber?: string;
};

export type FormData = {
  name: string;
  type: string;
  balance: string;
  accountNumber: string;
};
