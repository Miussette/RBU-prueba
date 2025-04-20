import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
}

export default function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="w-full px-4 md:px-6 py-6">
      {children}
    </div>
  );
}
