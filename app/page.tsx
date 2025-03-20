"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CocktailModal from "../components/CocktailModal";
import CocktailCard from "../components/CocktailCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { Cocktail } from "../app/types";

async function fetchCocktails(
  category: string,
  glass: string,
  alcoholic: string,
  page: number,
  perPage: number
) {
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

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [glassFilter, setGlassFilter] = useState("All");
  const [alcoholicFilter, setAlcoholicFilter] = useState("All");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedCocktailId, setSelectedCocktailId] = useState<number | null>(
    null
  );
  const [page, setPage] = useState(1);
  const perPage = 15;
  const fullPerPage = 133;
  const [sortOption, setSortOption] = useState("name-asc");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("favoriteCocktails");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("favoriteCocktails", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axios.get(
        "https://cocktails.solvro.pl/api/v1/cocktails/categories"
      );
      return res.data;
    },
  });

  const { data: glassesData } = useQuery({
    queryKey: ["glasses"],
    queryFn: async () => {
      const res = await axios.get(
        "https://cocktails.solvro.pl/api/v1/cocktails/glasses"
      );
      return res.data;
    },
  });

  const { data, error, isLoading } = useQuery({
    queryKey: [
      "cocktails",
      categoryFilter,
      glassFilter,
      alcoholicFilter,
      searchTerm,
      page,
    ],
    queryFn: () =>
      fetchCocktails(
        categoryFilter,
        glassFilter,
        alcoholicFilter,
        searchTerm.trim() ? 1 : page,
        searchTerm.trim() ? fullPerPage : perPage
      ),
  });

  const cocktailsArray: Cocktail[] = Array.isArray(data)
    ? data
    : (data?.data ?? []);

  const keywords = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);

  const cocktailsBySearch = keywords.length
    ? cocktailsArray.filter((cocktail: Cocktail) =>
        keywords.every((kw) =>
          cocktail.name
            .toLowerCase()
            .split(/\s+/)
            .some((word) => word.startsWith(kw))
        )
      )
    : cocktailsArray;

  const filteredCocktails = showFavorites
    ? cocktailsBySearch.filter((cocktail) => favorites.includes(cocktail.id))
    : cocktailsBySearch;

  const sortedCocktails = [...filteredCocktails].sort((a, b) => {
    if (sortOption === "name-asc") return a.name.localeCompare(b.name);
    if (sortOption === "name-desc") return b.name.localeCompare(a.name);
    if (sortOption === "category-asc")
      return a.category.localeCompare(b.category);
    if (sortOption === "category-desc")
      return b.category.localeCompare(a.category);
    return 0;
  });

  const cocktailsToDisplay = sortedCocktails;

  const total = data?.total || cocktailsArray.length;
  const totalPages = Math.ceil(total / perPage);

  return (
    <main className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8">
        Cocktail Explorer 🍹
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search cocktails..."
          className="flex-1 px-4 py-1.5 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (e.target.value.trim()) setPage(1);
          }}
        />
        <select
          className="px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={alcoholicFilter}
          onChange={(e) => {
            setAlcoholicFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="All">All</option>
          <option value="Alcoholic">Alcoholic</option>
          <option value="Non alcoholic">Non alcoholic</option>
        </select>
        <select
          className="px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="All">All Categories</option>
          {(Array.isArray(categoriesData)
            ? categoriesData
            : (categoriesData?.data ?? [])
          )
            .sort()
            .map((cat: string) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
        </select>
        <select
          className="px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={glassFilter}
          onChange={(e) => {
            setGlassFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="All">All Glasses</option>
          {(Array.isArray(glassesData)
            ? glassesData
            : (glassesData?.data ?? [])
          )
            .sort()
            .map((glass: string) => (
              <option key={glass} value={glass}>
                {glass}
              </option>
            ))}
        </select>
        <button
          className={`px-4 py-1.5 border rounded shadow-sm ${
            showFavorites
              ? "bg-red-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setShowFavorites((prev) => !prev)}
        >
          Favorites
        </button>
        <select
          className="px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="category-asc">Category (A-Z)</option>
          <option value="category-desc">Category (Z-A)</option>
        </select>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center">
          <LoadingSpinner />
        </div>
      )}
      {error && (
        <div className="text-center text-red-500">Error loading cocktails.</div>
      )}
      {!isLoading && cocktailsArray && cocktailsToDisplay.length === 0 && (
        <div className="text-center text-gray-700">No cocktails found.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cocktailsToDisplay.map((cocktail) => (
          <div key={cocktail.id}>
            <CocktailCard
              cocktail={cocktail}
              onClick={() => setSelectedCocktailId(cocktail.id)}
              onToggleFavorite={toggleFavorite}
              isFavorite={favorites.includes(cocktail.id)}
            />
          </div>
        ))}
      </div>

      {!searchTerm.trim() && (
        <div className="flex justify-center items-center mt-4 gap-4">
          <button
            className="px-3 py-1.5 border rounded"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          <span>Page {page}</span>
          <button
            className="px-3 py-1.5 border rounded"
            onClick={() => {
              if (cocktailsArray.length === perPage) {
                setPage((prev) => prev + 1);
              }
            }}
            disabled={cocktailsArray.length < perPage}
          >
            Next
          </button>
        </div>
      )}

      {selectedCocktailId && (
        <CocktailModal
          cocktailId={selectedCocktailId}
          onClose={() => setSelectedCocktailId(null)}
        />
      )}
    </main>
  );
}
