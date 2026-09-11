import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import {
  Box, VStack, HStack, Heading, Text, Grid, Spinner, Alert, AlertIcon,
  Card, CardBody, CardHeader, Badge, Button, useColorModeValue, Skeleton,
} from "@chakra-ui/react";
import {
  useGetDashboardQuery,
  useGetAllJobQuery,
  useGetAllInterviewsQuery,
  useGetMyInterviewsQuery,
} from "../api/api";
import DashboardCard from "../components/dashboard/DashboardCard";
import StatBox from "../components/dashboard/StatBox";



export default function DashboardPage() {
  const { role } = useSelector((state) => state.auth);
  const { data: dashboard, isLoading: dashLoading, error: dashError, refetch: refetchDashboard } = useGetDashboardQuery();
  
  const isInterviewer = role === "INTERVIEWER";
  
  const { data: jobsData, isLoading: jobsLoading } = useGetAllJobQuery({
    size: 100,
  }, { skip: isInterviewer });
  
  const { data: scheduledData, isLoading: loadingScheduled } = useGetAllInterviewsQuery(
    { status: "SCHEDULED", size: 5 },
    { skip: isInterviewer }
  );
  
  const { data: myInterviewsData, isLoading: loadingMy } = useGetMyInterviewsQuery(
    undefined,
    { skip: !isInterviewer }
  );

  const navigate = useNavigate();
  const bg = useColorModeValue("neutral.50", "neutral.900");

  const stats = {
    totalJobs: dashboard?.totalJobs || 0,
    openJobs: dashboard?.openJobs || 0,
    candidatesInPipeline: dashboard?.candidatesInPipeline || 0,
    interviewsThisWeek: dashboard?.interviewsThisWeek || 0,
    pendingFeedback: dashboard?.pendingFeedback || 0,
  };

  const chartData = useMemo(() => {
    if (!jobsData?.content) return [];
    const counts = jobsData.content.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .filter(([_, count]) => count > 0)
      .map(([status, count]) => ({
        name: status.replace("_", " "),
        value: count,
        color: { OPEN: "#00A86B", ON_HOLD: "#F59E0B", CLOSED: "#64748B" }[status] || "#94A3B8",
      }));
  }, [jobsData]);

  const interviewStats = useMemo(() => {
    let interviews = myInterviewsData ? (Array.isArray(myInterviewsData) ? myInterviewsData : []) : [];
    const scheduled = interviews.filter(i => ["SCHEDULED", "RESCHEDULED"].includes(i.status?.toUpperCase())).length;
    const completed = interviews.filter(i => i.status?.toUpperCase() === "COMPLETED").length;
    const avgDur = interviews.length > 0 
      ? Math.round(interviews.reduce((sum, i) => sum + (i.durationMinutes || 0), 0) / interviews.length) 
      : 0;

    return { scheduled, completed, pendingFeedback: stats.pendingFeedback, avgDur };
  }, [myInterviewsData, stats.pendingFeedback]);

  const upcomingList = useMemo(() => {
    let interviews = isInterviewer ? (myInterviewsData || []) : (scheduledData?.content || []);
    interviews = Array.isArray(interviews) ? interviews : [];
    return interviews
      .filter(i => ["SCHEDULED", "RESCHEDULED"].includes(i.status?.toUpperCase()))
      .slice(0, 5)
      .map(interview => ({
        id: interview.interviewId || interview.id,
        candidate: interview.candidateName,
        job: interview.jobTitle || "Unassigned",
        date: new Date(interview.scheduledAt).toLocaleString("en-US", {
          month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
        }),
      }));
  }, [isInterviewer, myInterviewsData, scheduledData]);

  const getQuickActions = () => {
    switch (role) {
      case "ADMIN": return [{ label: "Manage Users", path: "/users", color: "#7C3AED" }];
      case "RECRUITER": return [
        { label: "Create Job", path: "/jobs", color: "#00A86B" },
        { label: "Add Candidate", path: "/candidates", color: "#7C3AED" },
        { label: "Schedule Interview", path: "/interviews", color: "#06B6D4" },
      ];
      case "INTERVIEWER": return [
        { label: "View My Interviews", path: "/interviews/my", color: "#06B6D4" },
        { label: "Submit Feedback", path: "/feedback", color: "#C65D2E" },
      ];
      default: return [];
    }
  };
  const quickActions = getQuickActions();

  const contentLoading = dashLoading || (isInterviewer ? loadingMy : (jobsLoading || loadingScheduled));

  if (contentLoading) {
    return <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg={bg}><Spinner size="xl" color="brand.500" /></Box>;
  }

  if (dashError) {
    return (
      <Box p={8} bg={bg} minH="100vh">
        <Alert status="error" borderRadius="lg" variant="left-accent">
          <AlertIcon />
          <VStack align="start" spacing={1}>
            <Text fontWeight="semibold">Failed to load dashboard</Text>
            <Text fontSize="13px">{dashError.message || "Please try again later"}</Text>
          </VStack>
          <Button variant="link" colorScheme="red" size="sm" onClick={refetchDashboard} ml="auto">Retry</Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Box px={{ base: 4, md: 6, lg: 8 }} py={6} w="full">
      <Box bg="white" borderBottomWidth="1px" borderColor="neutral.200" px={8} py={4}>
        <HStack justify="space-between" mx="auto">
          <VStack align="start" spacing={0}>
            <Heading size="lg" color="neutral.800">Welcome {dashboard?.fullName || "User"}</Heading>
            <Text fontSize="13px" color="neutral.500">
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </Text>
          </VStack>
          <Badge colorScheme={role === "ADMIN" ? "purple" : role === "RECRUITER" ? "green" : "cyan"} fontSize="11px" px={3} py={1} borderRadius="md">{role}</Badge>
        </HStack>
      </Box>

      <Box p={8} mx="auto">
        <VStack spacing={6} align="stretch">
          
          <Grid templateColumns={{ base: "1fr 1fr", md: "repeat(4, 1fr)" }} gap={{ base: 2, md: 4, lg: 8 }}>
            {(!isInterviewer) && (
              <>
                <DashboardCard label="Total Jobs" value={stats.totalJobs} subtext={`${stats.openJobs} open`} color="#00A86B" delay={0} icon={<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>} />
                <DashboardCard label="Candidates in Pipeline" value={stats.candidatesInPipeline} subtext="Active" color="#7C3AED" delay={100} icon={<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>} />
              </>
            )}
            <DashboardCard label="Interviews This Week" value={stats.interviewsThisWeek} subtext="Scheduled" color="#06B6D4" delay={200} icon={<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>} />
            <DashboardCard label="Pending Feedback" value={stats.pendingFeedback} subtext="Action needed" color="#C65D2E" delay={300} icon={<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>} />
          </Grid>

          {quickActions.length > 0 && (
            <Card borderRadius="xl" shadow="sm" borderWidth="1px" borderColor="neutral.200">
              <CardHeader pb={0}><Heading size="md" color="neutral.800">Quick Actions</Heading></CardHeader>
              <CardBody>
                <HStack spacing={3} wrap="wrap">
                  {quickActions.map((action) => (
                    <Button key={action.label} size="sm" variant="outline" color={action.color} borderColor={`${action.color}30`} _hover={{ bg: `${action.color}10`, transform: "translateY(-1px)" }} onClick={() => navigate(action.path)} borderRadius="lg" fontSize="12px" fontWeight="semibold" leftIcon={<Box width={1.5} height={1.5} borderRadius="full" bg={action.color} />} sx={{ transition: "all 0.2s ease" }}>{action.label}</Button>
                  ))}
                </HStack>
              </CardBody>
            </Card>
          )}

          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={4}>
            
            {isInterviewer ? (
              <Card borderRadius="xl" shadow="sm" borderWidth="1px" borderColor="neutral.200">
                <CardHeader><Heading size="md" color="neutral.800">Interview & Feedback Overview</Heading></CardHeader>
                <CardBody>
                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    <StatBox label="Scheduled" value={interviewStats.scheduled} color="#06B6D4" icon={<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>} />
                    <StatBox label="Completed" value={interviewStats.completed} color="#10B981" icon={<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>} />
                    <StatBox label="Pending Feedback" value={interviewStats.pendingFeedback} color="#F59E0B" icon={<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>} />
                    <StatBox label="Avg Duration" value={`${interviewStats.avgDur}m`} color="#8B5CF6" icon={<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>} />
                  </Grid>
                </CardBody>
              </Card>
            ) : (
              <Card borderRadius="xl" shadow="sm" borderWidth="1px" borderColor="neutral.200">
                <CardHeader><Heading size="md" color="neutral.800">Job Pipeline Distribution</Heading></CardHeader>
                <CardBody>
                  {jobsLoading ? <Skeleton height="200px" borderRadius="xl" /> : chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" fontSize={12} tick={{ fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                        <YAxis fontSize={12} tick={{ fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: "#fff", borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }} labelStyle={{ fontWeight: 600, color: "#0F172A" }} />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                          {chartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <Text fontSize="13px" color="neutral.500" textAlign="center" py={8}>No job data available. Create a job to see pipeline stats.</Text>
                  )}
                </CardBody>
              </Card>
            )}

            <Card borderRadius="xl" shadow="sm" borderWidth="1px" borderColor="neutral.200">
              <CardHeader><Heading size="md" color="neutral.800">Upcoming This Week</Heading></CardHeader>
              <CardBody>
                {upcomingList.length > 0 ? (
                  <VStack align="stretch" spacing={3}>
                    {upcomingList.map((item) => (
                      <HStack key={item.id} justify="space-between" py={2} borderBottomWidth="1px" borderColor="neutral.100" _last={{ borderBottomWidth: 0 }}>
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="semibold" fontSize="13px" color="neutral.800" noOfLines={1}>{item.candidate}</Text>
                          <Text fontSize="11px" color="neutral.500" noOfLines={1}>{item.job}</Text>
                        </VStack>
                        <Badge colorScheme="cyan" fontSize="10px" px={2} py={0.5} borderRadius="md">{item.date}</Badge>
                      </HStack>
                    ))}
                  </VStack>
                ) : (
                  <Text fontSize="13px" color="neutral.500" textAlign="center" py={8}>No upcoming interviews scheduled.</Text>
                )}
              </CardBody>
            </Card>

          </Grid>
        </VStack>
      </Box>

      <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </Box>
  );
}