import { useState, useEffect } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
  Button, FormControl, FormLabel, Select, Input, FormErrorMessage, VStack, useToast, Text, Box,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRescheduleInterviewMutation } from '../../api/api';

const rescheduleSchema = z.object({
  scheduledAt: z.string().min(1, 'Date & time is required'),
  durationMinutes: z.number().min(15).max(120).default(45),
  // Optional: allow changing interviewer during reschedule
  // interviewerId: z.number({ required_error: 'Interviewer is required' }),
});

export default function RescheduleInterviewModal({ isOpen, onClose, interview, candidates, interviewers }) {
  const toast = useToast();
  const [reschedule, { isLoading, error }] = useRescheduleInterviewMutation();
  
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm({
    resolver: zodResolver(rescheduleSchema),
    defaultValues: { 
      scheduledAt: '', 
      durationMinutes: 45,
      // interviewerId: ''
    }
  });

useEffect(() => {
  if (isOpen && interview?.scheduledAt) {
    // Backend returns: "2026-10-20T14:30:00" (ISO-like, local time)
    // datetime-local input needs: "2026-10-20T14:30" (no seconds)
    
    const backendDate = interview.scheduledAt;
    
    // Remove seconds if present, keep YYYY-MM-DDTHH:mm
    const inputValue = backendDate.length > 16 
      ? backendDate.slice(0, 16)  // "2026-10-20T14:30"
      : backendDate;
    
    setValue('scheduledAt', inputValue);
    setValue('durationMinutes', interview.durationMinutes || 45);
  }
}, [isOpen, interview, setValue]);

const onSubmit = async (data) => {
  if (!interview?.interviewId) return;
  
  try {
    // 🎯 datetime-local returns "YYYY-MM-DDTHH:mm"
    // Backend expects "YYYY-MM-DDTHH:mm:ss" (local time, no Z)
    
    const formattedDateTime = data.scheduledAt.includes('T') 
      ? `${data.scheduledAt}:00`  // Append seconds
      : data.scheduledAt;
    
    await reschedule({ 
      id: interview.interviewId, 
      newScheduledAt: formattedDateTime,   // ✅ Exact format match
      newDuration: Number(data.durationMinutes)
    }).unwrap();
    
    toast({ 
      title: 'Interview rescheduled successfully', 
      status: 'success', 
      duration: 3000, 
      isClosable: true 
    });
    
    reset();
    onClose();
  } catch (err) {
    const msg = err.data?.message || 'Failed to reschedule. Check for calendar conflicts.';
    toast({ 
      title: 'Error', 
      description: msg, 
      status: 'error', 
      duration: 4000, 
      isClosable: true 
    });
  }
};


  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md" isCentered scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(4px)" />
      <ModalContent borderRadius="2xl" borderWidth="1px" borderColor="neutral.200" shadow="2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader fontSize="lg" fontWeight="bold" color="neutral.800" pb={2}>
            Reschedule Interview
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody pb={6}>
            <VStack spacing={4}>
              
              {/* Read-only: Candidate */}
              <FormControl isDisabled>
                <FormLabel fontSize="13px" fontWeight="semibold">Candidate</FormLabel>
                <Input 
                  value={interview?.candidateName || ''} 
                  bg="neutral.50" 
                  borderRadius="lg"
                  placeholder="Candidate name"
                />
              </FormControl>

              {/* Read-only: Job */}
              <FormControl isDisabled>
                <FormLabel fontSize="13px" fontWeight="semibold">Job</FormLabel>
                <Input 
                  value={interview?.job || ''} 
                  bg="neutral.50" 
                  borderRadius="lg"
                  placeholder="Job title"
                />
              </FormControl>

              {/* Interviewer Select (optional: allow changing) */}
              {/* 
              <FormControl isInvalid={!!errors.interviewerId}>
                <FormLabel fontSize="13px" fontWeight="semibold">Interviewer</FormLabel>
                <Select 
                  placeholder="Select interviewer" 
                  focusBorderColor="brand.500" 
                  bg="neutral.50" 
                  borderRadius="lg"
                  defaultValue={interview?.interviewerId}
                  onChange={(e) => setValue('interviewerId', e.target.value ? parseInt(e.target.value) : '')}
                >
                  {interviewers?.map(i => (
                    <option key={i.id} value={i.id}>{i.fullName} ({i.email})</option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.interviewerId?.message}</FormErrorMessage>
              </FormControl>
              */}

              {/* Date & Time */}
              <FormControl isInvalid={!!errors.scheduledAt}>
                <FormLabel fontSize="13px" fontWeight="semibold">New Date & Time</FormLabel>
                <Input 
                  type="datetime-local" 
                  focusBorderColor="brand.500" 
                  bg="neutral.50" 
                  borderRadius="lg"
                  {...register('scheduledAt')}
                />
                <FormErrorMessage>{errors.scheduledAt?.message}</FormErrorMessage>
              </FormControl>

              {/* Duration */}
              <FormControl>
                <FormLabel fontSize="13px" fontWeight="semibold">Duration (minutes)</FormLabel>
                <Select 
                  defaultValue={interview?.durationMinutes || 45}
                  focusBorderColor="brand.500" 
                  bg="neutral.50" 
                  borderRadius="lg"
                  onChange={(e) => setValue('durationMinutes', parseInt(e.target.value))}
                >
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                </Select>
              </FormControl>

              {/* Conflict Warning */}
              {error?.data?.message?.includes('booked') && (
                <Alert status="warning" borderRadius="lg" fontSize="12px">
                  <AlertIcon />
                  {error.data.message}
                </Alert>
              )}

            </VStack>
          </ModalBody>

          <ModalFooter bg="neutral.50" borderRadius="0 0 2xl 2xl" borderTop="1px" borderColor="neutral.200" px={6} py={4}>
            <Button variant="ghost" mr={3} onClick={handleClose} isDisabled={isLoading} borderRadius="xl">Cancel</Button>
            <Button 
              type="submit" 
              bgGradient="linear(to-br, brand.500, brand.700)" 
              color="white" 
              isLoading={isLoading} 
              loadingText="Rescheduling..." 
              borderRadius="xl"
              _hover={{ transform: 'translateY(-1px)', shadow: 'md' }}
              transition="all 0.2s ease"
            >
              Confirm Reschedule
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}