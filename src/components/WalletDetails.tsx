
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ClipboardList, UserCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '../api/transactionApi';
import { Wallet, Transaction } from '../types/wallet';

interface WalletDetailsProps {
  wallet: Wallet;
  transactions: Transaction[];
}

const WalletDetails: React.FC<WalletDetailsProps> = ({ wallet, transactions }) => {
  const lastFiveTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              {formatCurrency(wallet.balance)}
            </CardTitle>
            <p className="text-sm text-muted-foreground">Current Balance</p>
          </div>
          <div className="flex items-center text-muted-foreground space-x-1">
            <UserCircle className="h-4 w-4" />
            <span className="text-sm">{wallet.username}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {lastFiveTransactions.length > 0 ? (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Recent Transactions</h3>
            <ul className="space-y-2">
              {lastFiveTransactions.map(transaction => (
                <li 
                  key={transaction.id}
                  className="flex items-center justify-between text-sm p-2 rounded-md border border-gray-100"
                >
                  <div className="flex items-center">
                    <span 
                      className={`inline-flex items-center justify-center h-6 w-6 rounded-full mr-2
                        ${transaction.type === 'CREDIT' ? 'bg-green-100 text-credit' : 'bg-red-100 text-debit'}
                      `}
                    >
                      {transaction.type === 'CREDIT' ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : (
                        <ArrowDown className="h-3 w-3" />
                      )}
                    </span>
                    <span>
                      {transaction.type === 'CREDIT' ? 'Deposit' : 'Withdrawal'}
                    </span>
                  </div>
                  <span 
                    className={transaction.type === 'CREDIT' ? 'text-credit font-medium' : 'text-debit font-medium'}
                  >
                    {transaction.type === 'CREDIT' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-muted-foreground text-sm">No transactions yet</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Link to="/transactions">
          <Button variant="outline" size="sm" className="flex gap-1">
            <ClipboardList className="h-4 w-4" />
            <span>View All Transactions</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default WalletDetails;
