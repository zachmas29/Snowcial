import { Alert, Typography } from "@mui/material";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import PeopleFeed from "@/components/PeopleFeed";
import { fetchUsers } from "@/lib/db_functions";
import styles from "@/styles/Home.module.css";
import type { Tables } from "@/types/database.types";

interface PeoplePageProps {
  users: Tables<"users">[];
  hasError: boolean;
}

export const getServerSideProps: GetServerSideProps<
  PeoplePageProps
> = async () => {
  try {
    const users = await fetchUsers();
    return {
      props: {
        users,
        hasError: false,
      },
    };
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: just for testing
    console.error("Failed to fetch users:", error);
    return {
      props: {
        users: [],
        hasError: true,
      },
    };
  }
};

export default function People({ users, hasError }: PeoplePageProps) {
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

          {hasError ? (
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
