import api from '../../../../axiosInstance';
import { FinanceNote } from '@/interfaces/financeNote';
import { FinanceCategory } from '@/interfaces/financeCategory';

export interface GetUserNotesQuery {
  offset?: number;
  limit?: number;
  sortByDate: 'ASC' | 'DESC' | null;
  sortByPrice: 'ASC' | 'DESC' | null;
  type: 'INCOME' | 'EXPENSE' | null;
  categoryId: number | null;
}

export const getUserNotes = async (userId: number, query: GetUserNotesQuery) => {
  const cleanQuery = Object.fromEntries(Object.entries(query).filter(([_, v]) => v));
  const response = await api.get<FinanceNote[]>(`/finance_notes/user/${userId}`, {
    params: cleanQuery,
  });
  return response.data;
};

export const getFinanceCategories = async (userId: number) => {
  const response = await api.get<FinanceCategory[]>(`/finance_categories/combined/${userId}`);
  return response.data;
};
