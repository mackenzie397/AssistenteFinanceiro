import React, { useState, useEffect } from 'react';
import { openFinanceService, Bank } from '../../services/openFinance';
import { Building2, Link, AlertCircle } from 'lucide-react';

export function BankConnection() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBanks();
  }, []);

  const loadBanks = async () => {
    try {
      setLoading(true);
      const participatingBanks = await openFinanceService.getParticipatingBanks();
      setBanks(participatingBanks);
    } catch (err) {
      setError('Erro ao carregar bancos participantes');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectBank = async (bankId: string) => {
    try {
      setLoading(true);
      await openFinanceService.connectBank(bankId);
      // Atualizar UI ou estado após conexão bem-sucedida
    } catch (err) {
      setError('Erro ao conectar com o banco');
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
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Building2 className="h-5 w-5 text-indigo-600" />
        Conectar Bancos
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {banks.map(bank => (
          <div key={bank.id} className="border rounded-lg p-4 hover:border-indigo-500 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium text-gray-900">{bank.name}</h3>
                <p className="text-sm text-gray-500">Código: {bank.code}</p>
              </div>
            </div>
            
            <button
              onClick={() => handleConnectBank(bank.id)}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Link className="h-4 w-4" />
              Conectar
            </button>
          </div>
        ))}
      </div>

      {banks.length === 0 && !error && (
        <p className="text-center text-gray-500 py-8">
          Nenhum banco disponível para conexão no momento
        </p>
      )}
    </div>
  );
}