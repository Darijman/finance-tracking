import api from '../../../../axiosInstance';
import { FinanceNote } from '@/interfaces/financeNote';
import { FinanceCategory } from '@/interfaces/financeCategory';

export const getUserNotes = async (userId: number) => {
  const response = await api.get<FinanceNote[]>(`/finance_notes/user/${userId}`);
  return response.data;
};

export const getFinanceCategories = async (userId: number) => {
  const basicFinanceCategories = await api.get<FinanceCategory[]>(`/finance_categories/`);
  const userFinanceCategories = await api.get<FinanceCategory[]>(`/finance_categories/user/${userId}`);
  const combinedCategories = basicFinanceCategories.data.concat(userFinanceCategories.data);
  return combinedCategories;
};
