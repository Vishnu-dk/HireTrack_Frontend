import { HStack, Button, Text } from "@chakra-ui/react";

export default function Pagination({ page, totalPages, onPageChange }) {
  return (
    <HStack spacing={1} justify="center" py={4}>
      <Button size="sm" variant="outline" onClick={() => onPageChange(page - 1)} isDisabled={page === 0}>Previous</Button>
      <Text fontSize="12px" color="neutral.500">Page {page + 1} of {totalPages}</Text>
      <Button size="sm" variant="outline" onClick={() => onPageChange(page + 1)} isDisabled={page >= totalPages - 1}>Next</Button>
    </HStack>
  );
}