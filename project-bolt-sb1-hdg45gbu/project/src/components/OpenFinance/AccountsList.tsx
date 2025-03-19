import React, { useState, useEffect } from 'react';
import { openFinanceService, Account } from '../../services/openFinance';
import { Wallet, RefreshCw, AlertCircle } from 'lucide-react';

export function AccountsList() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const userAccounts = await openFinanceService.getAccounts();
      setAccounts(userAccounts);
    } catch (err) {
      setError('Erro ao carregar contas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Wallet className="h-5 w-5 text-indigo-600" />
          Contas Conectadas
        </h2>
        <button
          onClick={loadAccounts}
          className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
          title="Atualizar contas"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {accounts.map(account => (
          <div key={account.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-gray-900">
                  {account.accountType}
                </h3>
                <p className="text-sm text-gray-500">
                  Conta: {account.accountNumber}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">
                  R$ {account.balance.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">{account.currency}</p>
              </div>
            </div>
          </div>
        ))}

        {accounts.length === 0 && !error && (
          <p className="text-center text-gray-500 py-8">
            Nenhuma conta conectada
          </p>
        )}
      </div>
    </div>
  );
}