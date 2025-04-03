
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { createWallet } from '../api/walletApi';
import { useToast } from "@/components/ui/use-toast";

interface WalletSetupProps {
  onWalletCreated: () => void;
}

const WalletSetup: React.FC<WalletSetupProps> = ({ onWalletCreated }) => {
  const [username, setUsername] = useState('');
  const [initialBalance, setInitialBalance] = useState('0');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({ username: '', initialBalance: '' });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = { username: '', initialBalance: '' };
    let isValid = true;
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }
    
    const balanceValue = parseFloat(initialBalance);
    if (isNaN(balanceValue) || balanceValue < 0) {
      newErrors.initialBalance = 'Please enter a valid amount';
      isValid = false;
    }
    
    setErrors(newErrors);
    
    if (!isValid) return;
    
    // Create new wallet
    setIsSubmitting(true);
    try {
      await createWallet(username.trim(), balanceValue);
      toast({
        title: "Wallet created!",
        description: `Welcome ${username}! Your wallet has been set up successfully.`,
      });
      onWalletCreated();
    } catch (error) {
      console.error('Error creating wallet:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create wallet. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Welcome to Wallet Tracker</CardTitle>
        <CardDescription>
          Let's set up your wallet to start tracking your transactions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={errors.username ? "border-red-500" : ""}
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="initialBalance">Initial Balance (Optional)</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">$</span>
              <Input
                id="initialBalance"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                className={`pl-7 ${errors.initialBalance ? "border-red-500" : ""}`}
              />
            </div>
            {errors.initialBalance && (
              <p className="text-red-500 text-sm">{errors.initialBalance}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Wallet"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WalletSetup;
