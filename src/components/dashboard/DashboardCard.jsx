import { Card, CardBody, HStack, Icon, Stat, StatLabel, StatNumber, useColorModeValue, Badge, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";


function useCountUp(target, duration = 800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}
export default function DashboardCard({ label, value, subtext, icon, color, delay = 0 }) {
  const count = useCountUp(value);
  const bg = useColorModeValue('white', 'neutral.800');
  
  return (
    <Card 
      bg={bg} 
      borderRadius="xl" 
      shadow="sm" 
      borderWidth="1px" 
      borderColor="neutral.200"
      sx={{ animation: `fadeInUp 0.5s ease-out ${delay}ms both` }}
    >
      <CardBody>
        <HStack justify="space-between" mb={3}>
          <Box 
            width={10} 
            height={10} 
            borderRadius="xl" 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
            bg={`${color}10`}
            color={color}
          >
            {icon}
          </Box>
          {subtext && (
            <Badge colorScheme={color.replace('#', '')} fontSize="11px" px={2} py={0.5} borderRadius="md">
              {subtext}
            </Badge>
          )}
        </HStack>
        <Stat>
          <StatNumber fontSize="28px" fontWeight="bold" color="neutral.800">
            {count.toLocaleString()}
          </StatNumber>
          <StatLabel fontSize="13px" fontWeight="medium" color="neutral.500">
            {label}
          </StatLabel>
        </Stat>
      </CardBody>
    </Card>
  );
}