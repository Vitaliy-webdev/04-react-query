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
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess } = useQuery<
    MoviesResponse,
    Error
  >({
    queryKey: ["movies", query, page],
    queryFn: () => getMovies(query, page),
    enabled: !!query.trim(),
  });

  useEffect(() => {
    if (data) {
      setMovies(data.results);
      setTotalPages(data.total_pages);
      if (data.results.length === 0) {
        toast.error("No movies found for your request.");
      }
    }
  }, [data]);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      toast.error("Please enter your search query.");
      return;
    }
    setQuery(searchQuery);
    setPage(1);
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />

      {isError && <ErrorMessage />}
      {isLoading && <Loader />}
      {!isLoading && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      {isSuccess && totalPages > 1 && (
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
