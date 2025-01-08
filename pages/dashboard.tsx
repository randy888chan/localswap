import { GetServerSideProps, NextPage } from 'next';
import { getUserTransactions } from '../lib/db';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  currencyFrom: string;
  currencyTo: string;
  status: string;
  timestamp: string;
}

interface Props {
  transactions: Transaction[];
}

const Dashboard: NextPage<Props> = ({ transactions }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">User Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Currency From</th>
            <th>Currency To</th>
            <th>Status</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.type}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.currencyFrom}</td>
              <td>{transaction.currencyTo}</td>
              <td>{transaction.status}</td>
              <td>{transaction.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const transactions = await getUserTransactions('user_id'); // Replace 'user_id' with the actual user ID
  return {
    props: {
      transactions,
    },
  };
};

export default Dashboard;
