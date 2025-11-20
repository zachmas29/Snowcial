/** biome-ignore-all lint/style/useNamingConvention: <Using snake_case for DB types to make Supabase happy> */
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import EventCreator from "@/components/EventCreator";
import { useAuthContext } from "@/hooks/useAuth";
import { insertEventWithTags } from "@/lib/db_functions";
import styles from "@/styles/Home.module.css";
import type { EventFormData } from "@/types/EventCreator.types";

export default function NewEvent() {
  const router = useRouter();
  const authData = useAuthContext();
  const [clientLoaded, setClientLoaded] = useState(false);

  // delay client loading to prevent hydration mismatch
  useEffect(() => {
    setClientLoaded(true);
  }, []);

  const handleSubmit = async (formData: EventFormData) => {
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.event_time
    ) {
      alert("Please fill in a title, description, and date.");
      return;
    }

    if (!clientLoaded || !authData.user) return;

    try {
      const inserted = await insertEventWithTags(
        {
          title: formData.title,
          description: formData.description,
          event_time: formData.event_time,
          tags: formData.tags,
        },
        authData.user.id,
      );

      if (inserted) {
        router.push(`/events/${inserted.id}`);
      }
    } catch (err) {
      alert(`Failed to create event: ${err}`);
    }
  };

  const handleClick = () => {
    router.back();
  };

  if (!clientLoaded) return null;

  return (
    <>
      <Head>
        <title>Create Event | Snowcial</title>
      </Head>

      <div className={styles.page}>
        <main className={styles.main}>
          <h1 style={{ textAlign: "center" }}>CREATE EVENT</h1>
          <EventCreator onSubmit={handleSubmit} handleClick={handleClick} />
        </main>
      </div>
    </>
  );
}
