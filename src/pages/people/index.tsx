import { Alert, CircularProgress, Typography } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import PeopleFeed from "@/components/PeopleFeed";
import { fetchUsers } from "@/lib/db_functions";
import styles from "@/styles/Home.module.css";
import type { Tables } from "@/types/database.types";

export default function People() {
  const [users, setUsers] = useState<Tables<"users">[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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
