// src/components/layout/TopNav.jsx
import {
  Box,
  HStack,
  VStack,
  Heading,
  Text,
  Button,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Badge,
  useColorModeValue,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../store/store";
import { api } from "../../api/api";

// Role-based navigation items (matches your backend routes)
const NAV_ITEMS = {
  ADMIN: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Jobs", path: "/jobs" },
    { label: "Candidates", path: "/candidates" },
    { label: "Interviews", path: "/interviews" },
    { label: "Users", path: "/users" },
  ],
  RECRUITER: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Jobs", path: "/jobs" },
    { label: "Candidates", path: "/candidates" },
    { label: "Interviews", path: "/interviews" },
  ],
  INTERVIEWER: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "My Interviews", path: "/interviews/my" },
  ],
};

const ROLE_BADGE = {
  ADMIN: { label: "Admin", color: "purple" },
  RECRUITER: { label: "Recruiter", color: "green" },
  INTERVIEWER: { label: "Interviewer", color: "cyan" },
};

export default function TopNav() {
  const { role, email } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const bg = useColorModeValue("white", "neutral.800");
  const borderColor = useColorModeValue("neutral.200", "neutral.700");

  const navItems = NAV_ITEMS[role] || [];
  const badge = ROLE_BADGE[role] || { label: role, color: "gray" };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(api.util.resetApiState());
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      as="nav"
      bg={bg}
      borderBottomWidth="1px"
      borderColor={borderColor}
      position="sticky"
      top={0}
      zIndex={100}
      shadow="sm"
      px={{ base: 4, md: 6, lg: 8 }}
      py={{ base: 2, md: 3, lg: 4 }}
      w="full"
    >
      <HStack justify="space-between" mx="auto">
        <HStack spacing={6}>
          <HStack
            spacing={2}
            cursor="pointer"
            onClick={() => navigate("/dashboard")}
            _hover={{ opacity: 0.9 }}
            transition="opacity 0.2s"
          >
            <Box
              width={8}
              height={8}
              borderRadius="lg"
              bgGradient="linear(to-br, brand.500, brand.700)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              shadow="md"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                <path
                  d="M12 2L3 7l9 5 9-5-9-5zM3 12l9 5 9-5M3 17l9 5 9-5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Box>
            <Heading
              size="md"
              color="neutral.800"
              fontWeight="bold"
              fontSize="18px"
              display={{ base: "none", sm: "block" }}
            >
              HireTrack
            </Heading>
          </HStack>

          <HStack spacing={1} display={{ base: "none", md: "flex" }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                fontSize="13px"
                fontWeight={isActive(item.path) ? "semibold" : "medium"}
                color={isActive(item.path) ? "neutral.800" : "neutral.500"}
                bg={isActive(item.path) ? "neutral.100" : "transparent"}
                _hover={{
                  bg: isActive(item.path) ? "neutral.200" : "neutral.50",
                  color: "neutral.800",
                }}
                onClick={() => navigate(item.path)}
                borderRadius="md"
                px={3}
              >
                {item.label}
              </Button>
            ))}
          </HStack>
        </HStack>

        <HStack spacing={3}>
          <Badge
            colorScheme={badge.color}
            fontSize="10px"
            px={2}
            py={1}
            borderRadius="md"
            display={{ base: "none", sm: "flex" }}
          >
            {badge.label}
          </Badge>

          <Menu>
            <MenuButton
              as={IconButton}
              variant="ghost"
              borderRadius="full"
              size="sm"
              aria-label="User menu"
            >
              <Avatar
                size="sm"
                name={email}
                bg="brand.500"
                color="white"
                fontSize="12px"
              />
            </MenuButton>
            <MenuList
              minWidth="180px"
              shadow="lg"
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="xl"
              p={1}
            >
              <VStack
                align="start"
                spacing={1}
                px={3}
                py={2}
                borderBottomWidth="1px"
                borderColor={borderColor}
              >
                <Text fontWeight="semibold" fontSize="13px" color="neutral.800">
                  {email?.split("@")[0]}
                </Text>
                <Text fontSize="11px" color="neutral.500">
                  {email}
                </Text>
              </VStack>
              <MenuItem
                fontSize="12px"
                color="red.500"
                _hover={{ bg: "red.50" }}
                onClick={handleLogout}
                fontWeight="medium"
              >
                Sign out
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </HStack>
    </Box>
  );
}
