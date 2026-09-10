import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Button, FormControl, FormLabel, Input, FormErrorMessage, VStack, useToast, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Select
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateCandidateMutation } from '../../api/api';

const candidateSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  experienceYears: z.number().min(0, 'Experience cannot be negative').max(50),
  jobId: z.number({ required_error: 'Job is required' }),
});

export default function AddCandidateModal({ isOpen, onClose, jobs }) {
  const toast = useToast();
  const [createCandidate, { isLoading }] = useCreateCandidateMutation();
  
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm({
    resolver: zodResolver(candidateSchema),
    defaultValues: { fullName: '', email: '', phone: '', experienceYears: 0, jobId: '' }
  });

  const onSubmit = async (data) => {
    try {
      await createCandidate(data).unwrap();
      toast({ title: 'Candidate added successfully', status: 'success', duration: 3000, isClosable: true });
      reset();
      onClose();
    } catch (err) {
      toast({ title: 'Error', description: err.data?.message || 'Failed to add candidate', status: 'error', duration: 4000, isClosable: true });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { reset(); onClose(); }} size="md" isCentered>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(4px)" />
      <ModalContent borderRadius="2xl" borderWidth="1px" borderColor="neutral.200" shadow="2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader fontSize="lg" fontWeight="bold" color="neutral.800" pb={2}>Add Candidate</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.fullName}>
                <FormLabel fontSize="13px" fontWeight="semibold">Full Name</FormLabel>
                <Input {...register('fullName')} placeholder="e.g., Ravi Kumar" focusBorderColor="brand.500" bg="neutral.50" borderRadius="lg" />
                <FormErrorMessage>{errors.fullName?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.email}>
                <FormLabel fontSize="13px" fontWeight="semibold">Email</FormLabel>
                <Input {...register('email')} type="email" placeholder="ravi@example.com" focusBorderColor="brand.500" bg="neutral.50" borderRadius="lg" />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="13px" fontWeight="semibold">Phone (Optional)</FormLabel>
                <Input {...register('phone')} placeholder="9876543210" focusBorderColor="brand.500" bg="neutral.50" borderRadius="lg" />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="13px" fontWeight="semibold">Experience (Years)</FormLabel>
                <NumberInput min={0} max={50} step={0.5} defaultValue={0}>
                  <NumberInputField 
                    borderRadius="lg" bg="neutral.50" 
                    onChange={(e) => setValue('experienceYears', parseFloat(e.target.value) || 0)}
                  />
                  <NumberInputStepper><NumberIncrementStepper /><NumberDecrementStepper /></NumberInputStepper>
                </NumberInput>
                {errors.experienceYears && <FormErrorMessage>{errors.experienceYears.message}</FormErrorMessage>}
              </FormControl>

              <FormControl isInvalid={!!errors.jobId}>
                <FormLabel fontSize="13px" fontWeight="semibold">Apply For Job</FormLabel>
                <Select placeholder="Select a job" focusBorderColor="brand.500" bg="neutral.50" borderRadius="lg" onChange={(e) => setValue('jobId', e.target.value ? parseInt(e.target.value) : '')}>
                  {jobs?.content?.map(job => (
                    <option key={job.id} value={job.id}>{job.title} ({job.department})</option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.jobId?.message}</FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter bg="neutral.50" borderRadius="0 0 2xl 2xl" borderTop="1px" borderColor="neutral.200" px={6} py={4}>
            <Button variant="ghost" mr={3} onClick={() => { reset(); onClose(); }} isDisabled={isLoading} borderRadius="xl">Cancel</Button>
            <Button type="submit" bgGradient="linear(to-br, brand.500, brand.700)" color="white" isLoading={isLoading} loadingText="Adding..." borderRadius="xl">Add Candidate</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}