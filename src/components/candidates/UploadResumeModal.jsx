import { useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Button, VStack, Text, Box, useToast, Progress
} from '@chakra-ui/react';
import { useUploadResumeMutation } from '../../api/api';

export default function UploadResumeModal({ isOpen, onClose, candidateId, candidateName }) {
  const toast = useToast();
  const [uploadResume, { isLoading }] = useUploadResumeMutation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type.includes('word'))) {
      setSelectedFile(file);
      setUploadProgress(0);
    } else {
      toast({ title: 'Invalid file', description: 'Please upload a PDF or DOCX file.', status: 'warning', duration: 3000 });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      const interval = setInterval(() => setUploadProgress(p => p < 90 ? p + 10 : 90), 100);
      await uploadResume({ id: candidateId, file: selectedFile }).unwrap();
      clearInterval(interval);
      setUploadProgress(100);
      toast({ title: 'Resume uploaded successfully', status: 'success', duration: 3000 });
      setTimeout(() => { setSelectedFile(null); setUploadProgress(0); onClose(); }, 500);
    } catch (err) {
      toast({ title: 'Upload failed', description: err.data?.message || 'Try again', status: 'error', duration: 4000 });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { setSelectedFile(null); setUploadProgress(0); onClose(); }} size="md" isCentered>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(4px)" />
      <ModalContent borderRadius="2xl" borderWidth="1px" borderColor="neutral.200" shadow="2xl">
        <ModalHeader fontSize="lg" fontWeight="bold" color="neutral.800" pb={2}>Upload Resume</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={5} align="stretch">
            <Box p={6} borderRadius="xl" bg="neutral.50" border="2px dashed neutral.300" textAlign="center" _hover={{ borderColor: 'brand.500' }} transition="border-color 0.2s">
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} style={{ display: 'none' }} id="resume-file" />
              <label htmlFor="resume-file" style={{ cursor: 'pointer' }}>
                {selectedFile ? (
                  <VStack spacing={1}>
                    <Text fontSize="14px" fontWeight="semibold" color="neutral.800">{selectedFile.name}</Text>
                    <Text fontSize="12px" color="neutral.500">{(selectedFile.size / 1024).toFixed(1)} KB</Text>
                  </VStack>
                ) : (
                  <>
                    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-2 text-neutral.500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.396-1.268A5.25 5.25 0 0117.25 15h-10.5a4.5 4.5 0 01-4.5 4.5z"/></svg>
                    <Text fontSize="14px" fontWeight="medium" color="neutral.700">Click to upload PDF/DOCX</Text>
                    <Text fontSize="11px" color="neutral.500">Max 5MB</Text>
                  </>
                )}
              </label>
            </Box>
            {uploadProgress > 0 && <Progress value={uploadProgress} size="sm" colorScheme="brand" borderRadius="full" />}
          </VStack>
        </ModalBody>
        <ModalFooter bg="neutral.50" borderRadius="0 0 2xl 2xl" borderTop="1px" borderColor="neutral.200" px={6} py={4}>
          <Button variant="ghost" mr={3} onClick={() => { setSelectedFile(null); setUploadProgress(0); onClose(); }} borderRadius="xl">Cancel</Button>
          <Button isDisabled={!selectedFile || isLoading} onClick={handleUpload} bgGradient="linear(to-br, brand.500, brand.700)" color="white" isLoading={isLoading} loadingText="Uploading..." borderRadius="xl">Upload Resume</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}