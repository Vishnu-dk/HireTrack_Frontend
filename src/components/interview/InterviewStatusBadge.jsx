import { Badge } from "@chakra-ui/react";

export default function InterviewStatusBadge({ status }) {
  const config = {
    SCHEDULED: { label: "Scheduled", color: "blue", bg: "blue.50" },
    RESCHEDULED: { label: "Rescheduled", color: "orange", bg: "orange.50" },
    CANCELLED: { label: "Cancelled", color: "gray", bg: "gray.50" },
    COMPLETED: { label: "Completed", color: "green", bg: "green.50" },
  };
  const c = config[status?.toUpperCase()] || config.SCHEDULED;
  return (
    <Badge
      colorScheme={c.color}
      borderRadius="full"
      px={3}
      py={1}
      fontSize="11px"
      fontWeight="semibold"
    >
      {c.label}
    </Badge>
  );
}