import axios from "axios";
import { Cocktail } from "../types";

export async function fetchCocktails(
  category: string,
  glass: string,
  alcoholic: string,
  page: number,
  perPage: number
): Promise<{ data: Cocktail[] }> {
  let url = `https://cocktails.solvro.pl/api/v1/cocktails?page=${page}&perPage=${perPage}`;
  const params: Record<string, any> = {};
  if (category !== "All") params.category = category;
  if (glass !== "All") params.glass = glass;
  if (alcoholic !== "All") params.alcoholic = alcoholic === "Alcoholic";
  const query = new URLSearchParams(params).toString();
  if (query) url += `&${query}`;
  const res = await axios.get(url);
  return res.data;
}

export async function fetchCocktailDetail(id: number): Promise<Cocktail> {
  const res = await axios.get(
    `https://cocktails.solvro.pl/api/v1/cocktails?id=${id}&ingredients=true`
  );
  return res.data.data[0];
}

export async function fetchTotalCocktails(): Promise<number> {
  const res = await axios.get("https://cocktails.solvro.pl/api/v1/cocktails");
  return res.data.total || 0;
}
