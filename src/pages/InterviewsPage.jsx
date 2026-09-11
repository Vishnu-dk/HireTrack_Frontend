// src/pages/InterviewsPage.jsx
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Input,
  Select,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  Divider,
  useColorModeValue,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { AddIcon, RepeatIcon, DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import {
  useGetAllInterviewsQuery,
  useCancelInterviewMutation,
  useGetCandidatesQuery,
  useGetAllInterviewersQuery,
} from "../api/api";
import ScheduleInterviewModal from "../components/interview/ScheduleInterviewModal";
import RescheduleInterviewModal from "../components/interview/RescheduleInterviewModal";
import Pagination from "../components/common/Pagination";
import InterviewStatusBadge from "../components/interview/InterviewStatusBadge";
import FeedbackBadge from "../components/feedback/FeekbackBadge";

export default function InterviewsPage() {
  const { role } = useSelector((state) => state.auth);
  const isEditable = role === "ADMIN" || role === "RECRUITER";

  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [candidateSearch, setCandidateSearch] = useState("");
  const [interviewerSearch, setInterviewerSearch] = useState("");
  const [jobSearch, setJobSearch] = useState("");
  const [recruiterSearch, setRecruiterSearch] = useState("");

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [rescheduleModal, setRescheduleModal] = useState({
    open: false,
    interview: null,
  });

  const {
    data: interviews,
    isLoading,
    error,
    refetch,
  } = useGetAllInterviewsQuery(
    {
      page,
      size: 10,
      status: statusFilter || undefined,
      candidateName: candidateSearch || undefined,
      interviewerName: interviewerSearch || undefined,
      job: jobSearch || undefined,
      recruiterName: recruiterSearch || undefined,
    },
    {
      skip: false,
    },
  );

  const { data: candidates } = useGetCandidatesQuery({ size: 100 });
  const{data:interviewer}=useGetAllInterviewersQuery({size:100});

  const bg = useColorModeValue("neutral.50", "neutral.900");
  const cardBg = useColorModeValue("white", "neutral.800");
  const borderColor = useColorModeValue("neutral.200", "neutral.700");



  const handleReschedule = (interview) => {
    setRescheduleModal({ open: true, interview });
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
          <VStack align="start" spacing={1}>
            <Text fontWeight="semibold">Failed to load interviews</Text>
            <Text fontSize="13px">
              {error.message || "Please try again later"}
            </Text>
          </VStack>
          <Button
            variant="link"
            colorScheme="red"
            size="sm"
            onClick={refetch}
            ml="auto"
          >
            Retry
          </Button>
        </Alert>
      </Box>
    );
  }

  const list = interviews?.content || [];
  const totalPages = interviews?.totalPages || 0;
  const totalElements = interviews?.totalElements || 0;



  return (
    <Box minH="100vh" px={{ base: 4, md: 6, lg: 8 }} py={6} w="full">
      <Box borderBottomWidth="1px" borderColor={borderColor} px={8} py={4}>
        <HStack justify="space-between" mx="auto" w="full">
          <VStack align="start" spacing={0}>
            <Heading size="lg" color="neutral.800">
              Interviews
            </Heading>
            <Text fontSize="13px" color="neutral.500">
              {totalElements} total
            </Text>
          </VStack>
          {isEditable && (
            <Button
              colorScheme="brand"
              size="md"
              leftIcon={<AddIcon />}
              onClick={() => setScheduleModalOpen(true)}
              borderRadius="xl"
            >
              Schedule Interview
            </Button>
          )}
        </HStack>
      </Box>

      <Box px={{ base: 4, md: 6, lg: 8 }} py={6} w="full" mx="auto">
        <VStack spacing={6} align="stretch">
          {/* Filters Card */}
          <Card
            borderRadius="2xl"
            shadow="sm"
            borderWidth="1px"
            borderColor={borderColor}
            bg={cardBg}
          >
            <CardBody>
              <HStack spacing={4} wrap="wrap">
                {/* Candidate Search */}
                <Box flex={1} minW="180px" position="relative">
                  <Input
                    placeholder="Search candidate..."
                    size="sm"
                    value={candidateSearch}
                    onChange={(e) => {
                      setCandidateSearch(e.target.value);
                      setPage(0);
                    }}
                    focusBorderColor="brand.500"
                    borderRadius="xl"
                    pl={10}
                    bg="neutral.50"
                  />
                  <Box
                    position="absolute"
                    left={3}
                    top={2.5}
                    color="neutral.400"
                  >
                    <SearchIcon />
                  </Box>
                </Box>

                {/* Interviewer Search */}
                <Box flex={1} minW="180px" position="relative">
                  <Input
                    placeholder="Search interviewer..."
                    size="sm"
                    value={interviewerSearch}
                    onChange={(e) => {
                      setInterviewerSearch(e.target.value);
                      setPage(0);
                    }}
                    focusBorderColor="brand.500"
                    borderRadius="xl"
                    pl={10}
                    bg="neutral.50"
                  />
                  <Box
                    position="absolute"
                    left={3}
                    top={2.5}
                    color="neutral.400"
                  >
                    <SearchIcon />
                  </Box>
                </Box>

                {/* Recruiter Search - Admin Only */}
                {role === "ADMIN" && (
                  <Box flex={1} minW="180px" position="relative">
                    <Input
                      placeholder="Search recruiter..."
                      size="sm"
                      value={recruiterSearch}
                      onChange={(e) => {
                        setRecruiterSearch(e.target.value);
                        setPage(0);
                      }}
                      focusBorderColor="brand.500"
                      borderRadius="xl"
                      pl={10}
                      bg="neutral.50"
                    />
                    <Box
                      position="absolute"
                      left={3}
                      top={2.5}
                      color="neutral.400"
                    >
                      <SearchIcon />
                    </Box>
                  </Box>
                )}

                {/* Job Search */}
                <Box flex={1} minW="180px" position="relative">
                  <Input
                    placeholder="Search job..."
                    size="sm"
                    value={jobSearch}
                    onChange={(e) => {
                      setJobSearch(e.target.value);
                      setPage(0);
                    }}
                    focusBorderColor="brand.500"
                    borderRadius="xl"
                    pl={10}
                    bg="neutral.50"
                  />
                  <Box
                    position="absolute"
                    left={3}
                    top={2.5}
                    color="neutral.400"
                  >
                    <SearchIcon />
                  </Box>
                </Box>

                {/* Status Filter */}
                <Select
                  placeholder="All statuses"
                  size="sm"
                  width={{ base: "100%", md: "150px" }}
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(0);
                  }}
                  focusBorderColor="brand.500"
                  borderRadius="xl"
                  bg="neutral.50"
                >
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="RESCHEDULED">Rescheduled</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="COMPLETED">Completed</option>
                </Select>

                {/* Clear Filters */}
                {(candidateSearch ||
                  interviewerSearch ||
                  recruiterSearch ||
                  jobSearch ||
                  statusFilter) && (
                  <Button
                    size="sm"
                    variant="ghost"
                    color="neutral.500"
                    onClick={() => {
                      setCandidateSearch("");
                      setInterviewerSearch("");
                      setRecruiterSearch("");
                      setJobSearch("");
                      setStatusFilter("");
                      setPage(0);
                    }}
                    borderRadius="xl"
                  >
                    Clear
                  </Button>
                )}
              </HStack>
            </CardBody>
          </Card>

          {/* Interviews Table */}
          <Card
            borderRadius="2xl"
            shadow="sm"
            borderWidth="1px"
            borderColor={borderColor}
            bg={cardBg}
            overflow="hidden"
          >
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead bg="neutral.50">
                  <Tr>
                    <Th
                      fontSize="12px"
                      fontWeight="semibold"
                      color="neutral.500"
                      textTransform="uppercase"
                    >
                      Candidate
                    </Th>
                    <Th
                      fontSize="12px"
                      fontWeight="semibold"
                      color="neutral.500"
                      textTransform="uppercase"
                    >
                      Interviewer
                    </Th>
                    {role === "ADMIN" && (
                      <Th
                        fontSize="12px"
                        fontWeight="semibold"
                        color="neutral.500"
                        textTransform="uppercase"
                      >
                        Recruiter
                      </Th>
                    )}
                    <Th
                      fontSize="12px"
                      fontWeight="semibold"
                      color="neutral.500"
                      textTransform="uppercase"
                    >
                      Job Title
                    </Th>
                    <Th
                      fontSize="12px"
                      fontWeight="semibold"
                      color="neutral.500"
                      textTransform="uppercase"
                    >
                      Scheduled
                    </Th>
                    <Th
                      fontSize="12px"
                      fontWeight="semibold"
                      color="neutral.500"
                      textTransform="uppercase"
                    >
                      Duration
                    </Th>
                    <Th
                      fontSize="12px"
                      fontWeight="semibold"
                      color="neutral.500"
                      textTransform="uppercase"
                    >
                      Status
                    </Th>
                    <Th
                      fontSize="12px"
                      fontWeight="semibold"
                      color="neutral.500"
                      textTransform="uppercase"
                    >
                      Feedback
                    </Th>
                    <Th
                      fontSize="12px"
                      fontWeight="semibold"
                      color="neutral.500"
                      textTransform="uppercase"
                      textAlign="right"
                    >
                      Actions
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {list.length === 0 ? (
                    <Tr>
                      <Td
                        colSpan={role === "ADMIN" ? 9 : 8}
                        textAlign="center"
                        py={8}
                        color="neutral.500"
                      >
                        {candidateSearch ||
                        interviewerSearch ||
                        recruiterSearch ||
                        jobSearch ||
                        statusFilter
                          ? "No interviews match your filters."
                          : "No interviews scheduled yet."}
                      </Td>
                    </Tr>
                  ) : (
                    list.map((interview) => {
                      const status = interview.status?.toUpperCase();
                      const isScheduled =
                        status === "SCHEDULED" || status === "RESCHEDULED";
                      const isCancelled = status === "CANCELLED";
                      const isCompleted = status === "COMPLETED";

                      return (
                        <Tr
                          key={interview.interviewId}
                          _hover={{ bg: "neutral.50" }}
                        >
                          <Td>
                            <VStack align="start" spacing={0}>
                              <Text
                                fontWeight="semibold"
                                color="neutral.800"
                                fontSize="14px"
                                noOfLines={1}
                              >
                                {interview.candidateName}
                              </Text>
                              <Text
                                fontSize="11px"
                                color="neutral.500"
                                noOfLines={1}
                              >
                                {interview.candidateEmail}
                              </Text>
                            </VStack>
                          </Td>

                          <Td>
                            <VStack align="start" spacing={0}>
                              <Text
                                fontSize="13px"
                                color="neutral.700"
                                noOfLines={1}
                              >
                                {interview.interviewerName || "-"}
                              </Text>
                              <Text
                                fontSize="11px"
                                color="neutral.400"
                                noOfLines={1}
                              >
                                {interview.interviewerEmail || ""}
                              </Text>
                            </VStack>
                          </Td>

                          {role === "ADMIN" && (
                            <Td>
                              <VStack align="start" spacing={0}>
                                <Text
                                  fontSize="13px"
                                  color="neutral.700"
                                  noOfLines={1}
                                >
                                  {interview.recruiterName || "-"}
                                </Text>
                                <Text
                                  fontSize="11px"
                                  color="neutral.400"
                                  noOfLines={1}
                                >
                                  {interview.recruiterEmail || ""}
                                </Text>
                              </VStack>
                            </Td>
                          )}
                          <Td>
                            <Tooltip
                              label={interview.job}
                              hasArrow
                              placement="top-start"
                            >
                              <Text
                                fontSize="13px"
                                color="neutral.700"
                                noOfLines={1}
                                cursor="default"
                              >
                                {interview.job || "-"}
                              </Text>
                            </Tooltip>
                          </Td>
                          <Td>
                            <Text fontSize="13px" color="neutral.700">
                              {interview.scheduledAt
                                ? new Date(
                                    interview.scheduledAt,
                                  ).toLocaleDateString()
                                : "-"}
                            </Text>
                            <Text fontSize="11px" color="neutral.400">
                              {interview.scheduledAt
                                ? new Date(
                                    interview.scheduledAt,
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : ""}
                            </Text>
                          </Td>
                          <Td>
                            <Text fontSize="13px" color="neutral.700">
                              {interview.durationMinutes} min
                            </Text>
                          </Td>
                          <Td>
                            <InterviewStatusBadge status={interview.status} />
                          </Td>
                          <Td>
                            <FeedbackBadge
                              submitted={interview.feedbackSubmitted}
                              recommendation={interview.feedbackRecommendation}
                            />
                          </Td>

                          <Td textAlign="right">
                            <HStack justify="end" spacing={1}>
                              {!isCompleted && isEditable && (
                                <>
                                  {isScheduled && (
                                    <Box>
                                      <IconButton
                                        icon={<RepeatIcon />}
                                        size="sm"
                                        variant="ghost"
                                        colorScheme="orange"
                                        aria-label="Reschedule interview"
                                        onClick={() =>
                                          handleReschedule(interview)
                                        }
                                        title="Reschedule interview"
                                      />

                                    </Box>
                                  )}

                                  {isCancelled && (
                                    <IconButton
                                      icon={<RepeatIcon />}
                                      size="sm"
                                      variant="ghost"
                                      colorScheme="orange"
                                      aria-label="Reschedule interview"
                                      onClick={() =>
                                        handleReschedule(interview)
                                      }
                                      title="Reschedule interview"
                                    />
                                  )}
                                </>
                              )}
                            </HStack>
                          </Td>
                        </Tr>
                      );
                    })
                  )}
                </Tbody>
              </Table>
            </Box>

            {/* Pagination */}
            {totalPages > 1 && (
              <>
                <Divider />
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </>
            )}
          </Card>
        </VStack>
      </Box>

      <ScheduleInterviewModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        candidates={candidates}
        interviewers={interviewer}
      />
      <RescheduleInterviewModal
        isOpen={rescheduleModal.open}
        onClose={() => setRescheduleModal({ open: false, interview: null })}
        interview={rescheduleModal.interview}
        candidates={candidates}
        interviewers={interviewer}
      />
    </Box>
  );
}
