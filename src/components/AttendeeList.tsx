/** biome-ignore-all lint/style/useNamingConvention: <Using snake_case to make Supabase happy> */
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ScheduleIcon from "@mui/icons-material/Schedule";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import Link from "next/link";
import UserAvatar from "@/components/UserAvatar";

interface RsvpWithUser {
  user_id: string;
  status: "yes" | "maybe";
  created_at: string;
  users: {
    first_name: string;
    last_name: string;
    profile_photo_path: string | null;
  };
}

interface AttendeeListProps {
  rsvps: RsvpWithUser[];
  capacity: number | null;
}

export default function AttendeeList({ rsvps, capacity }: AttendeeListProps) {
  // Calculate lists client-side
  const yesRsvps = rsvps.filter((r) => r.status === "yes");
  const confirmed = capacity !== null ? yesRsvps.slice(0, capacity) : yesRsvps;
  const waitlist = capacity !== null ? yesRsvps.slice(capacity) : [];
  const maybes = rsvps.filter((r) => r.status === "maybe");

  const totalConfirmed = confirmed.length;
  const totalWaitlist = waitlist.length;
  const totalMaybe = maybes.length;
  const spotsRemaining =
    capacity !== null ? Math.max(0, capacity - totalConfirmed) : null;

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      {/* Header with capacity info */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Attendees
        </Typography>
        {capacity !== null ? (
          <Typography variant="body2" color="text.secondary">
            {totalConfirmed} / {capacity} spots filled
            {spotsRemaining !== null && spotsRemaining > 0 && (
              <> • {spotsRemaining} spots remaining</>
            )}
            {totalWaitlist > 0 && <> • {totalWaitlist} on waitlist</>}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {totalConfirmed} attending • Unlimited capacity
          </Typography>
        )}
      </Box>

      {/* Confirmed Attendees */}
      {confirmed.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <CheckCircleIcon color="success" fontSize="small" />
            <Typography variant="subtitle2" fontWeight="bold">
              Going ({totalConfirmed})
            </Typography>
          </Box>
          <List dense>
            {confirmed.map((attendee) => (
              <ListItem key={attendee.user_id} disablePadding sx={{ mb: 0.5 }}>
                <Link
                  href={`/profile/${attendee.user_id}`}
                  style={{ textDecoration: "none", width: "100%" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: 1,
                      borderRadius: 1,
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <ListItemAvatar sx={{ minWidth: 40 }}>
                      <UserAvatar
                        user={{
                          id: attendee.user_id,
                          first_name: attendee.users.first_name,
                          last_name: attendee.users.last_name,
                          profile_photo_path: attendee.users.profile_photo_path,
                        }}
                        sx={{ width: 32, height: 32 }}
                        shouldLink={false}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${attendee.users.first_name} ${attendee.users.last_name}`}
                      primaryTypographyProps={{
                        variant: "body2",
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Waitlist */}
      {waitlist.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <ScheduleIcon color="warning" fontSize="small" />
            <Typography variant="subtitle2" fontWeight="bold">
              Waitlist ({totalWaitlist})
            </Typography>
          </Box>
          <List dense>
            {waitlist.map((attendee) => (
              <ListItem key={attendee.user_id} disablePadding sx={{ mb: 0.5 }}>
                <Link
                  href={`/profile/${attendee.user_id}`}
                  style={{ textDecoration: "none", width: "100%" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: 1,
                      borderRadius: 1,
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <ListItemAvatar sx={{ minWidth: 40 }}>
                      <UserAvatar
                        user={{
                          id: attendee.user_id,
                          first_name: attendee.users.first_name,
                          last_name: attendee.users.last_name,
                          profile_photo_path: attendee.users.profile_photo_path,
                        }}
                        sx={{ width: 32, height: 32, opacity: 0.7 }}
                        shouldLink={false}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${attendee.users.first_name} ${attendee.users.last_name}`}
                      primaryTypographyProps={{
                        variant: "body2",
                        color: "text.secondary",
                      }}
                    />
                  </Box>
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Maybe Attendees */}
      {maybes.length > 0 && (
        <Box>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <HelpOutlineIcon color="action" fontSize="small" />
            <Typography variant="subtitle2" fontWeight="bold">
              Maybe ({totalMaybe})
            </Typography>
          </Box>
          <List dense>
            {maybes.map((attendee) => (
              <ListItem key={attendee.user_id} disablePadding sx={{ mb: 0.5 }}>
                <Link
                  href={`/profile/${attendee.user_id}`}
                  style={{ textDecoration: "none", width: "100%" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: 1,
                      borderRadius: 1,
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <ListItemAvatar sx={{ minWidth: 40 }}>
                      <UserAvatar
                        user={{
                          id: attendee.user_id,
                          first_name: attendee.users.first_name,
                          last_name: attendee.users.last_name,
                          profile_photo_path: attendee.users.profile_photo_path,
                        }}
                        sx={{ width: 32, height: 32 }}
                        shouldLink={false}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${attendee.users.first_name} ${attendee.users.last_name}`}
                      primaryTypographyProps={{ variant: "body2" }}
                    />
                  </Box>
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Empty State */}
      {confirmed.length === 0 &&
        waitlist.length === 0 &&
        maybes.length === 0 && (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            No RSVPs yet. Be the first!
          </Typography>
        )}
    </Paper>
  );
}
