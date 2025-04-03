
import apiClient from './apiClient';
import { Transaction, PaginationParams, Wallet } from '../types/wallet';
import { getStoredWalletId, updateWalletBalance, getWallet } from './walletApi';

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export const addTransaction = async (
  type: 'CREDIT' | 'DEBIT',
  amount: number
): Promise<{ transaction: Transaction; wallet: Wallet } | null> => {
  const walletId = getStoredWalletId();
  if (!walletId) return null;
  
  try {
    // Get current wallet
    const wallet = await getWallet(walletId);
    if (!wallet) return null;
    
    // Calculate new balance
    const newBalance = type === 'CREDIT' 
      ? wallet.balance + amount 
      : wallet.balance - amount;
    
    // Create transaction
    const transaction: Omit<Transaction, 'id'> = {
      walletId,
      date: new Date().toISOString(),
      type,
      amount,
    };
    
    const transactionResponse = await apiClient.post('/transactions', transaction);
    
    // Update wallet balance
    const updatedWallet = await updateWalletBalance(walletId, newBalance);
    
    return {
      transaction: transactionResponse.data,
      wallet: updatedWallet
    };
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

export const getTransactions = async (
  params?: PaginationParams
): Promise<{ transactions: Transaction[], total: number }> => {
  const walletId = getStoredWalletId();
  if (!walletId) return { transactions: [], total: 0 };
  
  try {
    // First get the total count without pagination
    const countResponse = await apiClient.get(`/transactions?walletId=${walletId}`);
    const total = countResponse.data.length;
    
    // Construct the URL with the query parameters
    let url = `/transactions?walletId=${walletId}`;
    if (params) {
      if (params._page) url += `&_page=${params._page}`;
      if (params._limit) url += `&_limit=${params._limit}`;
      if (params._sort) url += `&_sort=${params._sort}`;
      if (params._order) url += `&_order=${params._order}`;
    }
    
    const response = await apiClient.get(url);
    return { 
      transactions: response.data,
      total 
    };
  } catch (error) {
    console.error('Error getting transactions:', error);
    throw error;
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const exportToCSV = async (): Promise<void> => {
  try {
    // Get all transactions without pagination
    const { transactions } = await getTransactions();
    
    // Create CSV header
    let csv = 'Date,Type,Amount\n';
    
    // Add transaction rows
    transactions.forEach(transaction => {
      const date = formatDate(transaction.date);
      const type = transaction.type;
      const amount = transaction.amount.toString();
      
      csv += `${date},${type},${amount}\n`;
    });
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `wallet-transactions-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error exporting transactions:', error);
    throw error;
  }
};
