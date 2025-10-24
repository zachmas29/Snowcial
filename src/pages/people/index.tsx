import Head from "next/head";
import { useEffect, useState } from "react";
import { fetchUsers } from "@/lib/db_functions";
import styles from "@/styles/Home.module.css";

export default function People() {
  // HOOK FOR SECTIONS
  useEffect(
    () => {
      const fetchData = async () => {
        const users = await fetchUsers();
      };
      fetchData();
    },
    [
      /* When does this need to be called? */
    ],
  );

  return (
    <>
      <Head>
        <title>People | Snowcial</title>
      </Head>
      <div className={styles.page}>
        <main className={styles.main}>
          <h1>PEOPLE</h1>
        </main>
      </div>
    </>
  );
}
