
import { Wallet, Transaction } from '../types/wallet';

// Generate a unique ID for wallets and transactions
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Save wallet to localStorage
export const saveWallet = (wallet: Wallet): void => {
  localStorage.setItem('wallet', JSON.stringify(wallet));
};

// Get wallet from localStorage
export const getWallet = (): Wallet | null => {
  const walletData = localStorage.getItem('wallet');
  return walletData ? JSON.parse(walletData) : null;
};

// Create a new wallet
export const createWallet = (username: string, initialBalance: number = 0): Wallet => {
  const walletId = generateId();
  const newWallet: Wallet = {
    id: walletId,
    username,
    balance: initialBalance
  };

  // If initial balance is greater than 0, add an initial transaction
  // Note: We're not storing transactions in the wallet object anymore
  // They will be stored separately via the API
  if (initialBalance > 0) {
    // Create a transaction object (not stored in the wallet)
    const initialTransaction: Transaction = {
      id: generateId(),
      walletId: walletId,
      date: new Date().toISOString(),
      type: 'CREDIT',
      amount: initialBalance
    };
    
    // In a real implementation, we would call the API to save this transaction
    // But that's now handled by the transactionApi.ts
  }

  saveWallet(newWallet);
  return newWallet;
};

// Add a transaction to the wallet
export const addTransaction = (
  type: 'CREDIT' | 'DEBIT',
  amount: number
): Wallet | null => {
  const wallet = getWallet();
  if (!wallet) return null;

  const transaction: Transaction = {
    id: generateId(),
    walletId: wallet.id,
    date: new Date().toISOString(),
    type,
    amount
  };

  // Update wallet balance
  if (type === 'CREDIT') {
    wallet.balance += amount;
  } else {
    wallet.balance -= amount;
  }

  // Note: We're not storing transactions in the wallet object anymore
  // They will be stored separately via the API
  saveWallet(wallet);
  return wallet;
};

// Format currency for display
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Format date for display
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

// Export transactions to CSV
export const exportToCSV = (transactions: Transaction[]): void => {
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
};

// Reset wallet (for testing or if user wants to start over)
export const resetWallet = (): void => {
  localStorage.removeItem('wallet');
};
