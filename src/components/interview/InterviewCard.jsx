import { useState } from "react";
import { useGetInterviewFeedbackQuery } from "../../api/api";
import { Badge, Button, Card, HStack, Spinner, Tag, TagLabel, Text, VStack } from "@chakra-ui/react";
import SubmitFeedbackModal from "../feedback/SubmitFeedbackModal";

export default function InterviewCard({ interview, onComplete, onCancel, isInterviewer }) {
  const statusColors = {
    SCHEDULED: 'blue',
    RESCHEDULED: 'orange',
    CANCELLED: 'gray',
    COMPLETED: 'green',
  };
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  
  const isCompleted = interview.status?.toUpperCase() === 'COMPLETED';
  const isScheduled = interview.status?.toUpperCase() === 'SCHEDULED';
  
  const { data: feedback, isLoading: feedbackLoading } = useGetInterviewFeedbackQuery(
    isCompleted && isInterviewer ? interview.id : undefined,
    { skip: !(isCompleted && isInterviewer) } 
  );
  
  const hasFeedback = !!feedback;

  return (
    <Card borderRadius="2xl" shadow="sm" borderWidth="1px" borderColor="neutral.200" bg="white" p={5}>
      <HStack justify="space-between" mb={3}>
        <VStack align="start" spacing={0}>
          <Text fontWeight="bold" fontSize="14px" color="neutral.800">{interview.candidateName}</Text>
          <Text fontSize="12px" color="neutral.500">{interview.jobTitle || 'Unassigned job'}</Text>
        </VStack>
        <Badge colorScheme={statusColors[interview.status?.toUpperCase()] || 'gray'} borderRadius="full" px={3} py={1}>
          {interview.status?.replace('_', ' ')}
        </Badge>
      </HStack>
      
      <HStack spacing={4} mb={4} fontSize="13px" color="neutral.600">
        <Text>📅 {new Date(interview.scheduledAt).toLocaleDateString()}</Text>
        <Text>🕐 {new Date(interview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        <Text>⏱️ {interview.durationMinutes} min</Text>
      </HStack>
      
      {(isInterviewer || hasFeedback) && (
        <HStack spacing={2} pt={3} borderTopWidth="1px" borderColor="neutral.100">
          
          {isScheduled && isInterviewer && (
            <>
              <Button size="sm" colorScheme="green" borderRadius="xl" onClick={() => onComplete(interview.id)}>Mark Complete</Button>
              <Button size="sm" variant="outline" colorScheme="red" borderRadius="xl" onClick={() => onCancel(interview.id)}>Cancel</Button>
            </>
          )}
          
          {isCompleted && (
            <>
              {feedbackLoading ? (
                <Spinner size="sm" color="brand.500" />
              ) : hasFeedback ? (
                <Tag size="md" variant="subtle" colorScheme="green" borderRadius="xl">
                  <TagLabel>✓ Feedback Submitted</TagLabel>
                </Tag>
              ) : isInterviewer ? (
                <Button 
                  size="sm" 
                  bgGradient="linear(to-br, brand.500, brand.700)" 
                  color="white" 
                  borderRadius="xl" 
                  onClick={() => setFeedbackOpen(true)}
                >
                  Submit Feedback
                </Button>
              ) : null}
            </>
          )}
        </HStack>
      )}

      <SubmitFeedbackModal
        isOpen={feedbackOpen} 
        onClose={() => setFeedbackOpen(false)} 
        interviewId={interview.id} 
      />
    </Card>
  );
}