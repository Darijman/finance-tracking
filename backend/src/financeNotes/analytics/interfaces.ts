export interface GetCategoriesExpensesByUserId {
  category: { id: number; name: string; image: string };
  totalExpense: number;
}
