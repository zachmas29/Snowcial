import Head from "next/head";
import styles from "@/styles/Home.module.css";

export default function NewPost() {
  return (
    <>
      <Head>
        <title>New Post | Snowcial</title>
      </Head>
      <div className={styles.page}>
        <main className={styles.main}>
          <h1>NEW POST</h1>
        </main>
      </div>
    </>
  );
}
