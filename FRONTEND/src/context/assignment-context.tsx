import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { userApi } from '@/api/user';
import { toast } from 'sonner';

interface AssignmentContextType {
  targetClientId: string | null;
  targetClientName: string | null;
  setAssignmentTarget: (id: string, name: string) => void;
  clearAssignment: () => void;
}

const AssignmentContext = createContext<AssignmentContextType | undefined>(undefined);

export function AssignmentProvider({ children }: { children: ReactNode }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const targetClientId = searchParams.get('assignTo');
  const [targetClientName, setTargetClientName] = useState<string | null>(null);

  // Fetch client name if targetClientId exists but name doesn't
  React.useEffect(() => {
    if (targetClientId && !targetClientName) {
      userApi.adminGetClientById(targetClientId)
        .then((res: any) => {
          setTargetClientName(res.data?.userName || res.data?.name || 'Client');
        })
        .catch(() => {
          setTargetClientName('Client');
        });
    }
  }, [targetClientId, targetClientName]);

  const setAssignmentTarget = (id: string, name: string) => {
    setTargetClientName(name);
    navigate(`/admin/clients/${id}/program`);
  };

  const clearAssignment = () => {
    setTargetClientName(null);
    navigate('/admin/clients');
  };

  return (
    <AssignmentContext.Provider value={{ targetClientId, targetClientName, setAssignmentTarget, clearAssignment }}>
      {children}
    </AssignmentContext.Provider>
  );
}

export function useAssignment() {
  const context = useContext(AssignmentContext);
  if (context === undefined) {
    throw new Error('useAssignment must be used within an AssignmentProvider');
  }
  return context;
}
