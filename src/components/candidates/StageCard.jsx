import { Card, Text } from "@chakra-ui/react";

export default function StageCard({ label, count, color, isActive, onClick }) {
  return (
    <Card
      borderRadius="xl"
      p={3}
      textAlign="center"
      cursor="pointer"
      transition="all 0.2s ease"
      _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
      bg={isActive ? `${color}08` : 'white'}
      borderWidth={isActive ? '2px' : '1px'}
      borderColor={isActive ? `${color}30` : 'neutral.200'}
      onClick={onClick}  
      sx={{ backdropFilter: 'blur(8px)' }}
    >
      <Text fontSize="20px" fontWeight="bold" color={color} fontFamily="mono">{count}</Text>
      <Text fontSize="9px" color="neutral.500" mt={0.5} textTransform="uppercase" letterSpacing="wide">{label}</Text>
    </Card>
  );
}