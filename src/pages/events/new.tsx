/** biome-ignore-all lint/style/useNamingConvention: <Using snake_case for DB types to make Supabase happy> */
import { Alert, Box, Paper, Typography } from "@mui/material";
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

  const [error, setError] = useState<string>("");

  const handleSubmit = async (formData: EventFormData) => {
    setError("");
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.event_time
    ) {
      setError("Please fill in a title, description, and date.");
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
      setError(`Failed to create event: ${err}`);
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
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: 3,
            border: 1,
            borderColor: "divider",
            overflow: "hidden",
            p: 3,
          }}
        >
          <EventCreator onSubmit={handleSubmit} handleClick={handleClick} />
        </Paper>
        {error && (
          <Box mb={2}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
        <EventCreator onSubmit={handleSubmit} handleClick={handleClick} />
      </PageLayout>
    </>
  );
}
