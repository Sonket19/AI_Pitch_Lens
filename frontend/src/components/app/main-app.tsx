'use client';

import { useAppContext } from '@/context/app-provider';
import { UploadView } from '@/components/app/upload-view';
import { AnalysisLoader } from '@/components/app/analysis-loader';
import { AnalysisView } from '@/components/app/analysis-view';

export function MainApp() {
  const { appState } = useAppContext();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {appState === 'upload' && <UploadView />}
      {appState === 'analyzing' && <AnalysisLoader />}
      {appState === 'viewing' && <AnalysisView />}
    </div>
  );
}
