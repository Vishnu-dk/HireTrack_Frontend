import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useLoginMutation } from "../api/api"; // ← Import from root api.js

const DEMO_CREDS = {
  "admin@test.com": {
    password: "password123",
    label: "Admin",
    color: "#7C3AED",
  },
  "recruiter@test.com": {
    password: "password123",
    label: "Recruiter",
    color: "#00A86B",
  },
  "interviewer@test.com": {
    password: "password123",
    label: "Interviewer",
    color: "#06B6D4",
  },
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const [login, { isLoading, error: apiError }] = useLoginMutation();
  const navigate = useNavigate();

  const getErrorMessage = () => {
    if (!apiError) return null;

    if (apiError.status === 400) {
      return (
        apiError.data?.message || apiError.data?.details?.[0] || "Invalid input"
      );
    }
    if (apiError.status === 401) {
      return "Invalid email or password";
    }
    if (apiError.status === 500) {
      return "Server error. Please try again later.";
    }
    return apiError.error || "Login failed. Please check your credentials.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    if (!email.trim()) {
      setValidationError("Email is required");
      return;
    }
    if (!password) {
      setValidationError("Password is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError("Please enter a valid email address");
      return;
    }

    const result = await login({ email, password });

    if (!result.error) {
      navigate("/dashboard");
    }
  };

  const quickFill = (emailKey) => {
    const cred = DEMO_CREDS[emailKey];
    if (cred) {
      setEmail(emailKey);
      setPassword(cred.password);
      setValidationError("");
    }
  };

  const displayError = validationError || getErrorMessage();

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="neutral.50"
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="-12%"
        left="-8%"
        width="520px"
        height="520px"
        borderRadius="full"
        pointerEvents="none"
        bgGradient="radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 65%)"
        opacity={0.6}
      />
      <Box
        position="absolute"
        bottom="-10%"
        right="-6%"
        width="480px"
        height="480px"
        borderRadius="full"
        pointerEvents="none"
        bgGradient="radial-gradient(circle, rgba(0,168,107,0.12) 0%, transparent 65%)"
        opacity={0.5}
      />
      <Box
        position="absolute"
        top="45%"
        right="20%"
        width="320px"
        height="320px"
        borderRadius="full"
        pointerEvents="none"
        bgGradient="radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 65%)"
        opacity={0.4}
      />
      <Box
        position="absolute"
        inset={0}
        pointerEvents="none"
        opacity={0.022}
        bgImage="radial-gradient(circle, #0F172A 1px, transparent 1px)"
        bgSize="28px 28px"
      />

      <Box
        width="full"
        maxWidth="420px"
        px={5}
        position="relative"
        animation="fadeInUp 0.5s ease-out"
      >
        <VStack spacing={5} mb={8} align="center">
          <HStack spacing={2.5}>
            <Box
              width={10}
              height={10}
              borderRadius="xl"
              bgGradient="linear(to-br, brand.500, brand.700)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              shadow="lg"
              sx={{ boxShadow: "0 6px 20px rgba(0,168,107,0.35)" }}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path
                  d="M12 2L3 7l9 5 9-5-9-5zM3 12l9 5 9-5M3 17l9 5 9-5"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Box>
            <Heading
              size="lg"
              color="neutral.800"
              fontWeight="bold"
              fontSize="22px"
              letterSpacing="tight"
            >
              HireTrack
            </Heading>
          </HStack>
          <Heading
            size="xl"
            color="neutral.800"
            fontWeight="bold"
            fontSize="28px"
            lineHeight="tight"
          >
            Welcome back
          </Heading>
          <Text fontSize="15px" color="neutral.500">
            Your Fastest hiring workspace awaits
          </Text>
        </VStack>

        <Box
          bg="white"
          borderRadius="22px"
          p={7}
          shadow="md"
          borderWidth="1px"
          borderColor="neutral.200"
          sx={{
            backdropFilter: "blur(12px)",
            background: "rgba(255, 255, 255, 0.92)",
          }}
        >
          <Box
            mb={5}
            p={3.5}
            borderRadius="14px"
            bg="rgba(124,58,237,0.05)"
            borderWidth="1px"
            borderColor="rgba(124,58,237,0.12)"
          >
            <Text
              fontSize="11px"
              fontWeight="semibold"
              color="purple.600"
              textTransform="uppercase"
              letterSpacing="widest"
              mb={2.5}
            >
              Demo Access
            </Text>
            <HStack spacing={1.5} wrap="wrap">
              {Object.entries(DEMO_CREDS).map(([emailKey, cred]) => (
                <Button
                  key={emailKey}
                  type="button"
                  size="xs"
                  variant="outline"
                  onClick={() => quickFill(emailKey)}
                  fontWeight="semibold"
                  fontSize="11px"
                  px={2.5}
                  py={1.5}
                  borderRadius="lg"
                  color={cred.color}
                  borderColor={`${cred.color}25`}
                  _hover={{
                    transform: "scale(1.02)",
                    bg: `${cred.color}12`,
                    transition: "all 0.2s ease",
                  }}
                  leftIcon={
                    <Box
                      width={1.5}
                      height={1.5}
                      borderRadius="full"
                      bg={cred.color}
                    />
                  }
                >
                  {cred.label}
                </Button>
              ))}
            </HStack>
            <Text fontSize="10px" color="neutral.400" mt={2}>
              Click a role to autofill credentials
            </Text>
          </Box>

          <form onSubmit={handleSubmit} noValidate>
            <VStack spacing={4}>
              <FormControl
                isInvalid={!!validationError && !password && !apiError}
              >
                <FormLabel
                  fontSize="13px"
                  fontWeight="semibold"
                  color="neutral.800"
                  mb={1.5}
                >
                  Email address
                </FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationError) setValidationError("");
                  }}
                  placeholder="you@company.com"
                  required
                  size="md"
                  focusBorderColor="brand.500"
                  _placeholder={{ color: "neutral.400" }}
                />
              </FormControl>

              <FormControl isInvalid={!!validationError && email && !apiError}>
                <FormLabel
                  fontSize="13px"
                  fontWeight="semibold"
                  color="neutral.800"
                  mb={1.5}
                >
                  Password
                </FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationError) setValidationError("");
                  }}
                  placeholder="••••••••"
                  required
                  size="md"
                  focusBorderColor="brand.500"
                  _placeholder={{ color: "neutral.400" }}
                />
              </FormControl>

              {displayError && (
                <Alert
                  status="error"
                  variant="left-accent"
                  borderRadius="xl"
                  fontSize="13px"
                  sx={{
                    bg: "rgba(225,29,72,0.07)",
                    borderColor: "rgba(225,29,72,0.18)",
                    animation: "shake 0.4s ease-in-out",
                  }}
                >
                  <AlertIcon />
                  {displayError}
                </Alert>
              )}

              <Button
                type="submit"
                isLoading={isLoading}
                loadingText="Authenticating…"
                width="full"
                py={3.5}
                borderRadius="13px"
                fontSize="14px"
                fontWeight="bold"
                color="white"
                bgGradient={
                  isLoading ? "none" : "linear(to-br, brand.500, brand.700)"
                }
                bg={isLoading ? "brand.500" : undefined}
                opacity={isLoading ? 0.85 : 1}
                _hover={
                  !isLoading
                    ? { transform: "translateY(-1px)", shadow: "lg" }
                    : {}
                }
                transition="all 0.2s ease"
                sx={
                  !isLoading
                    ? { boxShadow: "0 6px 20px rgba(0,168,107,0.32)" }
                    : {}
                }
              >
                Sign in to HireTrack →
              </Button>
            </VStack>
          </form>
        </Box>
      </Box>

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 
          0%, 100% { transform: translateX(0); } 
          25% { transform: translateX(-8px); } 
          75% { transform: translateX(8px); } 
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </Box>
  );
}
