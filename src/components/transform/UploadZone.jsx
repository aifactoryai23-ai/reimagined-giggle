import React, { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Image } from "lucide-react";

export default function UploadZone({ onFileUpload }) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = React.useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type.startsWith("image/")) {
      onFileUpload(file);
    }
  };

  // Обработчик клика по карточке
  const handleCardClick = () => {
    fileInputRef.current?.click();
  };

  // Обработчик клика по кнопке (предотвращает всплытие)
  const handleButtonClick = (e) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  return (
    <div className="transition-transform">
      <Card
        className={`p-6 sm:p-10 border-2 border-dashed transition-all duration-200 cursor-pointer ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleCardClick} // Добавляем обработчик клика
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        <div className="text-center">
          <div className="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Image className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
            Upload Your Property Photo
          </h3>

          <p className="text-sm sm:text-base text-gray-600 mb-2 max-w-md mx-auto">
            Drag and drop an interior or exterior photo here, or click to browse.
          </p>

          <p className="text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8 max-w-md mx-auto">
            💡 Upload photos with good lighting and minimal clutter for best results.
          </p>

          <Button
            size="sm"
            onClick={handleButtonClick} // Используем новый обработчик
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Choose Photo
          </Button>

          <p className="text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6">
            Supported: JPG, PNG, WEBP (max 10MB)
          </p>
        </div>
      </Card>
    </div>
  );
}
