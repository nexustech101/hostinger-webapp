import { useState, useRef } from "react";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfilePictureUploadProps {
  currentImage?: string;
  onUpload?: (file: File) => void;
  name?: string;
  initials?: string;
}

export function ProfilePictureUpload({
  currentImage,
  onUpload,
  name = "User",
  initials = "JD",
}: ProfilePictureUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(currentImage);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      onUpload?.(file);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
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
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClear = () => {
    setPreview(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Profile Picture Display */}
      <div
        className={`relative w-32 h-32 rounded-full border-4 border-primary/20 flex items-center justify-center transition-all ${
          isDragging ? "border-primary border-dashed scale-105" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {preview ? (
          <img
            src={preview}
            alt={name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold text-4xl">
            {initials}
          </div>
        )}

        {/* Upload Button Overlay */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-3 hover:bg-primary/90 transition-colors shadow-lg"
          title="Change profile picture"
        >
          <Camera size={20} />
        </button>

        {/* Clear Button */}
        {preview && (
          <button
            onClick={handleClear}
            className="absolute top-0 right-0 bg-destructive text-destructive-foreground rounded-full p-2 hover:bg-destructive/90 transition-colors shadow-lg"
            title="Remove profile picture"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Upload Instructions */}
      <div className="text-center text-sm text-muted-foreground">
        <p className="font-medium text-foreground mb-1">
          {isDragging ? "Drop image to upload" : "Upload a profile picture"}
        </p>
        <p className="text-xs">
          Click the camera icon or drag and drop an image (Max 5MB)
        </p>
      </div>

      {/* Button for Manual Upload */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        className="gap-2"
      >
        <Camera size={16} />
        {preview ? "Change Picture" : "Select Picture"}
      </Button>
    </div>
  );
}
