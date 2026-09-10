import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Button, FormControl, FormLabel, Input, Textarea, FormErrorMessage, VStack, HStack, Box, useToast
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateJobMutation } from '../../api/api';

// Validation schema
const jobSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  department: z.string().min(2, 'Department is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

export default function CreateJobModal({ isOpen, onClose }) {
  const toast = useToast();
  const [createJob, { isLoading }] = useCreateJobMutation();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: { title: '', department: '', description: '' }
  });

  const onSubmit = async (data) => {
    try {
      // Backend expects: title, description, department (status defaults to OPEN)
      await createJob({ ...data, status: 'OPEN' }).unwrap();
      toast({ title: 'Job created successfully', status: 'success', duration: 3000, isClosable: true });
      reset();
      onClose();
    } catch (err) {
      const msg = err.data?.message || err.error || 'Failed to create job';
      toast({ title: 'Error', description: msg, status: 'error', duration: 4000, isClosable: true });
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md" isCentered scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(4px)" />
      <ModalContent 
        borderRadius="2xl" 
        borderWidth="1px" 
        borderColor="neutral.200" 
        shadow="2xl"
        bg="white"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader fontSize="lg" fontWeight="bold" color="neutral.800" pb={2}>
            Create New Job
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody pb={6}>
            <VStack spacing={5}>
              <FormControl isInvalid={!!errors.title}>
                <FormLabel fontSize="13px" fontWeight="semibold" color="neutral.800">Job Title</FormLabel>
                <Input 
                  {...register('title')} 
                  placeholder="e.g., Senior Java Developer" 
                  focusBorderColor="brand.500" 
                  bg="neutral.50"
                  borderRadius="lg"
                />
                <FormErrorMessage fontSize="12px">{errors.title?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.department}>
                <FormLabel fontSize="13px" fontWeight="semibold" color="neutral.800">Department</FormLabel>
                <Input 
                  {...register('department')} 
                  placeholder="e.g., Engineering, Marketing" 
                  focusBorderColor="brand.500" 
                  bg="neutral.50"
                  borderRadius="lg"
                />
                <FormErrorMessage fontSize="12px">{errors.department?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.description}>
                <FormLabel fontSize="13px" fontWeight="semibold" color="neutral.800">Description</FormLabel>
                <Textarea 
                  {...register('description')} 
                  placeholder="Brief overview of responsibilities, requirements, and expectations..." 
                  rows={4} 
                  focusBorderColor="brand.500" 
                  resize="none"
                  bg="neutral.50"
                  borderRadius="lg"
                />
                <FormErrorMessage fontSize="12px">{errors.description?.message}</FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter 
            bg="neutral.50" 
            borderRadius="0 0 2xl 2xl" 
            borderTop="1px" 
            borderColor="neutral.200"
            px={6}
            py={4}
          >
            <Button variant="ghost" mr={3} onClick={handleClose} isDisabled={isLoading} borderRadius="xl">
              Cancel
            </Button>
            <Button 
              type="submit" 
              bgGradient="linear(to-br, brand.500, brand.700)"
              color="white"
              isLoading={isLoading}
              loadingText="Creating..."
              borderRadius="xl"
              _hover={{ transform: 'translateY(-1px)', shadow: 'md' }}
              transition="all 0.2s ease"
            >
              Create Job
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}