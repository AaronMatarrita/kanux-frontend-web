"use client";
import { Camera, Upload, X } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export function ImageUpload({
  currentImage,
  onImageChange,
  onImageRemove,
  label = "Foto de Perfil",
}: {
  currentImage?: string;
  onImageChange: (file: File | null) => void;
  onImageRemove?: () => void;
  label?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(currentImage);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // update image
  useEffect(() => {
    if (currentImage && !selectedFile) {
      setPreview(currentImage);
    }
  }, [currentImage, selectedFile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      setSelectedFile(file);
      setHasChanges(true);
      onImageChange(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview(undefined);
    setSelectedFile(null);
    setHasChanges(true);

    //clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // notify image delete
    onImageChange(null);
    if (onImageRemove) {
      onImageRemove();
    }
  };

  const handleRevert = () => {
    //file
    setPreview(currentImage);
    setSelectedFile(null);
    setHasChanges(false);
    //clear file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    //file
    onImageChange(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <label className="text-sm font-medium text-foreground">{label}</label>

      {/* conteiner*/}
      <div className="flex flex-col items-center gap-4">
        {/* image center */}
        <div className="relative">
          <div
            onClick={handleClick}
            className="relative w-50 h-50 rounded-full overflow-hidden bg-muted/40 cursor-pointer group border-2 border-border hover:border-emerald-500 transition-colors"
          >
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* button remove image*/}
          {preview && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center shadow-lg"
              title="Remover imagen"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* buttons */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClick}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
            >
              {preview ? "Change photo" : "Upload photo"}
            </button>

            {/* botton on changes */}
            {hasChanges && currentImage && (
              <button
                type="button"
                onClick={handleRevert}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-muted text-foreground border border-border hover:bg-muted/80 transition-colors"
              >
                Revert
              </button>
            )}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            JPG, PNG o GIF. Max 5MB
          </p>

          {/* State indicator*/}
          {selectedFile && (
            <p className="text-xs text-emerald-600 font-medium">
              New image selected
            </p>
          )}
        </div>

        {/* Input hidden */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}
