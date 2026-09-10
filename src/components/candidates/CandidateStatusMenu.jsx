import { Menu, MenuButton, MenuList, MenuItem, Button, Portal } from '@chakra-ui/react'; // 1. Added Portal here
import { useCallback } from 'react';
import CandidateStatusBadge from './CandidateStatusBadge';
import { CANDIDATE_STATUS_CONFIG } from './CandidateStatusBadge';

export default function CandidateStatusMenu({ 
  candidateId, 
  currentStatus, 
  resumeFileName, 
  onStatusChange, 
  isEditable 
}) {
  
  const handleSelect = useCallback((newStatus) => {
    if (newStatus !== currentStatus) {
      onStatusChange(candidateId, newStatus);
    }
  }, [candidateId, currentStatus, onStatusChange]);


  const isFinalStatus = currentStatus === 'SELECTED' || currentStatus === 'REJECTED';

  if (!isEditable || isFinalStatus) {
    return <CandidateStatusBadge status={currentStatus} />;
  }

  return (
    <Menu isLazy placement="bottom-start">
      <MenuButton 
        as={Button} 
        variant="ghost" 
        size="sm" 
        p={0} 
        height="auto" 
        _hover={{ bg: 'transparent' }} 
        _active={{ bg: 'transparent' }}
        aria-label={`Change status for candidate ${candidateId}`}
      >
        <CandidateStatusBadge status={currentStatus} />
      </MenuButton>
      
      <Portal>
        <MenuList minWidth="160px" shadow="xl" borderRadius="xl" borderColor="neutral.200" p={1} zIndex={9999}>
          {Object.keys(CANDIDATE_STATUS_CONFIG).map((statusOption) => {
            const isBackwardMove = CANDIDATE_STATUS_CONFIG[statusOption].rank < CANDIDATE_STATUS_CONFIG[currentStatus].rank;
            const isCurrentStatus = currentStatus === statusOption;
            
            const isMissingResume = !resumeFileName; 

            return (
              <MenuItem 
                key={statusOption}
                borderRadius="lg"
                mb={0.5}
                onClick={() => handleSelect(statusOption)}
                isDisabled={isCurrentStatus || isBackwardMove || isMissingResume} 
                _hover={{ bg: 'neutral.50' }}
                opacity={isBackwardMove ? 0.4 : 1}
              >
                <CandidateStatusBadge status={statusOption} />
              </MenuItem>
            );
          })}
        </MenuList>
      </Portal>
    </Menu>
  );
}

