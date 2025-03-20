"use client";

import React from "react";
import { Cocktail } from "../app/types";

interface CocktailCardProps {
  cocktail: Cocktail;
  onClick: () => void;
  onToggleFavorite: (id: number) => void;
  isFavorite: boolean;
}

export default function CocktailCard({
  cocktail,
  onClick,
  onToggleFavorite,
  isFavorite,
}: CocktailCardProps) {
  return (
    <div
      className="border rounded-lg p-4 flex flex-col items-center cursor-pointer hover:shadow-lg transition transform hover:scale-105 bg-white"
      onClick={onClick}
    >
      <div className="flex justify-between w-full text-lg mb-2 font-semibold">
        <h2>{cocktail.name}</h2>
        <button
          className="rounded"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(cocktail.id);
          }}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </div>
      <img
        src={cocktail.imageUrl}
        alt={cocktail.name}
        className="w-full  object-cover rounded-md mb-2"
      />
      <p className="text-sm text-gray-600 w-full">
        {cocktail.category} - {cocktail.glass} -{" "}
        {cocktail.alcoholic ? "Alcoholic" : "Non alcoholic"}
      </p>
    </div>
  );
}
