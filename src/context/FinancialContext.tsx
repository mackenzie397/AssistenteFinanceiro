// src/context/FinancialContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { 
  collection,
  addDoc,
  getDocs,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Transaction, Goal, Category } from '../types';

type FinancialContextType = {
  transactions: Transaction[];
  goals: Goal[];
  categories: Category[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id'>) => Promise<void>;
};

const FinancialContext = createContext<FinancialContextType>({
  transactions: [],
  goals: [],
  categories: [],
  addTransaction: async () => {},
  addGoal: async () => {},
});

export const FinancialProvider = ({ children }: { children: React.ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Carregar dados em tempo real
  useEffect(() => {
    const transactionsUnsub = onSnapshot(collection(db, 'transactions'), (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }) as Transaction));
    });

    const goalsUnsub = onSnapshot(collection(db, 'goals'), (snapshot) => {
      setGoals(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }) as Goal));
    });

    return () => {
      transactionsUnsub();
      goalsUnsub();
    };
  }, []);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    await addDoc(collection(db, 'transactions'), transaction);
  };

  const addGoal = async (goal: Omit<Goal, 'id'>) => {
    await addDoc(collection(db, 'goals'), goal);
  };

  return (
    <FinancialContext.Provider 
      value={{ 
        transactions,
        goals,
        categories,
        addTransaction,
        addGoal
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => useContext(FinancialContext);