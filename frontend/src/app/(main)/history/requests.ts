import api from '../../../../axiosInstance';
import { FinanceNote } from '@/interfaces/financeNote';
import { FinanceCategory } from '@/interfaces/financeCategory';

export const getUserNotes = async (userId: number, limit?: number) => {
  const response = await api.get<FinanceNote[]>(`/finance_notes/user/${userId}`, { params: { limit } });
  return response.data;
};

export const getFinanceCategories = async () => {
  const response = await api.get<FinanceCategory[]>(`/finance_categories/combined`);
  return response.data;
};
