import { useState, useEffect } from "react";
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
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
} from "@chakra-ui/react";
import { useGetAllrecruiterQuery, useGetAllinterviewersQuery } from "../api/api";
import Pagination from "../components/common/Pagination";

export default function UserPage() {
  const { role } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(0);

  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  const handleTabChange = (index) => {
    setActiveTab(index);
    setPage(0);
    setStatusFilter("");
    setSearch("");
    setDebouncedSearch("");
  };

  const { 
    data: recruiterData, 
    isLoading: isLoadingRecruiters, 
    error: recruiterError 
  } = useGetAllrecruiterQuery({
    page,
    size: 10,
    status: statusFilter || undefined,
    search: debouncedSearch || undefined,
  }, { skip: activeTab !== 0 });

  const { 
    data: interviewerData, 
    isLoading: isLoadingInterviewers, 
    error: interviewerError 
  } = useGetAllinterviewersQuery({
    page,
    size: 10,
    status: statusFilter || undefined,
    search: debouncedSearch || undefined,
  }, { skip: activeTab !== 1 });

  const bg = useColorModeValue("neutral.50", "neutral.900");
  const cardBg = useColorModeValue("white", "neutral.800");

  const currentData = activeTab === 0 ? recruiterData : interviewerData;
  const isLoading = activeTab === 0 ? isLoadingRecruiters : isLoadingInterviewers;
  const currentError = activeTab === 0 ? recruiterError : interviewerError;

  const userList = currentData?.content || [];
  const totalPages = currentData?.totalPages || 0;
  const totalElements = currentData?.totalElements || 0;

  return (
    <Box minH="100vh" px={{ base: 4, md: 6, lg: 8 }} py={6} w="full" bg={bg}>
      {/* Header */}
      <Box borderBottomWidth="1px" borderColor="neutral.200" py={4} mb={6}>
        <HStack justify="space-between" px={4}>
          <VStack align="start" spacing={0}>
            <Heading size="lg" color="neutral.800">
              User Management
            </Heading>
            <Text fontSize="13px" color="neutral.500">
              {totalElements} total records
            </Text>
          </VStack>
        </HStack>
      </Box>

      {/* Tabs Switcher */}
      <Tabs index={activeTab} onChange={handleTabChange} variant="enclosed" colorScheme="brand">
        <TabList mb={4}>
          <Tab fontWeight="semibold">Recruiters</Tab>
          <Tab fontWeight="semibold">Interviewers</Tab>
        </TabList>

        {/* Search & Filter Bar */}
        <Card borderRadius="xl" shadow="sm" borderWidth="1px" borderColor="neutral.200" bg={cardBg} mb={6}>
          <CardBody>
            <HStack spacing={4} wrap="wrap">
              <Input
              borderRadius="lg" 
                placeholder={activeTab === 0 ? "Search recruiters..." : "Search interviewers..."}
                size="sm"
                width={{ base: "100%", md: "250px" }}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                focusBorderColor="brand.500"
              />

              <Select
              borderRadius="lg" 
                placeholder="All statuses"
                size="sm"
                width={{ base: "100%", md: "150px" }}
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
                focusBorderColor="brand.500"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </Select>

              {(search || statusFilter) && (
                <Button
                  size="sm"
                  variant="ghost"
                  color="neutral.500"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("");
                    setPage(0);
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </HStack>
          </CardBody>
        </Card>

        {/* Global Loading / Error State Management */}
        {isLoading ? (
          <Box py={20} display="flex" justifyContent="center">
            <Spinner size="xl" color="brand.500" />
          </Box>
        ) : currentError ? (
          <Alert status="error" borderRadius="lg" variant="left-accent">
            <AlertIcon />
            <Text fontWeight="semibold">Failed to load details. Please try again later.</Text>
          </Alert>
        ) : (
          <TabPanels>
            {/* Both panels share the identical structural table since the schemas are identical */}
            {[0, 1].map((tabIndex) => (
              <TabPanel key={tabIndex} p={0}>
                <Card borderRadius="xl" shadow="sm" borderWidth="1px" borderColor="neutral.200" bg={cardBg} overflow="hidden">
                  <Box overflowX="auto">
                    <Table variant="simple">
                      <Thead bg="neutral.50">
                        <Tr>
                          <Th fontSize="12px" color="neutral.500">Full Name</Th>
                          <Th fontSize="12px" color="neutral.500">Email</Th>
                          <Th fontSize="12px" color="neutral.500">Status</Th>
                          <Th fontSize="12px" color="neutral.500">Created Date</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {userList.length === 0 ? (
                          <Tr>
                            <Td colSpan={4} textAlign="center" py={8} color="neutral.500">
                              No {tabIndex === 0 ? "recruiters" : "interviewers"} found.
                            </Td>
                          </Tr>
                        ) : (
                          userList.map((user) => (
                            <Tr key={user.id} _hover={{ bg: "neutral.50" }}>
                              <Td fontWeight="semibold" color="neutral.800" fontSize="14px">
                                {user.fullName}
                              </Td>
                              <Td fontSize="13px" color="neutral.700">
                                {user.email}
                              </Td>
                              <Td>
                                <Badge colorScheme={user.isActive ? "green" : "red"} variant="subtle" borderRadius="full" px={2}>
                                  {user.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </Td>
                              <Td fontSize="13px" color="neutral.600">
                                {new Date(user.createdAt).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </Td>
                            </Tr>
                          ))
                        )}
                      </Tbody>
                    </Table>
                  </Box>
                </Card>
              </TabPanel>
            ))}
          </TabPanels>
        )}

        {/* Shared Pagination Footer */}
        {!isLoading && totalPages > 1 && (
          <Box display="flex" justifyContent="flex-end" mt={4}>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </Box>
        )}
      </Tabs>
    </Box>
  );
}
