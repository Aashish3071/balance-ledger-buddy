
import apiClient from './apiClient';
import { Wallet } from '../types/wallet';

export const getStoredWalletId = (): string | null => {
  return localStorage.getItem('walletId');
};

export const storeWalletId = (walletId: string): void => {
  localStorage.setItem('walletId', walletId);
};

export const createWallet = async (username: string, initialBalance: number = 0): Promise<Wallet> => {
  try {
    const response = await apiClient.post('/wallets', {
      username,
      balance: initialBalance,
    });
    
    if (response.data && response.data.id) {
      storeWalletId(response.data.id);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error creating wallet:', error);
    throw error;
  }
};

export const getWallet = async (walletId: string): Promise<Wallet | null> => {
  try {
    const response = await apiClient.get(`/wallets/${walletId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting wallet:', error);
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const updateWalletBalance = async (walletId: string, newBalance: number): Promise<Wallet> => {
  try {
    const response = await apiClient.patch(`/wallets/${walletId}`, {
      balance: newBalance,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating wallet balance:', error);
    throw error;
  }
};

export const resetWallet = async (): Promise<void> => {
  const walletId = getStoredWalletId();
  if (walletId) {
    try {
      await apiClient.delete(`/wallets/${walletId}`);
      localStorage.removeItem('walletId');
    } catch (error) {
      console.error('Error resetting wallet:', error);
      throw error;
    }
  }
};
