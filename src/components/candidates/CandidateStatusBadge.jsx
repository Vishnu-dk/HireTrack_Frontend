import { Badge } from '@chakra-ui/react';

const CANDIDATE_STATUS_CONFIG = {
  APPLIED: { rank:1,label: 'Applied', color: 'blue', bg: 'blue.50', border: 'blue.200' },
  SHORTLISTED: { rank:2,label: 'Shortlisted', color: 'purple', bg: 'purple.50', border: 'purple.200' },
  INTERVIEW_SCHEDULED: { rank:3,label: 'Interview', color: 'orange', bg: 'orange.50', border: 'orange.200' },
  SELECTED: { rank:4,label: 'Selected', color: 'green', bg: 'green.50', border: 'green.200' },
  REJECTED: { rank:4,label: 'Rejected', color: 'red', bg: 'red.50', border: 'red.200' },
};

export default function CandidateStatusBadge({ status }) {
  const config = CANDIDATE_STATUS_CONFIG[status] || CANDIDATE_STATUS_CONFIG.APPLIED;
  
  return (
    <Badge
      colorScheme={config.color}
      bg={config.bg}
      borderColor={config.border}
      borderWidth="1px"
      borderRadius="md"
      fontSize="11px"
      fontWeight="bold"
      textTransform="uppercase"
      letterSpacing="wide"
      px={2.5}
      py={1}
      minW="130px"
      textAlign="center"
    >
      {config.label}
    </Badge>
  );
}

export { CANDIDATE_STATUS_CONFIG };
