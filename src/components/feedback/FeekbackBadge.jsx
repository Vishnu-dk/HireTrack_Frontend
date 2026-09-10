import { Tag, TagLabel, Text } from "@chakra-ui/react";

export default function FeedbackBadge({ submitted, recommendation }) {
  if (!submitted) {
    return <Text fontSize="12px" color="neutral.400">Pending</Text>;
  }
  const recConfig = {
    SELECT: { label: "✓ Select", color: "green" },
    HOLD: { label: "⏸ Hold", color: "orange" },
    REJECT: { label: "✗ Reject", color: "red" },
  };
  const r = recConfig[recommendation?.toUpperCase()] || recConfig.HOLD;
  return (
    <Tag size="sm" variant="subtle" colorScheme={r.color} borderRadius="full">
      <TagLabel fontSize="11px">{r.label}</TagLabel>
    </Tag>
  );
}