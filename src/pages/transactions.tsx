import { useState } from 'react';
import { QueueService } from '../services/queue.service';
import { WalletService } from '../services/wallet.service';

export default function Transactions() {
  const [txHash, setTxHash] = useState<string>('');

  const handleSubmit = async (formData: FormData) => {
    try {
      // Extract form data
      const sender = formData.get('from') as string;
      const recipient = formData.get('to') as string;
      const amount = Number(formData.get('amount'));

      // Transaction payload
      const txPayload = {
        sender_address: sender,
        receiver_address: recipient,
        amount,
      };

      // Initialize services
      const queueService = new QueueService();
      const walletService = WalletService.getInstance();
      const wallet = walletService.getWallet('bitcoin');

      // Execute transaction
      const result = await queueService.execute(txPayload);

      if (result) {
        setTxHash(wallet.getTxHash() || '');
      }
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Process Transaction</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">From address:</label>
          <input 
            type="text" 
            name="from" 
            placeholder="Sender address" 
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">To address:</label>
          <input 
            type="text" 
            name="to" 
            placeholder="Recipient address" 
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Amount:</label>
          <input 
            type="number" 
            name="amount" 
            placeholder="Amount" 
            step="0.0001"
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Process Transaction
        </button>
      </form>
      {txHash && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-sm font-medium">Transaction Hash:</p>
          <p className="text-gray-700 break-all">{txHash}</p>
        </div>
      )}
    </div>
  );
}
