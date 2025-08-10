import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import css from "./App.module.css";
import { SearchBar } from "../SearchBar/SearchBar";
import { MovieGrid } from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { getMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";

interface MoviesResponse {
  results: Movie[];
  total_pages: number;
}

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess } = useQuery<
    MoviesResponse,
    Error
  >({
    queryKey: ["movies", query, page],
    queryFn: () => getMovies(query, page),
    enabled: !!query,
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    if (isSuccess && data?.results?.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [isSuccess, data]);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      toast.error("Please enter your search query.");
      return;
    }
    setQuery(searchQuery);
    setPage(1);
  };

  const totalPages = data?.total_pages || 0;

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />

      {isError && <ErrorMessage />}
      {isLoading && <Loader />}
      {isSuccess && data?.results.length > 0 && (
        <MovieGrid movies={data.results} onSelect={setSelectedMovie} />
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      <Toaster position="top-right" />
    </div>
  );
}
