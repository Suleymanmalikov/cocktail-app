"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCocktailDetail } from "../app/api/cocktailApi";
import { Cocktail } from "../app/types";
import LoadingSpinner from "./LoadingSpinner";

interface CocktailModalProps {
  cocktailId: number;
  onClose: () => void;
}

export default function CocktailModal({
  cocktailId,
  onClose,
}: CocktailModalProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cocktailDetail", cocktailId],
    queryFn: () => fetchCocktailDetail(cocktailId),
  });

  if (isLoading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg p-6 flex flex-col items-center">
          <LoadingSpinner />
          <p className="mt-2 text-gray-700">Loading cocktail details...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg p-6">Error loading details.</div>
      </div>
    );

  if (!data) return null;
  const cocktail: Cocktail = data;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-opacity-25 z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[95vh] overflow-y-auto relative shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-700 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-3xl font-bold mb-4 text-center">{cocktail.name}</h2>
        <div className="flex flex-col md:flex-row gap-4">
          {cocktail.imageUrl && (
            <img
              src={cocktail.imageUrl}
              alt={cocktail.name}
              className="w-full md:w-1/2 h-auto mb-4 rounded mx-auto object-cover"
            />
          )}
        </div>
        {cocktail.instructions && (
          <p className="mb-4 text-gray-700">{cocktail.instructions}</p>
        )}
        <h3 className="text-2xl font-semibold mb-2">Ingredients</h3>
        {cocktail.ingredients && cocktail.ingredients.length > 0 ? (
          <ul className="list-disc pl-6 text-gray-700">
            {cocktail.ingredients.map((ingredient) => (
              <li key={ingredient.id} className="mb-2 flex items-center gap-2">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    {ingredient.imageUrl && (
                      <img
                        src={ingredient.imageUrl}
                        alt={ingredient.name}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span>
                      {ingredient.name} - {ingredient.measure}{" "}
                      {ingredient.percentage && `${ingredient.percentage}%`}{" "}
                      {ingredient.alcohol ? "Alcoholic" : "Non-alcoholic"}
                    </span>
                  </div>
                  <p className="italic">{ingredient.description}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No ingredients information available.</p>
        )}
      </div>
    </div>
  );
}
