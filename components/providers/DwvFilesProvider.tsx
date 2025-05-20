import React, { createContext, useState } from "react";

export interface FileProps {
  id: string;
  name: string;
  file: File;
  progress: number;
}

export interface FilesContextProps {
  files: FileProps[];
  setFiles: React.Dispatch<React.SetStateAction<FileProps[]>>;
  addFiles: (files: FileProps[]) => void;
  removeAllFiles: () => void;
  removeFile: (file: FileProps) => void;
  updateProgress: (fileId: string, progress: number) => void;
}

const ctx = createContext<FilesContextProps | undefined>(undefined);

export const useFiles = () => {
  return React.useContext(ctx) as FilesContextProps;
};

export default function FilesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [files, setFiles] = useState<FileProps[]>([]);
  const addFiles = (files: FileProps[]) => {
    setFiles((prevFiles) => {
      const newFiles = files.filter(
        (file) => !prevFiles.some((f) => f.id === file.id),
      );
      return [...prevFiles, ...newFiles];
    });
  };
  const removeFile = (file: FileProps) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f.id !== file.id));
  };
  const removeAllFiles = () => {
    setFiles((prevFiles) => []);
  };
  const updateProgress = (fileId: string, progress: number) => {
    setFiles((prevFiles) =>
      prevFiles.map((f) => (f.id === fileId ? { ...f, progress } : f)),
    );
  };
  return (
    <ctx.Provider
      value={{
        files,
        setFiles,
        addFiles,
        removeAllFiles,
        removeFile,
        updateProgress,
      }}
    >
      {children}
    </ctx.Provider>
  );
}
