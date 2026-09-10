import { useSelector } from "react-redux";
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Card,
  CardBody,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  useGetMyInterviewsQuery,
  useCompleteInterviewMutation,
  useCancelInterviewMutation,
} from "../api/api";
import InterviewCard from "../components/interview/InterviewCard";

export default function MyInterviewsPage() {
  const { role } = useSelector((state) => state.auth);
  const { data, isLoading, error, refetch } = useGetMyInterviewsQuery();
  const [completeInterview] = useCompleteInterviewMutation();
  const [cancelInterview] = useCancelInterviewMutation();

  const bg = useColorModeValue("neutral.50", "neutral.900");
  const cardBg = useColorModeValue("white", "neutral.800");
  const borderColor = useColorModeValue("neutral.200", "neutral.700");

  const handleComplete = async (id) => {
    try {
      await completeInterview(id).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to complete:", err);
    }
  };

  const handleCancel = async (id) => {
    if (
      window.confirm(
        "Cancel this interview? The candidate will be reverted to Shortlisted.",
      )
    ) {
      try {
        await cancelInterview(id).unwrap();
        refetch();
      } catch (err) {
        console.error("Failed to cancel:", err);
      }
    }
  };

  if (isLoading) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={bg}
      >
        <Spinner size="xl" color="brand.500" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={8} bg={bg} minH="100vh">
        <Alert status="error" borderRadius="lg" variant="left-accent">
          <AlertIcon />
          <Text>
            Failed to load interviews.{" "}
            <Button variant="link" colorScheme="red" onClick={refetch}>
              Retry
            </Button>
          </Text>
        </Alert>
      </Box>
    );
  }

  const interviews = data || [];
  const upcoming = interviews.filter(
    (i) =>
      i.status?.toUpperCase() === "SCHEDULED" ||
      i.status?.toUpperCase() === "RESCHEDULED",
  );
  const past = interviews.filter(
    (i) =>
      i.status?.toUpperCase() === "COMPLETED" ||
      i.status?.toUpperCase() === "CANCELLED",
  );

  return (
    <Box minH="100vh" px={{ base: 4, md: 6, lg: 8 }} py={6} w="full">
      <Box
        bg={cardBg}
        borderBottomWidth="1px"
        borderColor={borderColor}
        px={8}
        py={4}
      >
        <HStack justify="space-between" mx="auto" w="full">
          <VStack align="start" spacing={0}>
            <Heading size="lg" color="neutral.800">
              My Interviews
            </Heading>
            <Text fontSize="13px" color="neutral.500">
              {upcoming.length} upcoming · {past.length} completed
            </Text>
          </VStack>
        </HStack>
      </Box>

      <Box px={{ base: 4, md: 6, lg: 8 }} py={6} w="full" mx="auto">
        <VStack spacing={6} align="stretch">
          {upcoming.length > 0 && (
            <VStack align="stretch" spacing={3}>
              <Heading size="md" color="neutral.800">
                Upcoming
              </Heading>
              {upcoming.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  interview={interview}
                  onComplete={handleComplete}
                  onCancel={handleCancel}
                  isInterviewer={role?.toUpperCase() === "INTERVIEWER"}
                />
              ))}
            </VStack>
          )}

          {/* Past */}
          {past.length > 0 && (
            <VStack align="stretch" spacing={3}>
              <Heading size="md" color="neutral.800">
                Past
              </Heading>
              {past.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  interview={interview}
                  onComplete={handleComplete}
                  onCancel={handleCancel}
                  isInterviewer={role?.toUpperCase() === "INTERVIEWER"}
                />
              ))}
            </VStack>
          )}

          {/* Empty State */}
          {interviews.length === 0 && (
            <Card
              borderRadius="2xl"
              shadow="sm"
              borderWidth="1px"
              borderColor={borderColor}
              bg={cardBg}
            >
              <CardBody textAlign="center" py={12}>
                <Text fontSize="14px" color="neutral.500">
                  No interviews assigned yet.
                </Text>
                <Text fontSize="12px" color="neutral.400" mt={1}>
                  Check back later or contact your recruiter.
                </Text>
              </CardBody>
            </Card>
          )}
        </VStack>
      </Box>
    </Box>
  );
}
