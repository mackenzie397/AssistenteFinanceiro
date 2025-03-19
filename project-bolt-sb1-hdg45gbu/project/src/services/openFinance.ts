import axios from 'axios';

const API_BASE_URL = 'https://api.openfinance.brasil.com.br'; // URL exemplo

export interface Bank {
  id: string;
  name: string;
  code: string;
}

export interface Account {
  id: string;
  accountType: string;
  accountNumber: string;
  balance: number;
  currency: string;
}

export interface Transaction {
  id: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  description: string;
  date: string;
  category?: string;
}

class OpenFinanceService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  async getParticipatingBanks(): Promise<Bank[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/participants`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar bancos participantes:', error);
      throw error;
    }
  }

  async connectBank(bankId: string): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/connect`, { bankId });
    } catch (error) {
      console.error('Erro ao conectar banco:', error);
      throw error;
    }
  }

  async getAccounts(): Promise<Account[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/accounts`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar contas:', error);
      throw error;
    }
  }

  async getTransactions(accountId: string, startDate: string, endDate: string): Promise<Transaction[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/accounts/${accountId}/transactions`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      throw error;
    }
  }
}

export const openFinanceService = new OpenFinanceService();