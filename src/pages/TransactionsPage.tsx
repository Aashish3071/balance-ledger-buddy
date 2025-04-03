
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TransactionsTable from '../components/TransactionsTable';
import { Button } from "@/components/ui/button";
import Layout from '../components/Layout';
import { getStoredWalletId, getWallet, resetWallet } from '../api/walletApi';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from "@/components/ui/use-toast";
import { Wallet } from '../types/wallet';

const TransactionsPage = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = async () => {
    setLoading(true);
    try {
      const walletId = getStoredWalletId();
      
      if (walletId) {
        const walletData = await getWallet(walletId);
        setWallet(walletData);
      } else {
        setWallet(null);
      }
    } catch (error) {
      console.error('Error loading wallet:', error);
      setWallet(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      await resetWallet();
      toast({
        title: "Wallet Reset",
        description: "Your wallet has been reset successfully.",
      });
      loadWallet();
    } catch (error) {
      console.error('Error resetting wallet:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reset wallet. Please try again.",
      });
    }
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

  if (!wallet) {
    return (
      <Layout>
        <div className="text-center py-10">
          <h1 className="text-2xl font-bold mb-4">No Wallet Found</h1>
          <p className="text-muted-foreground mb-6">You need to set up a wallet first</p>
          <Link to="/">
            <Button>Create Wallet</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">Reset Wallet</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will delete your wallet and all transactions. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset}>Reset Wallet</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <TransactionsTable />
    </Layout>
  );
};

export default TransactionsPage;
