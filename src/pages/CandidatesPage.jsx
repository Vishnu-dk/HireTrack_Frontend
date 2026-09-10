// src/pages/CandidatesPage.jsx
import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Input,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  useColorModeValue,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import {
  useGetCandidatesQuery,
  useUpdateCandidateStatusMutation,
  useGetAllJobQuery,
} from "../api/api";
import AddCandidateModal from "../components/candidates/AddCandidateModal";
import UploadResumeModal from "../components/candidates/UploadResumeModal";
import { CANDIDATE_STATUS_CONFIG } from "../components/candidates/CandidateStatusBadge";
import StageCard from "../components/candidates/StageCard";
import CandidateCard from "../components/candidates/CandidateCard";

export default function CandidatesPage() {
  const { role } = useSelector((state) => state.auth);
  const isEditable = role === "ADMIN" || role === "RECRUITER";

  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [uploadModal, setUploadModal] = useState({
    open: false,
    candidate: null,
  });

  const {
    data: candidates,
    isLoading,
    error,
    refetch,
  } = useGetCandidatesQuery({
    page,
    size: 20,
    status: statusFilter || undefined,
    search: search || undefined,
  });

  const { data: jobs } = useGetAllJobQuery({ size: 100 });
  const [updateStatus] = useUpdateCandidateStatusMutation();

  const bg = useColorModeValue("neutral.50", "neutral.900");
  const cardBg = useColorModeValue("white", "neutral.800");
  const borderColor = useColorModeValue("neutral.200", "neutral.700");

  const handleStatusChange = useCallback(
    async (candidateId, newStatus) => {
      try {
        await updateStatus({ id: candidateId, status: newStatus }).unwrap();
      } catch (err) {
        console.error("Failed to update status:", err);
      }
    },
    [updateStatus],
  );

  const totalElements = candidates?.totalElements || 0;

  const stageCounts = {
    ALL: totalElements || 0,
    ...Object.keys(CANDIDATE_STATUS_CONFIG).reduce((acc, status) => {
      acc[status] =
        candidates?.content?.filter((c) => c.status === status).length || 0;
      return acc;
    }, {}),
  };

  const filtered = (candidates?.content || []).filter(
    (c) =>
      (!statusFilter || c.status === statusFilter) &&
      (!search ||
        c.fullName.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())),
  );

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
            <Text fontWeight="semibold">Failed to load candidates</Text>
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

  return (
    <Box minH="100vh" px={{ base: 4, md: 6, lg: 8 }} py={6} w="full">
      {/* Header */}
      <Box borderBottomWidth="1px" borderColor={borderColor} px={8} py={4}>
        <HStack justify="space-between" mx="auto" w="full">
          <VStack align="start" spacing={0}>
            <Heading size="lg" color="neutral.800">
              Candidate Pipeline
            </Heading>
            <Text fontSize="13px" color="neutral.500">
              {totalElements} candidates across{" "}
              {Object.keys(CANDIDATE_STATUS_CONFIG).length} stages
            </Text>
          </VStack>
          <HStack spacing={2}>
            {isEditable && (
              <>
                <Button
                  colorScheme="brand"
                  size="sm"
                  leftIcon={<AddIcon />}
                  onClick={() => setAddModalOpen(true)}
                  borderRadius="xl"
                >
                  Add Candidate
                </Button>
              </>
            )}
          </HStack>
        </HStack>
      </Box>

      <Box p={8} alignItems="center" mx="auto">
        <VStack spacing={6} align="stretch">
          <Box
            display="grid"
            gridTemplateColumns={{
              base: "repeat(3, 1fr)",
              md: "repeat(6, 1fr)",
            }}
            gap={2}
          >
            {[
              ["ALL", { label: "All Candidates", color: "blue.500" }],
              ...Object.entries(CANDIDATE_STATUS_CONFIG),
            ].map(([key, config]) => (
              <StageCard
                key={key}
                label={config.label}
                count={stageCounts[key] || 0}
                color={config.color}
              />
            ))}
          </Box>

          {/* Search + Filter Pills */}
          <Card
            borderRadius="2xl"
            shadow="sm"
            borderWidth="1px"
            borderColor={borderColor}
            bg={cardBg}
          >
            <CardBody>
              <HStack spacing={4} wrap="wrap">
                <Box flex={1} minW="200px" position="relative">
                  <Input
                    placeholder="Search candidates..."
                    size="sm"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
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
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                  </Box>
                </Box>

                <HStack spacing={1} wrap="wrap">
                  <Button
                    size="sm"
                    variant={statusFilter === "" ? "solid" : "ghost"}
                    colorScheme={statusFilter === "" ? "neutral" : undefined}
                    bg={statusFilter === "" ? "neutral.800" : "transparent"}
                    color={statusFilter === "" ? "white" : "neutral.600"}
                    borderRadius="xl"
                    fontSize="12px"
                    onClick={() => {
                      setStatusFilter("");
                      setPage(0);
                    }}
                  >
                    All
                  </Button>
                  {Object.entries(CANDIDATE_STATUS_CONFIG).map(
                    ([key, config]) => (
                      <Button
                        key={key}
                        size="sm"
                        variant={statusFilter === key ? "solid" : "ghost"}
                        colorScheme={
                          statusFilter === key ? config.color : undefined
                        }
                        bg={
                          statusFilter === key
                            ? `${config.color}14`
                            : "transparent"
                        }
                        color={
                          statusFilter === key ? config.color : "neutral.600"
                        }
                        borderColor={
                          statusFilter === key
                            ? `${config.color}25`
                            : "transparent"
                        }
                        borderRadius="xl"
                        fontSize="12px"
                        onClick={() => {
                          setStatusFilter(statusFilter === key ? "" : key);
                          setPage(0);
                        }}
                      >
                        {config.label}
                      </Button>
                    ),
                  )}
                </HStack>

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
                    borderRadius="xl"
                  >
                    Clear
                  </Button>
                )}
              </HStack>
            </CardBody>
          </Card>

          {/* Candidates Grid */}
          {filtered.length === 0 ? (
            <Card
              borderRadius="2xl"
              shadow="sm"
              borderWidth="1px"
              borderColor={borderColor}
              bg={cardBg}
            >
              <CardBody textAlign="center" py={12}>
                <Text fontSize="14px" color="neutral.500">
                  {search || statusFilter
                    ? "No candidates match your filters."
                    : "No candidates yet. Add your first one to get started."}
                </Text>
                {isEditable && !search && !statusFilter && (
                  <Button
                    mt={4}
                    colorScheme="brand"
                    size="sm"
                    leftIcon={<AddIcon />}
                    onClick={() => setAddModalOpen(true)}
                    borderRadius="xl"
                  >
                    Add Candidate
                  </Button>
                )}
              </CardBody>
            </Card>
          ) : (
            <Box
              display="grid"
              gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
              gap={3}
            >
              {filtered.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  onSelect={(c) => {}}
                  onUpload={(c) => setUploadModal({ open: true, candidate: c })}
                  isEditable={isEditable}
                  handleStatusChange={handleStatusChange}
                />
              ))}
            </Box>
          )}
        </VStack>
      </Box>

      {/* Modals */}
      <AddCandidateModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        jobs={jobs}
      />
      <UploadResumeModal
        isOpen={uploadModal.open}
        onClose={() => setUploadModal({ open: false, candidate: null })}
        candidateId={uploadModal.candidate?.id}
        candidateName={uploadModal.candidate?.fullName}
      />
    </Box>
  );
}
