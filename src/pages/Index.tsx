
import React, { useState, useEffect } from 'react';
import WalletSetup from '../components/WalletSetup';
import WalletDetails from '../components/WalletDetails';
import TransactionForm from '../components/TransactionForm';
import Layout from '../components/Layout';
import { getWallet } from '../utils/walletUtils';
import { Wallet } from '../types/wallet';

const Index = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = () => {
    setLoading(true);
    const savedWallet = getWallet();
    setWallet(savedWallet);
    setLoading(false);
  };

  const handleWalletCreated = () => {
    loadWallet();
  };

  const handleTransactionAdded = () => {
    loadWallet();
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Wallet Dashboard</h1>
      
      {wallet ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <WalletDetails wallet={wallet} />
          </div>
          <div>
            <TransactionForm onTransactionAdded={handleTransactionAdded} />
          </div>
        </div>
      ) : (
        <WalletSetup onWalletCreated={handleWalletCreated} />
      )}
    </Layout>
  );
};

export default Index;
