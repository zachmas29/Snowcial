/** biome-ignore-all lint/style/useNamingConvention: <Using snake_case to make Supabase happy> */

import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Alert, Button, ButtonGroup, CircularProgress } from "@mui/material";
import { useState } from "react";
import { deleteRSVP, upsertRSVP } from "@/lib/db_functions";

interface RSVPButtonProps {
  eventId: number;
  currentStatus: "yes" | "maybe" | null;
  capacity: number | null;
  rsvps: Array<{ status: string }>;
  userId: string;
  onRSVPChange: () => void;
}

export default function RSVPButton({
  eventId,
  currentStatus,
  capacity,
  rsvps,
  userId,
  onRSVPChange,
}: RSVPButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const yesCount = rsvps.filter((r) => r.status === "yes").length;
  const isFull = capacity !== null && yesCount >= capacity;
  const wouldBeWaitlisted = currentStatus !== "yes" && isFull;

  const handleRSVP = async (newStatus: "yes" | "maybe" | null) => {
    setLoading(true);
    setError(null);

    try {
      if (newStatus === null) {
        await deleteRSVP(eventId, userId);
      } else {
        await upsertRSVP(eventId, userId, newStatus);
      }
      onRSVPChange();
    } catch (err) {
      setError("Failed to update RSVP. Please try again.");
      // biome-ignore lint/suspicious/noConsole: error logging
      console.error("RSVP error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress size={24} />;
  }

  return (
    <>
      <ButtonGroup variant="outlined" disabled={loading}>
        <Button
          variant={currentStatus === "yes" ? "contained" : "outlined"}
          color={currentStatus === "yes" ? "success" : "primary"}
          startIcon={<CheckCircleIcon />}
          onClick={() => handleRSVP(currentStatus === "yes" ? null : "yes")}
        >
          {currentStatus === "yes"
            ? "Going"
            : wouldBeWaitlisted
              ? "Join Waitlist"
              : "Going"}
        </Button>
        <Button
          variant={currentStatus === "maybe" ? "contained" : "outlined"}
          color={currentStatus === "maybe" ? "warning" : "primary"}
          startIcon={<HelpOutlineIcon />}
          onClick={() => handleRSVP(currentStatus === "maybe" ? null : "maybe")}
        >
          {currentStatus === "maybe" ? "Maybe" : "Maybe"}
        </Button>
        {currentStatus && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<CancelIcon />}
            onClick={() => handleRSVP(null)}
          >
            Cancel
          </Button>
        )}
      </ButtonGroup>
      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
    </>
  );
}
