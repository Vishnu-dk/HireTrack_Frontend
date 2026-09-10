import { Box, Card, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import CandidateStatusMenu from "./CandidateStatusMenu";
import { LuUpload } from "react-icons/lu";

export default function CandidateCard({
  candidate,
  onSelect,
  onUpload,
  isEditable,
  handleStatusChange,
}) {
  return (
    <Card
      borderRadius="2xl"
      p={5}
      cursor="pointer"
      transition="all 0.2s ease"
      _hover={{
        transform: "translateY(-3px)",
        shadow: "lg",
        borderColor: "brand.300",
      }}
      borderWidth="1px"
      borderColor="neutral.200"
      bg="white"
      onClick={() => onSelect(candidate)}
      sx={{ backdropFilter: "blur(8px)" }}
    >
      <HStack spacing={3} mb={4} align="start">
        <VStack align="start" spacing={0} flex={1} minW={0}>
          <HStack justify="space-between" w="full">
            <Text
              fontWeight="bold"
              fontSize="14px"
              color="neutral.800"
              noOfLines={1}
            >
              {candidate.fullName}
            </Text>
            <CandidateStatusMenu
              candidateId={candidate.id}
              currentStatus={candidate.status}
              resumeFileName={candidate.resumeFileName}
              onStatusChange={handleStatusChange}
              isEditable={isEditable}
            />
          </HStack>
          <Text fontSize="12px" color="neutral.500" noOfLines={1}>
            {candidate.jobTitle || "Unassigned"} ·{" "}
            {candidate.experienceYears || 0}y exp
          </Text>
          <Text fontSize="12px" color="neutral.500" noOfLines={1}>
            Added by:{candidate.addedByName}
          </Text>
        </VStack>
      </HStack>

      <HStack
        justify="space-between"
        pt={3}
        borderTopWidth="1px"
        borderColor="neutral.100"
      >
        <HStack spacing={1.5}>
          <Box
            width={1.5}
            height={1.5}
            borderRadius="full"
            bg={candidate.resumeFileName ? "green.500" : "orange.400"}
          />
          <Text fontSize="10px" color="neutral.500" fontFamily="mono">
            {candidate.resumeFileName
              ? `📄 ${candidate.resumeFileName}`
              : "No resume"}
          </Text>
        </HStack>

        <HStack spacing={3}>
          {isEditable && (
            <IconButton
              size="xs"
              icon={<LuUpload />}
              variant="outline"
              aria-label="Upload resume"
              onClick={(e) => {
                e.stopPropagation();
                onUpload(candidate);
              }}
              borderRadius="lg"
            />
          )}
        </HStack>
      </HStack>
    </Card>
  );
}
