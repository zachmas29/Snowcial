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

  // Pull users from DB
  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await fetchUsers();

        // Filter by search term
        const searchedData = data.filter((user) => {
          const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
          return fullName.includes(searchTerm.toLowerCase());
        });

        // Sort by sort term
        const sortedData = searchedData.sort((a, b) => {
          switch (sortType) {
            case "alphabetical": {
              const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
              const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
              return nameA.localeCompare(nameB);
            }
            case "newest":
              return (
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
              );
            case "oldest":
              return (
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
              );
            default:
              return 0;
          }
        });

        setUsers(sortedData);
      } catch (error) {
        // biome-ignore lint/suspicious/noConsole: just for testing
        console.error("Failed to fetch users:", error);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, [searchTerm, sortType]);

  return (
    <>
      <Head>
        <title>People | Snowcial</title>
      </Head>
      <div className={styles.page}>
        <main className={styles.main}>
          <SearchFilterBar
            searchTerm={searchTerm}
            sortType={sortType}
            setTerm={setSearchTerm}
            setSortType={setSortType}
          />
          <Typography
            variant="h3"
            component="h1"
            fontWeight={600}
            textAlign="center"
            mb={1}
          >
            People
          </Typography>

          {loading ? (
            <CircularProgress />
          ) : hasError ? (
            <Alert severity="error" sx={{ width: "100%", maxWidth: 640 }}>
              Unable to load people right now.
            </Alert>
          ) : (
            <PeopleFeed users={users} maxWidth={640} />
          )}
        </main>
      </div>
    </>
  );
}
