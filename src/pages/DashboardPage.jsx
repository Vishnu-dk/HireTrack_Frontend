import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Grid,
  Spinner,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { useGetDashboardQuery } from "../api/api";
import DashboardCard from "../components/dashboard/DashboardCard";

export default function DashboardPage() {
  const { role } = useSelector((state) => state.auth);
  const { data, isLoading, error, refetch } = useGetDashboardQuery();
  const navigate = useNavigate();

  const bg = useColorModeValue("neutral.50", "neutral.900");

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
            <Text fontWeight="semibold">Failed to load dashboard</Text>
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

  const stats = {
    totalJobs: data?.totalJobs || 0,
    openJobs: data?.openJobs || 0,
    candidatesInPipeline: data?.candidatesInPipeline || 0,
    interviewsThisWeek: data?.interviewsThisWeek || 0,
    pendingFeedback: data?.pendingFeedback || 0,
  };

  const getQuickActions = () => {
    switch (role) {
      case "ADMIN":
        return [
          { label: "Manage Users", path: "/users", color: "#7C3AED" },
          { label: "View Reports", path: "/reports", color: "#06B6D4" },
        ];
      case "RECRUITER":
        return [
          { label: "Create Job", path: "/jobs", color: "#00A86B" },
          { label: "Add Candidate", path: "/candidates", color: "#7C3AED" },
          {
            label: "Schedule Interview",
            path: "/interviews",
            color: "#06B6D4",
          },
        ];
      case "INTERVIEWER":
        return [
          {
            label: "View My Interviews",
            path: "/interviews/my",
            color: "#06B6D4",
          },
          { label: "Submit Feedback", path: "/feedback", color: "#C65D2E" },
        ];
      default:
        return [];
    }
  };

  const quickActions = getQuickActions();

  return (
    <Box px={{ base: 4, md: 6, lg: 8 }} py={6} w="full">
      {/* Header */}
      <Box
        bg="white"
        borderBottomWidth="1px"
        borderColor="neutral.200"
        px={8}
        py={4}
      >
        <HStack justify="space-between" mx="auto">
          <VStack align="start" spacing={0}>
            <Heading size="lg" color="neutral.800">
              Welcome {data.fullName}
            </Heading>
            <Text fontSize="13px" color="neutral.500">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </VStack>
          <Badge
            colorScheme={
              role === "ADMIN"
                ? "purple"
                : role === "RECRUITER"
                  ? "green"
                  : "cyan"
            }
            fontSize="11px"
            px={3}
            py={1}
            borderRadius="md"
          >
            {role}
          </Badge>
        </HStack>
      </Box>

      <Box p={8} mx="auto">
        <VStack spacing={6} align="stretch">
          <Grid
            templateColumns={{ base: "1fr 1fr", md: "repeat(4, 1fr)" }}
            gap={{ base: 2, md: 4, lg: 8 }}
          >
            {(role === "ADMIN" || role === "RECRUITER") && (
              <>
                <DashboardCard
                  label="Total Jobs"
                  value={stats.totalJobs}
                  subtext={`${stats.openJobs} open`}
                  color="#00A86B"
                  delay={0}
                  icon={
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                    </svg>
                  }
                />
                <DashboardCard
                  label="Candidates in Pipeline"
                  value={stats.candidatesInPipeline}
                  subtext="Active"
                  color="#7C3AED"
                  delay={100}
                  icon={
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                  }
                />
              </>
            )}

            <DashboardCard
              label="Interviews This Week"
              value={stats.interviewsThisWeek}
              subtext="Scheduled"
              color="#06B6D4"
              delay={200}
              icon={
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              }
            />
            <DashboardCard
              label="Pending Feedback"
              value={stats.pendingFeedback}
              subtext="Action needed"
              color="#C65D2E"
              delay={300}
              icon={
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />
          </Grid>

          {quickActions.length > 0 && (
            <Card
              borderRadius="xl"
              shadow="sm"
              borderWidth="1px"
              borderColor="neutral.200"
            >
              <CardHeader pb={0}>
                <Heading size="md" color="neutral.800">
                  Quick Actions
                </Heading>
              </CardHeader>
              <CardBody>
                <HStack spacing={3} wrap="wrap">
                  {quickActions.map((action) => (
                    <Button
                      key={action.label}
                      size="sm"
                      variant="outline"
                      color={action.color}
                      borderColor={`${action.color}30`}
                      _hover={{
                        bg: `${action.color}10`,
                        transform: "translateY(-1px)",
                      }}
                      onClick={() => navigate(action.path)}
                      borderRadius="lg"
                      fontSize="12px"
                      fontWeight="semibold"
                      leftIcon={
                        <Box
                          width={1.5}
                          height={1.5}
                          borderRadius="full"
                          bg={action.color}
                        />
                      }
                      sx={{ transition: "all 0.2s ease" }}
                    >
                      {action.label}
                    </Button>
                  ))}
                </HStack>
              </CardBody>
            </Card>
          )}

          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={4}>
            <Card
              borderRadius="xl"
              shadow="sm"
              borderWidth="1px"
              borderColor="neutral.200"
            >
              <CardHeader>
                <Heading size="md" color="neutral.800">
                  Pipeline Overview
                </Heading>
              </CardHeader>
              <CardBody>
                <Text
                  fontSize="14px"
                  color="neutral.500"
                  textAlign="center"
                  py={8}
                >
                  Charts will be added when backend provides historical data.
                  <br />
                  <Text as="span" fontSize="12px" color="neutral.400">
                    Current: {stats.candidatesInPipeline} candidates in pipeline
                  </Text>
                </Text>
              </CardBody>
            </Card>

            <Card
              borderRadius="xl"
              shadow="sm"
              borderWidth="1px"
              borderColor="neutral.200"
            >
              <CardHeader>
                <Heading size="md" color="neutral.800">
                  Recent Activity
                </Heading>
              </CardHeader>
              <CardBody>
                <Text
                  fontSize="14px"
                  color="neutral.500"
                  textAlign="center"
                  py={8}
                >
                  Activity feed will be added when backend provides event logs.
                  <br />
                  <Text as="span" fontSize="12px" color="neutral.400">
                    Last update: {new Date().toLocaleTimeString()}
                  </Text>
                </Text>
              </CardBody>
            </Card>
          </Grid>
        </VStack>
      </Box>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
}
