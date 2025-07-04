import { Avatar } from "../../ui-controls/index";
import {
  InfoAdmin1,
  UploadIcon,
  ImageIcon,
  PdfIcon,
  CloseIcon,
} from "../../assets/index";
import { useState, useRef } from "react";

const DocumentUploader = ({
  isSingleUpload = true,
  label,
  fileType,
  files,
  setFiles,
  removeFile,
  setErrors,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [isLocalError, setIsLocalError] = useState(false);
  const ALLOWED_TYPES = fileType
    ? [fileType]
    : ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
  const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB in bytes

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const validateform = (file) => {
    // Check file type
    const isValidType = ALLOWED_TYPES.includes(file[0].type);
    // Check file size
    const isValidSize = file[0].size <= MAX_FILE_SIZE;
    const newErrors = {};

    if (!isValidType) {
      setIsLocalError(true);
      newErrors.file = "Invalid file type";
    }
    if (!isValidSize) {
      setIsLocalError(true);
      newErrors.file = "File too large (max 25MB)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const processFiles = (newFiles) => {
    // Validate files
    if (validateform(newFiles)) {
      const validFiles = newFiles.map((file) => {
        return {
          file,
          name: file.name,
          type: file.type,
          size: file.size,
          preview: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : null,
        };
      });
      setIsLocalError(false);
      if (isSingleUpload) {
        // In single mode, replace existing files with the new one
        setFiles(validFiles);
      } else {
        // In multiple mode, add to existing files
        setFiles((prevFiles) => [...prevFiles, ...validFiles]);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const getFileIcon = (fileType) => {
    if (fileType === "application/pdf") {
      return (
        <Avatar
          size="xs"
          title="notUpdated"
          isRounded={true}
          isDisabled={true}
          src={PdfIcon}
          btnStyle="opacity-100"
        />
      );
    } else {
      return (
        <Avatar
          size="xs"
          title="notUpdated"
          isRounded={true}
          isDisabled={true}
          src={ImageIcon}
          btnStyle="opacity-100"
        />
      );
    }
  };

  return (
    <div className="mx-auto w-full">
      {files.length > 0 && isSingleUpload ? null : (
        <>
          <div
            className={`cursor-pointer rounded-lg border-2 border-dashed bg-[#F4F7FE] p-8 text-center ${!isLocalError ? "border-slate-800/40" : "border-red-200 bg-red-50"}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".jpg,.jpeg,.png,.pdf"
              multiple={!isSingleUpload}
            />

            <div className="grid place-items-center">
              <Avatar
                size="xs"
                title="notUpdated"
                isRounded={true}
                isDisabled={true}
                src={UploadIcon}
                btnStyle="opacity-100"
              />
            </div>
            <p className="text-txt-md-15 font-medium !text-[#181D27]">
              Drop file or <span className="underline">browse</span>
            </p>
            <p className="text-sm text-gray-500">
              {label ? label : "Format: .jpeg, .png & Max file size: 25 MB"}
            </p>
          </div>
        </>
      )}

      {files.length > 0 && isSingleUpload ? (
        <div className="mt-6 h-31">
          <div className="space-y-3">
            {files.map((file, index) => (
              <div
                key={index}
                className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border border-gray-200 bg-[#F4F7FE] p-2`}
              >
                <div className="flex-shrink-0">{getFileIcon(file.type)}</div>
                <div className="overflow-hidden">
                  <p className="text-txt-md-13 font-medium !text-[#000000]">
                    {file.name}
                  </p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="rounded-full p-1 hover:bg-gray-100"
                  >
                    <Avatar
                      size="xs"
                      title="Cross"
                      isRounded={true}
                      isDisabled={true}
                      src={CloseIcon}
                      btnStyle="opacity-100"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default DocumentUploader;
