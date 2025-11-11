import { Alert, CircularProgress, Typography } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import PeopleFeed from "@/components/PeopleFeed";
import SearchFilterBar from "@/components/SearchFilterBar";
import { fetchUsers } from "@/lib/db_functions";
import styles from "@/styles/Home.module.css";
import type { Tables } from "@/types/database.types";
import type { SortType } from "@/types/Sort.types";

export default function People() {
  const [users, setUsers] = useState<Tables<"users">[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortType, setSortType] = useState<SortType>("none");

  // Initial load users from DB on page load
  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        // biome-ignore lint/suspicious/noConsole: just for testing
        console.error("Failed to fetch users:", error);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  return (
    <>
      <Head>
        <title>People | Snowcial</title>
      </Head>
      <div className={styles.page}>
        <main className={styles.main}>
          <Typography
            variant="h3"
            component="h1"
            fontWeight={600}
            textAlign="center"
            mb={1}
          >
            People
          </Typography>

          <SearchFilterBar
            searchTerm={searchTerm}
            sortType={sortType}
            setTerm={setSearchTerm}
            setSortType={setSortType}
          />

          {loading ? (
            <CircularProgress />
          ) : hasError ? (
            <Alert severity="error" sx={{ width: "100%", maxWidth: 640 }}>
              Unable to load people right now.
            </Alert>
          ) : (
            <PeopleFeed
              users={users}
              maxWidth={640}
              searchTerm={searchTerm}
              sortType={sortType}
            />
          )}
        </main>
      </div>
    </>
  );
}
