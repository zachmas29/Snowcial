import Head from "next/head";
import styles from "@/styles/Home.module.css";

export default function EditProfile() {
  return (
    <>
      <Head>
        <title>Edit Profile | Snowcial</title>
      </Head>
      <div className={styles.page}>
        <main className={styles.main}>
          <h1>EDIT PROFILE</h1>
        </main>
      </div>
    </>
  );
}
