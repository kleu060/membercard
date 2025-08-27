'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ResumeUploadProps {
  onUploadSuccess?: (resumeUrl: string) => void;
}

export default function ResumeUpload({ onUploadSuccess }: ResumeUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    if (!file.type.includes('pdf') && !file.type.includes('word')) {
      toast.error('Please upload a PDF or Word document');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          toast.success('Resume uploaded successfully');
          onUploadSuccess?.(response.resumeUrl);
        } else {
          toast.error('Upload failed');
        }
        setUploading(false);
      });

      xhr.addEventListener('error', () => {
        toast.error('Upload failed');
        setUploading(false);
      });

      xhr.open('POST', '/api/user/job-profile/resume');
      xhr.send(formData);
    } catch (error) {
      toast.error('Upload failed');
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Resume Upload
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            disabled={uploading}
          />
          
          {uploading ? (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Uploading...</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">{progress}%</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="h-8 w-8 text-gray-400 mx-auto" />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Drag and drop your resume here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supported formats: PDF, Word documents
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}