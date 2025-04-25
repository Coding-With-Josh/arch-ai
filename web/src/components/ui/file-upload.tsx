"use client";

import { Button } from "./button";
import { Input } from "./input";
import { useCallback, useState } from "react";
import { File, Upload } from "lucide-react";

interface FileUploadProps {
  value?: File;
  onChange: (file?: File) => void;
  onRemove: () => void;
}

export const FileUpload = ({ value, onChange, onRemove }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onChange(e.dataTransfer.files[0]);
    }
  };

  if (value) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <File className="h-4 w-4" />
          <span className="text-sm">{value.name}</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove()}
        >
          Remove
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center ${
        isDragging
          ? "border-primary bg-primary/10"
          : "border-zinc-200 dark:border-zinc-700"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-2">
        <Upload className="h-8 w-8 text-zinc-500" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Drag and drop your logo here, or click to browse
        </p>
        <Input
          type="file"
          accept="image/*"
          className="hidden"
          id="file-upload"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          Select File
        </Button>
      </div>
    </div>
  );
};