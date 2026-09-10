import { useState, useEffect } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
  Button, VStack, FormControl, FormLabel, NumberInput, NumberInputField, Select, Textarea, useToast
} from '@chakra-ui/react';
import { useSubmitFeedbackMutation } from '../../api/api';

export default function SubmitFeedbackModal({ isOpen, onClose, interviewId }) {
  const toast = useToast();
  const [submit, { isLoading }] = useSubmitFeedbackMutation();
  
  const [tech, setTech] = useState(3);
  const [comm, setComm] = useState(3);
  const [rec, setRec] = useState('HOLD');
  const [comments, setComments] = useState('');

  // Reset form on open/close
  useEffect(() => {
    if (isOpen) {
      setTech(3); setComm(3); setRec('HOLD'); setComments('');
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (tech < 1 || tech > 5 || comm < 1 || comm > 5) {
      toast({ title: 'Ratings must be between 1 and 5', status: 'warning', duration: 3000 });
      return;
    }
    try {
      await submit({ 
        interviewId, 
        feedbackData: { 
          technicalRating: parseInt(tech), 
          communicationRating: parseInt(comm), 
          recommendation: rec, 
          comments 
        } 
      }).unwrap();
      toast({ title: 'Feedback submitted successfully!', status: 'success', duration: 3000 });
      onClose();
    } catch (err) {
      const msg = err.data?.message || 'Failed to submit feedback. Interview may already have feedback.';
      toast({ title: 'Error', description: msg, status: 'error', duration: 4000 });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(4px)" />
      <ModalContent borderRadius="2xl" borderWidth="1px" borderColor="neutral.200" shadow="2xl">
        <ModalHeader fontSize="lg" fontWeight="bold" color="neutral.800" pb={2}>Submit Feedback</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel fontSize="13px" fontWeight="semibold">Technical Rating</FormLabel>
              <NumberInput min={1} max={5} value={tech} onChange={(_, val) => setTech(val)} borderRadius="lg" bg="neutral.50">
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="13px" fontWeight="semibold">Communication Rating</FormLabel>
              <NumberInput min={1} max={5} value={comm} onChange={(_, val) => setComm(val)} borderRadius="lg" bg="neutral.50">
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="13px" fontWeight="semibold">Recommendation</FormLabel>
              <Select value={rec} onChange={e => setRec(e.target.value)} borderRadius="lg" bg="neutral.50">
                <option value="SELECT">✅ Select / Hire</option>
                <option value="HOLD">⏸️ Hold / Maybe</option>
                <option value="REJECT">❌ Reject</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="13px" fontWeight="semibold">Comments</FormLabel>
              <Textarea 
                value={comments} 
                onChange={e => setComments(e.target.value)} 
                placeholder="Strengths, areas for improvement, overall notes..." 
                borderRadius="lg" 
                bg="neutral.50" 
                rows={3} 
                resize="none"
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter bg="neutral.50" borderRadius="0 0 2xl 2xl" borderTop="1px" borderColor="neutral.200" px={6} py={4}>
          <Button variant="ghost" mr={3} onClick={onClose} isDisabled={isLoading} borderRadius="xl">Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            bgGradient="linear(to-br, brand.500, brand.700)" 
            color="white" 
            isLoading={isLoading} 
            loadingText="Submitting..." 
            borderRadius="xl"
            _hover={{ transform: 'translateY(-1px)', shadow: 'md' }}
            transition="all 0.2s ease"
          >
            Submit Feedback
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}