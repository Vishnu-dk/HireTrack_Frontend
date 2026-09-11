import { Box, HStack, Text } from "@chakra-ui/react";

export default function StatBox({ label, value, color, icon }) {
  return (
    <Box bg="neutral.50" borderRadius="xl" p={3} borderLeft={`3px solid ${color}`}>

      <HStack justify="space-between" mb={1}>
        <Text fontSize="12px" fontWeight="medium" color="neutral.500">{label}</Text>
        <Box color={color}>{icon}</Box>
      </HStack>
      <Text fontSize="20px" fontWeight="bold" color="neutral.800">{value}</Text>
    </Box>
  );
}