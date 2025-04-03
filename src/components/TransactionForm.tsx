
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { addTransaction } from '../utils/walletUtils';
import { useToast } from "@/components/ui/use-toast";

interface TransactionFormProps {
  onTransactionAdded: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onTransactionAdded }) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'CREDIT' | 'DEBIT'>('CREDIT');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate amount
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    try {
      const updatedWallet = addTransaction(type, amountValue);
      
      if (updatedWallet) {
        toast({
          title: "Transaction added",
          description: `${type === 'CREDIT' ? 'Deposited' : 'Withdrew'} $${amountValue.toFixed(2)}`,
          variant: type === 'CREDIT' ? 'default' : 'destructive',
        });
        
        // Reset form
        setAmount('');
        onTransactionAdded();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Wallet not found. Please create a wallet first.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add transaction. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="transactionType" className="text-sm">
              {type === 'CREDIT' ? 'Deposit (Credit)' : 'Withdraw (Debit)'}
            </Label>
            <div className="flex items-center space-x-2">
              <span className={`text-xs ${type === 'DEBIT' ? 'text-muted-foreground' : 'font-medium text-credit'}`}>Credit</span>
              <Switch
                id="transactionType"
                checked={type === 'DEBIT'}
                onCheckedChange={(checked) => setType(checked ? 'DEBIT' : 'CREDIT')}
              />
              <span className={`text-xs ${type === 'CREDIT' ? 'text-muted-foreground' : 'font-medium text-debit'}`}>Debit</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">$</span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`pl-7 ${error ? "border-red-500" : ""}`}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
            variant={type === 'CREDIT' ? 'default' : 'destructive'}
          >
            {isSubmitting ? "Processing..." : `${type === 'CREDIT' ? 'Deposit' : 'Withdraw'}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
