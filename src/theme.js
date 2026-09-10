import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  colors: {
    brand: { 
      50: '#F0FDF4', 
      100: '#DCFCE7', 
      500: '#22C55E', 
      600: '#16A34A', 
      700: '#15803D', 
      800: '#166534' 
    },
    neutral: { 
      50: '#F8FAFC', 
      100: '#F1F5F9', 
      200: '#E2E8F0', 
      300: '#CBD5E1', 
      400: '#94A3B8', 
      500: '#64748B', 
      800: '#1E293B', 
      900: '#0F172A' 
    },
    status: { 
      open: '#10B981', 
      hold: '#F59E0B', 
      closed: '#6B7280', 
      rejected: '#EF4444', 
      selected: '#0D9488' 
    }
  },
  fonts: { 
    heading: 'Inter, sans-serif', 
    body: 'Inter, sans-serif' 
  },
  components: {
    Button: { 
      defaultProps: { 
        size: 'md', 
        variant: 'solid', 
        colorScheme: 'brand' 
      } 
    },
    Input: { 
      defaultProps: { 
        focusBorderColor: 'brand.500' 
      } 
    }
  }
});