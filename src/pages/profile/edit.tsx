import Head from "next/head";
import { useAuthContext } from "@/hooks/useAuth";
import styles from "@/styles/Home.module.css";

export default function EditProfile() {
  const { user } = useAuthContext();

  return (
    <>
      <Head>
        <title>Edit Profile | Snowcial</title>
      </Head>
      <div className={styles.page}>
        <main className={styles.main}>
          <h1>EDIT PROFILE</h1>
          <p>{user?.user_metadata?.name}</p>
        </main>
      </div>
    </>
  );
}
