import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { DateRangePicker } from './DateRangePicker';
import type { Transaction, Category, DateRange } from '../../types';

type Props = {
  transactions: Transaction[];
  categories: Category[];
};

export function TransactionReport({ transactions, categories }: Props) {
  const [dateRange, setDateRange] = React.useState<DateRange>({
    startDate: format(new Date().setDate(1), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });

  // Filtrar transações por data e remover investimentos
  const filteredTransactions = transactions
    .filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transaction.type !== 'investment' && // Remover investimentos
             transactionDate >= new Date(dateRange.startDate) && 
             transactionDate <= new Date(dateRange.endDate);
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const exportToXLSX = () => {
    // Create the data for transactions
    const transactionData = filteredTransactions.map(transaction => {
      const category = categories.find(c => c.id === transaction.categoryId);
      return {
        'Data': format(new Date(transaction.date), 'dd/MM/yyyy'),
        'Título': transaction.title,
        'Categoria': category?.name || '',
        'Tipo': transaction.type === 'income' ? 'Receita' : 'Despesa',
        'Valor': transaction.amount.toFixed(2),
      };
    });

    // Create a new workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(transactionData, { origin: 'A2' });

    // Add headers with custom styling
    const headers = ['Data', 'Título', 'Categoria', 'Tipo', 'Valor'];
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 'A1' });

    // Add totals section
    const totalsData = [
      ['', '', '', 'Total Receitas', totalIncome.toFixed(2)],
      ['', '', '', 'Total Despesas', totalExpenses.toFixed(2)],
      ['', '', '', 'Saldo Final', balance.toFixed(2)]
    ];
    const totalsRow = transactionData.length + 3;
    XLSX.utils.sheet_add_aoa(ws, totalsData, { origin: `A${totalsRow}` });

    // Set column widths
    ws['!cols'] = [
      { wch: 12 },  // Data
      { wch: 40 },  // Título
      { wch: 20 },  // Categoria
      { wch: 15 },  // Tipo
      { wch: 15 }   // Valor
    ];

    // Add cell styles
    const headerStyle = {
      fill: { fgColor: { rgb: "4F46E5" } }, // indigo-600
      font: { color: { rgb: "FFFFFF" }, bold: true },
      alignment: { horizontal: "center" }
    };

    const totalStyle = {
      font: { bold: true },
      fill: { fgColor: { rgb: "F3F4F6" } } // gray-100
    };

    const balanceStyle = {
      font: { bold: true },
      fill: { fgColor: { rgb: balance >= 0 ? "DCFCE7" : "FEE2E2" } } // green-100 or red-100
    };

    // Apply header styles
    for (let i = 0; i < headers.length; i++) {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
      if (!ws[cellRef]) ws[cellRef] = {};
      ws[cellRef].s = headerStyle;
    }

    // Apply total rows styles
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 5; j++) {
        const cellRef = XLSX.utils.encode_cell({ r: totalsRow + i - 1, c: j });
        if (!ws[cellRef]) ws[cellRef] = {};
        ws[cellRef].s = i === 2 ? balanceStyle : totalStyle;
      }
    }

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Transações');

    // Generate the file name with the date range
    const fileName = `transacoes_${format(new Date(dateRange.startDate), 'dd-MM-yyyy')}_a_${format(new Date(dateRange.endDate), 'dd-MM-yyyy')}.xlsx`;

    // Write the file
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
        
        <button
          onClick={exportToXLSX}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          Exportar XLSX
        </button>
      </div>

      <div className="bg-white dark:bg-dark-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
              {filteredTransactions.map(transaction => {
                const category = categories.find(c => c.id === transaction.categoryId);
                return (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {format(new Date(transaction.date), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {transaction.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: category?.color + '20', color: category?.color }}
                      >
                        {category?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.type === 'income'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                      transaction.type === 'income' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      R$ {transaction.amount.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <td colSpan={3} className="px-6 py-4"></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  Total Receitas
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right text-green-600 dark:text-green-400">
                  R$ {totalIncome.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td colSpan={3} className="px-6 py-4"></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  Total Despesas
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right text-red-600 dark:text-red-400">
                  R$ {totalExpenses.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td colSpan={3} className="px-6 py-4"></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  Saldo
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                  balance >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  R$ {balance.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      
      {filteredTransactions.length === 0 && (
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhuma transação encontrada para o período selecionado.
          </p>
        </div>
      )}
    </div>
  );
}