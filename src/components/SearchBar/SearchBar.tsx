import toast from "react-hot-toast";
import styles from "./SearchBar.module.css";

interface Props {
  onSubmit: (query: string) => void;
}

export function SearchBar({ onSubmit }: Props) {
  async function handleFormAction(formData: FormData) {
    const query = formData.get("query");

    if (typeof query !== "string" || !query.trim()) {
      toast.error("Please enter your search query.");
      return;
    }

    onSubmit(query.trim());
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a
          className={styles.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>
        <form className={styles.form} action={handleFormAction}>
          <input
            className={styles.input}
            type="text"
            name="query"
            autoComplete="off"
            placeholder="Search movies..."
            autoFocus
          />
          <button className={styles.button} type="submit">
            Search
          </button>
        </form>
      </div>
    </header>
  );
}
