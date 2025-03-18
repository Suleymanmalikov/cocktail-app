"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

interface Cocktail {
  id: number;
  name: string;
  imageUrl: string;
  instructions?: string;
  category: string;
  glass: string;
  alcoholic: boolean;
}

async function fetchCocktails(
  searchTerm: string,
  category: string,
  glass: string,
  alcoholic: string
) {
  let url = `https://cocktails.solvro.pl/api/v1/cocktails?page=1&perPage=50`;
  const params: Record<string, any> = {};
  if (searchTerm.trim()) {
    params.name = searchTerm;
  }
  if (category !== "All") {
    params.category = category;
  }
  if (glass !== "All") {
    params.glass = glass;
  }
  if (alcoholic !== "All") {
    params.alcoholic = alcoholic === "Alcoholic" ? true : false;
  }
  const query = new URLSearchParams(params).toString();
  if (query) {
    url += `&${query}`;
  }
  const res = await axios.get(url);
  return res.data;
}

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [glassFilter, setGlassFilter] = useState("All");
  const [alcoholicFilter, setAlcoholicFilter] = useState("All");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteCocktails");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favoriteCocktails", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (cocktailId: number) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(cocktailId)
        ? prevFavorites.filter((id) => id !== cocktailId)
        : [...prevFavorites, cocktailId]
    );
  };

  const { data: glassesData } = useQuery({
    queryKey: ["glasses"],
    queryFn: async () => {
      const res = await axios.get(
        "https://cocktails.solvro.pl/api/v1/cocktails/glasses"
      );
      return res.data;
    },
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axios.get(
        "https://cocktails.solvro.pl/api/v1/cocktails/categories"
      );
      return res.data;
    },
  });

  const { data, error, isLoading } = useQuery({
    queryKey: [
      "cocktails",
      debouncedSearchTerm,
      categoryFilter,
      glassFilter,
      alcoholicFilter,
    ],
    queryFn: () =>
      fetchCocktails(
        debouncedSearchTerm,
        categoryFilter,
        glassFilter,
        alcoholicFilter
      ),
  });

  const cocktailsToDisplay =
    showFavorites && data?.data
      ? data.data.filter((cocktail: Cocktail) =>
          favorites.includes(cocktail.id)
        )
      : data?.data || [];

  return (
    <main className="p-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search cocktails"
          className="px-3 py-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="px-3 py-2 border rounded"
          value={alcoholicFilter}
          onChange={(e) => setAlcoholicFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Alcoholic">Alcoholic</option>
          <option value="Non alcoholic">Non alcoholic</option>
        </select>

        <select
          className="px-3 py-2 border rounded"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All</option>
          {categoriesData?.data?.map((cat: string) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          className="px-3 py-2 border rounded"
          value={glassFilter}
          onChange={(e) => setGlassFilter(e.target.value)}
        >
          <option value="All">All</option>
          {glassesData?.data?.map((glass: string) => (
            <option key={glass} value={glass}>
              {glass}
            </option>
          ))}
        </select>

        <button
          className={`px-3 py-2 border rounded ${
            showFavorites
              ? "bg-red-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setShowFavorites((prev) => !prev)}
        >
          {showFavorites ? "Favorites" : "Favorites"}
        </button>
      </div>

      {isLoading && <div>Loading cocktails...</div>}
      {error && <div>Error loading cocktails</div>}
      {data?.data && cocktailsToDisplay.length === 0 && (
        <div>No cocktails found</div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cocktailsToDisplay.map((cocktail: Cocktail) => (
          <div
            key={cocktail.id}
            className="border rounded p-4 flex flex-col items-center"
          >
            <div className="flex justify-between w-full text-lg mb-2 font-semibold">
              <h2 className=" ">{cocktail.name}</h2>
              <button
                className={`rounded ${
                  favorites.includes(cocktail.id)
                  // ? "bg-red-500 text-white"
                  // : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => toggleFavorite(cocktail.id)}
              >
                {favorites.includes(cocktail.id) ? "❤️" : "🤍"}
              </button>
            </div>
            <img
              src={cocktail.imageUrl}
              alt={cocktail.name}
              className="w-full h-auto mb-2"
            />
            <div className="flex text-sm text-gray-600">
              <p className="">{cocktail.instructions?.slice(0, 50)}...</p>
              <Link href={`/cocktail/${cocktail.id}`}>
                <p className="text-gray-900">more</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
