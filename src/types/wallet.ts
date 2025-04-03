
export interface Transaction {
  id: string;
  date: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
}

export interface Wallet {
  id: string;
  username: string;
  balance: number;
  transactions: Transaction[];
}
