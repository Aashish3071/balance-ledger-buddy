
# Wallet Tracker App with JSON Server

This application allows users to create a wallet, add transactions, and view their transaction history. It uses JSON Server as a mock backend.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the JSON Server (in one terminal):
   ```
   npx json-server --watch db.json --port 5000
   ```

3. Start the React app (in another terminal):
   ```
   npm run dev
   ```

## Features

- Create a wallet with initial balance
- Add credit and debit transactions
- View paginated transaction history
- Sort transactions by date or amount
- Export transactions to CSV

## API Endpoints

- `GET /wallets/:id` - Get wallet by ID
- `POST /wallets` - Create a new wallet
- `PATCH /wallets/:id` - Update wallet balance
- `GET /transactions?walletId=:id` - Get all transactions for a wallet
- `POST /transactions` - Create a new transaction
