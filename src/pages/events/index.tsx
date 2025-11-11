import Head from "next/head";
import { useAuthContext } from "@/hooks/useAuth";
import styles from "@/styles/Home.module.css";

export default function Events() {
  const { user } = useAuthContext();

  return (
    <>
      <Head>
        <title>Events | Snowcial</title>
      </Head>
      <div className={styles.page}>
        <main className={styles.main}>
          <h1>EVENTS</h1>
          <p>{user?.user_metadata?.name}</p>
        </main>
      </div>
    </>
  );
}
