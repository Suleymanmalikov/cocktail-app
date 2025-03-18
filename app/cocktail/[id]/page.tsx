"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Ingredient {
  name: string;
  measure: string;
}

interface Cocktail {
  id: number;
  name: string;
  imageUrl: string;
  instructions?: string;
  category: string;
  glass: string;
  alcoholic: boolean;
  ingredients: Ingredient[];
}

async function fetchCocktailDetail(id: number): Promise<Cocktail> {
  const res = await axios.get(
    `https://cocktails.solvro.pl/api/v1/cocktails?id=${id}&ingredients=true`
  );
  return res.data.data[0];
}

export default function CocktailDetail() {
  const params = useParams();
  const cocktailId = Number(params.id);

  const { data, error, isLoading } = useQuery({
    queryKey: ["cocktailDetail", cocktailId],
    queryFn: () => fetchCocktailDetail(cocktailId),
  });

  if (isLoading) return <div>Loading cocktail details...</div>;
  if (error) return <div>Error loading cocktail details.</div>;

  const cocktail: Cocktail | undefined = data;
  console.log(cocktail);
  if (!cocktail) return <div>No cocktail details available.</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{cocktail.name}</h1>
      <img
        src={cocktail.imageUrl}
        alt={cocktail.name}
        className="w-full h-auto mb-4 rounded"
      />
      <p className="mb-4">{cocktail.instructions}</p>

      <h2 className="text-2xl font-semibold mb-2">Ingredients</h2>
      {cocktail.ingredients && cocktail.ingredients.length > 0 ? (
        <ul className="list-disc pl-6">
          {cocktail.ingredients.map((ingredient, index) => (
            <li key={index}>
              {ingredient.name}{" "}
              {ingredient.measure && `- ${ingredient.measure}`}
            </li>
          ))}
        </ul>
      ) : (
        <p>No ingredients information available.</p>
      )}
    </div>
  );
}
