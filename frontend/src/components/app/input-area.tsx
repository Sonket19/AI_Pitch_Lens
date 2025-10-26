'use client';

import { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, FileText, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InputContent {
  type: 'pdf' | 'email' | 'audio' | null;
  content: string | null;
  fileName: string | null;
}

interface InputAreaProps {
  onContentChange: (content: InputContent) => void;
}

export function InputArea({ onContentChange }: InputAreaProps) {
  const [text, setText] = useState('');
  const { toast } = useToast();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onContentChange({
      type: 'email',
      content: newText,
      fileName: 'Pasted Email Content',
    });
  };

  const handleFileChange = (file: File, type: 'pdf' | 'audio') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onContentChange({ type, content, fileName: file.name });
      toast({ title: 'File Ready', description: `${file.name} is ready for analysis.` });
    };
    reader.onerror = () => {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to read the file.' });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-center mb-4">Provide the Pitch Deck</h3>
      <Tabs defaultValue="pdf" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pdf"><FileText className="mr-2 h-4 w-4"/>PDF</TabsTrigger>
          <TabsTrigger value="email"><FileText className="mr-2 h-4 w-4"/>Email</TabsTrigger>
          <TabsTrigger value="audio"><Mic className="mr-2 h-4 w-4"/>Audio</TabsTrigger>
        </TabsList>
        <TabsContent value="pdf">
          <FileDropzone onFileSelect={(file) => handleFileChange(file, 'pdf')} accept="application/pdf" />
        </TabsContent>
        <TabsContent value="email">
          <Textarea
            placeholder="Paste the content of the email pitch here..."
            className="min-h-[200px] text-base"
            value={text}
            onChange={handleTextChange}
          />
        </TabsContent>
        <TabsContent value="audio">
          <FileDropzone onFileSelect={(file) => handleFileChange(file, 'audio')} accept="audio/*" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  accept: string;
}

function FileDropzone({ onFileSelect, accept }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFile = useCallback((files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
       if (file.type && accept.includes(file.type.split('/')[0])) {
          onFileSelect(file);
       } else if(accept === 'application/pdf' && file.name.toLowerCase().endsWith('.pdf')) {
          onFileSelect(file);
       } else {
        toast({ variant: 'destructive', title: 'Invalid File', description: `Please upload a ${accept.split('/')[0]} file.` });
      }
    }
  }, [onFileSelect, accept, toast]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFile(e.dataTransfer.files);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      className={cn(
        "relative flex flex-col items-center justify-center w-full h-52 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors",
        isDragging && "border-primary bg-accent/20"
      )}
    >
      <input
        id="dropzone-file"
        type="file"
        className="absolute w-full h-full opacity-0 cursor-pointer"
        accept={accept}
        onChange={(e) => handleFile(e.target.files)}
      />
      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
        <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {accept === 'application/pdf' ? 'PDF file' : 'Audio file (MP3, M4A, etc.)'}
        </p>
      </div>
    </div>
  );
}
