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
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spinner,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { useGetAllJobQuery, useUpdateJobStatusMutation } from "../api/api";
import StatusBadge from "../components/jobs/StatusBadge";
import CreateJobModal from "../components/jobs/CreateJobModal";
import EditJobModal from "../components/jobs/EditJobModal";
import Pagination from "../components/common/Pagination";

export default function JobsPage() {
  const { role } = useSelector((state) => state.auth);
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editModal, setEditModal] = useState({ open: false, job: null });

  const { data, isLoading, error, refetch } = useGetAllJobQuery({
    page,
    size: 10,
    status: statusFilter || undefined,
    search: search || undefined,
  });

  const [updateStatus] = useUpdateJobStatusMutation();

  const bg = useColorModeValue("neutral.50", "neutral.900");
  const cardBg = useColorModeValue("white", "neutral.800");

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await updateStatus({ id: jobId, status: newStatus }).unwrap();
      refetch(); // ✅ Instantly refresh table after status change
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  if (isLoading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg={bg}>
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
            <Text fontWeight="semibold">Failed to load jobs</Text>
            <Text fontSize="13px">{error.message || "Please try again later"}</Text>
          </VStack>
          <Button variant="link" colorScheme="red" size="sm" onClick={refetch} ml="auto">Retry</Button>
        </Alert>
      </Box>
    );
  }

  const jobs = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  return (
    <Box minH="100vh" px={{ base: 4, md: 6, lg: 8 }} py={6} w="full">
      {/* Header */}
      <Box borderBottomWidth="1px" borderColor="neutral.200" py={4}>
        <HStack justify="space-between" px={8} mx="auto">
          <VStack align="start" spacing={0}>
            <Heading size="lg" color="neutral.800">Jobs</Heading>
            <Text fontSize="13px" color="neutral.500">
              {totalElements} total · {jobs.filter((j) => j.status === "OPEN").length} open
            </Text>
          </VStack>
          {(role === "ADMIN" || role === "RECRUITER") && (
            <Button colorScheme="brand" size="md" leftIcon={<AddIcon />} onClick={() => setIsCreateOpen(true)}>
              Create Job
            </Button>
          )}
        </HStack>
      </Box>

      <Box p={2} mx="auto">
        <VStack spacing={6} align="stretch">
          
          {/* Filters */}
          <Card borderRadius="xl" shadow="sm" borderWidth="1px" borderColor="neutral.200" bg={cardBg}>
            <CardBody>
              <HStack spacing={4} wrap="wrap">
                <Input
                  placeholder="Search jobs..."
                  size="sm"
                  width={{ base: "100%", md: "200px" }}
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                  focusBorderColor="brand.500"
                />
                <Select
                  placeholder="All statuses"
                  size="sm"
                  width={{ base: "100%", md: "150px" }}
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
                  focusBorderColor="brand.500"
                >
                  <option value="OPEN">Open</option>
                  <option value="ON_HOLD">On Hold</option>
                  <option value="CLOSED">Closed</option>
                </Select>
                {(search || statusFilter) && (
                  <Button size="sm" variant="ghost" color="neutral.500" onClick={() => { setSearch(""); setStatusFilter(""); setPage(0); }}>
                    Clear
                  </Button>
                )}
              </HStack>
            </CardBody>
          </Card>

          {/* Table */}
          <Card borderRadius="xl" shadow="sm" borderWidth="1px" borderColor="neutral.200" bg={cardBg} overflow="hidden">
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead bg="neutral.50">
                  <Tr>
                    <Th fontSize="12px" fontWeight="semibold" color="neutral.500" textTransform="uppercase">Job Title</Th>
                    <Th fontSize="12px" fontWeight="semibold" color="neutral.500" textTransform="uppercase">Department</Th>
                    <Th fontSize="12px" fontWeight="semibold" color="neutral.500" textTransform="uppercase">Status</Th>
                    <Th fontSize="12px" fontWeight="semibold" color="neutral.500" textTransform="uppercase">Created Date</Th>
                    <Th fontSize="12px" fontWeight="semibold" color="neutral.500" textTransform="uppercase">Created by</Th>
                    <Th fontSize="12px" fontWeight="semibold" color="neutral.500" textTransform="uppercase" textAlign="right">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {jobs.length === 0 ? (
                    <Tr>
                      {/* ✅ Fixed: colSpan=6 to match header count */}
                      <Td colSpan={6} textAlign="center" py={8} color="neutral.500">
                        No jobs found. Try adjusting your filters.
                      </Td>
                    </Tr>
                  ) : (
                    jobs.map((job) => (
                      <Tr key={job.id} _hover={{ bg: "neutral.50" }}>
                        <Td>
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="semibold" color="neutral.800" fontSize="14px">{job.title}</Text>
                            <Text fontSize="12px" color="neutral.500" noOfLines={1}>{job.description}</Text>
                          </VStack>
                        </Td>
                        <Td><Text fontSize="13px" color="neutral.700">{job.department}</Text></Td>
                        <Td>
                          {role === "ADMIN" || role === "RECRUITER" ? (
                            <Menu closeOnSelect>
                              <MenuButton as={Button} variant="ghost" size="sm" p={0}>
                                <StatusBadge status={job.status} />
                              </MenuButton>
                              <MenuList minWidth="150px" shadow="lg" borderColor="neutral.200">
                                <MenuItem fontSize="12px" onClick={() => handleStatusChange(job.id, "OPEN")} isDisabled={job.status === "OPEN"} closeOnSelect>
                                  <StatusBadge status="OPEN" size="xs" />
                                </MenuItem>
                                <MenuItem fontSize="12px" onClick={() => handleStatusChange(job.id, "ON_HOLD")} isDisabled={job.status === "ON_HOLD"} closeOnSelect>
                                  <StatusBadge status="ON_HOLD" size="xs" />
                                </MenuItem>
                                <MenuItem fontSize="12px" color="red.500" onClick={() => handleStatusChange(job.id, "CLOSED")} isDisabled={job.status === "CLOSED"} closeOnSelect>
                                  <StatusBadge status="CLOSED" size="xs" />
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          ) : (
                            <StatusBadge status={job.status} />
                          )}
                        </Td>
                        <Td><Text fontSize="13px" color="neutral.700">{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "-"}</Text></Td>
                        <Td><Text fontSize="13px" color="neutral.700">{job.createdByName || "-"}</Text></Td>
                        <Td textAlign="right">
                          <HStack justify="end" spacing={1}>
                            {(role === "ADMIN" || role === "RECRUITER") && (
                              <IconButton
                                icon={<EditIcon />}
                                size="sm"
                                variant="ghost"
                                aria-label="Edit job"
                                onClick={() => setEditModal({ open: true, job })}
                              />
                            )}
                          </HStack>
                        </Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
            </Box>

            {/* Pagination */}
            {totalPages > 1 && <Divider />}
            {totalPages > 1 && (
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            )}
          </Card>
        </VStack>
      </Box>

      {/* ✅ Modals moved outside Card to prevent overflow/z-index clipping */}
      <CreateJobModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <EditJobModal 
        isOpen={editModal.open} 
        onClose={() => setEditModal({ open: false, job: null })}
        job={editModal.job} 
      />
    </Box>
  );
}