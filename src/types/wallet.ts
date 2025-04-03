
export interface Transaction {
  id: string;
  walletId: string;
  date: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
}

export interface Wallet {
  id: string;
  username: string;
  balance: number;
}

export interface APIResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginationParams {
  _page?: number;
  _limit?: number;
  _sort?: string;
  _order?: 'asc' | 'desc';
}
