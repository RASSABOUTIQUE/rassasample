import { useState, useRef } from "react";
import { UploadCloud, Link as LinkIcon, X, Loader2 } from "lucide-react";
import { storageService } from "@/services/StorageService";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [mode, setMode] = useState<"url" | "upload">(value ? "url" : "upload");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    // Upload via StorageService
    storageService.uploadImage(file, "products")
      .then((url) => {
        onChange(url);
        setUploading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to upload image to Supabase");
        setUploading(false);
      });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-[10px] tracking-luxury uppercase text-gold">{label}</label>}
      
      {value ? (
        <div className="relative border border-border bg-background p-2 rounded-sm group overflow-hidden">
          <img src={value} alt="Preview" className="w-full h-32 object-contain bg-black/20" />
          <button 
            type="button" 
            onClick={() => onChange("")} 
            className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="border border-dashed border-border bg-background p-4 rounded-sm">
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border/50">
            <button 
              type="button"
              onClick={() => setMode("upload")}
              className={`text-xs flex items-center gap-1.5 transition-colors ${mode === "upload" ? "text-gold" : "text-muted-foreground hover:text-ivory"}`}
            >
              <UploadCloud className="w-3.5 h-3.5" /> Upload File
            </button>
            <button 
              type="button"
              onClick={() => setMode("url")}
              className={`text-xs flex items-center gap-1.5 transition-colors ${mode === "url" ? "text-gold" : "text-muted-foreground hover:text-ivory"}`}
            >
              <LinkIcon className="w-3.5 h-3.5" /> Image URL
            </button>
          </div>

          {mode === "upload" ? (
            <div 
              className="flex flex-col items-center justify-center py-6 cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              {uploading ? (
                <Loader2 className="w-6 h-6 text-gold animate-spin mb-2" />
              ) : (
                <UploadCloud className="w-6 h-6 text-muted-foreground group-hover:text-gold transition-colors mb-2" />
              )}
              <p className="text-xs text-muted-foreground group-hover:text-ivory transition-colors">
                {uploading ? "Processing..." : "Click to select a file"}
              </p>
            </div>
          ) : (
            <div>
              <input 
                type="url" 
                value={value} 
                onChange={handleUrlChange} 
                placeholder="https://example.com/image.jpg"
                className="w-full bg-background border border-border px-3 py-2 text-sm outline-none focus:border-gold transition-colors"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
