/** biome-ignore-all lint/style/useNamingConvention: <Using snake_case for DB types to make Supabase happy> */
import { Typography } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import EventCreator from "@/components/EventCreator";
import PageLayout from "@/components/PageLayout";
import { useAuthContext } from "@/hooks/useAuth";
import { insertEventWithTags } from "@/lib/db_functions";
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
          capacity: formData.capacity ?? null,
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
      <PageLayout>
        <Typography
          variant="h3"
          component="h1"
          fontWeight={600}
          textAlign="center"
          mb={1}
        >
          Create Event
        </Typography>
        <EventCreator onSubmit={handleSubmit} handleClick={handleClick} />
      </PageLayout>
    </>
  );
}
