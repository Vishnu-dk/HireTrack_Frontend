import { useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Button, FormControl, FormLabel, Select, Input, FormErrorMessage, VStack, useToast, Alert, AlertIcon
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useScheduleInterviewMutation } from '../../api/api';

const interviewSchema = z.object({
  candidateId: z.number({ required_error: 'Candidate is required' }),
  interviewerId: z.number({ required_error: 'Interviewer is required' }),
  scheduledAt: z.string().min(1, 'Date & time is required'),
  durationMinutes: z.number().min(15).max(120).default(45),
});

export default function ScheduleInterviewModal({ isOpen, onClose, candidates, interviewers }) {
  const toast = useToast();
  const [scheduleInterview, { isLoading, error }] = useScheduleInterviewMutation();
  
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm({
    resolver: zodResolver(interviewSchema),
    defaultValues: { candidateId: '', interviewerId: '', scheduledAt: '', durationMinutes: 45 }
  });

  const onSubmit = async (data) => {
    try {
      await scheduleInterview({ ...data, scheduledAt: new Date(data.scheduledAt).toISOString() }).unwrap();
      toast({ title: 'Interview scheduled successfully', status: 'success', duration: 3000, isClosable: true });
      reset();
      onClose();
    } catch (err) {
      const msg = err.data?.message || 'Failed to schedule interview. Check for calendar conflicts.';
      toast({ title: 'Error', description: msg, status: 'error', duration: 4000, isClosable: true });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { reset(); onClose(); }} size="md" isCentered>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(4px)" />
      <ModalContent borderRadius="2xl" borderWidth="1px" borderColor="neutral.200" shadow="2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader fontSize="lg" fontWeight="bold" color="neutral.800" pb={2}>Schedule Interview</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              
              {/* Candidate Select */}
              <FormControl isInvalid={!!errors.candidateId}>
                <FormLabel fontSize="13px" fontWeight="semibold">Candidate</FormLabel>
                <Select 
                  placeholder="Select candidate" 
                  focusBorderColor="brand.500" 
                  bg="neutral.50" 
                  borderRadius="lg"
                  onChange={(e) => setValue('candidateId', e.target.value ? parseInt(e.target.value) : '')}
                >
                  {candidates?.content?.map(c => (
                    <option key={c.id} value={c.id}>{c.fullName} ({c.jobTitle || 'Unassigned'})</option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.candidateId?.message}</FormErrorMessage>
              </FormControl>

              {/* Interviewer Select */}
              <FormControl isInvalid={!!errors.interviewerId}>
                <FormLabel fontSize="13px" fontWeight="semibold">Interviewer</FormLabel>
                <Select 
                  placeholder="Select interviewer" 
                  focusBorderColor="brand.500" 
                  bg="neutral.50" 
                  borderRadius="lg"
                  onChange={(e) => setValue('interviewerId', e.target.value ? parseInt(e.target.value) : '')}
                >
                  {interviewers?.map(i => (
                    <option key={i.id} value={i.id}>{i.fullName} ({i.email})</option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.interviewerId?.message}</FormErrorMessage>
              </FormControl>

              {/* Date & Time */}
              <FormControl isInvalid={!!errors.scheduledAt}>
                <FormLabel fontSize="13px" fontWeight="semibold">Date & Time</FormLabel>
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
                  defaultValue={45} 
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
            <Button variant="ghost" mr={3} onClick={() => { reset(); onClose(); }} isDisabled={isLoading} borderRadius="xl">Cancel</Button>
            <Button type="submit" bgGradient="linear(to-br, brand.500, brand.700)" color="white" isLoading={isLoading} loadingText="Scheduling..." borderRadius="xl">Schedule Interview</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}