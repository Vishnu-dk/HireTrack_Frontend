// src/components/jobs/StatusBadge.jsx
import { Badge } from '@chakra-ui/react';

const STATUS_CONFIG = {
  OPEN: { label: 'Open', color: 'green', bg: 'green.50', border: 'green.200' },
  ON_HOLD: { label: 'On Hold', color: 'orange', bg: 'orange.50', border: 'orange.200' },
  CLOSED: { label: 'Closed', color: 'gray', bg: 'gray.50', border: 'gray.200' },
};

export default function StatusBadge({ status, size = 'sm' }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.OPEN;
  
  return (
    <Badge
      size={size}
      colorScheme={config.color}
      bg={config.bg}
      borderColor={config.border}
      borderWidth="1px"
      borderRadius="md"
      fontSize="11px"
      fontWeight="semibold"
      textTransform="uppercase"
      letterSpacing="wide"
      px={2}
      py={0.5}
    >
      {config.label}
    </Badge>
  );
}