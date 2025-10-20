import Head from "next/head";
import styles from "@/styles/Home.module.css";

export default function Profile() {
  return (
    <>
      <Head>
        <title>Profile | Snowcial</title>
      </Head>
      <div className={styles.page}>
        <main className={styles.main}>
          <h1>PROFILE</h1>
        </main>
      </div>
    </>
  );
}
