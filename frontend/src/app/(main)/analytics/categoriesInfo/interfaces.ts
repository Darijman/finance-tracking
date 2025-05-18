export interface CustomTickProps {
  x: number;
  y: number;
  payload: { value: string };
}

export interface CategoryInfo {
  category: { id: number; name: string; image: string };
  totalExpense: number;
}
