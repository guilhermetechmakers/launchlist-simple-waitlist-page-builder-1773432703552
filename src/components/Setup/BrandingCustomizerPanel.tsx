/**
 * Branding customization: logo upload (with resize), button color, short copy (description).
 */

import { ImageUploader } from "@/components/Setup/ImageUploader";
import { ButtonColorPicker } from "@/components/branding/ButtonColorPicker";
import { CopyEditor } from "@/components/branding/CopyEditor";
import { useSignUpload } from "@/hooks/useSignUpload";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface BrandingCustomizerPanelProps {
  productName: string;
  description: string;
  recipientEmail: string;
  buttonColor: string;
  logoUrl: string | undefined;
  onProductNameChange?: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onRecipientEmailChange?: (value: string) => void;
  onButtonColorChange: (value: string) => void;
  onLogoUrlChange: (value: string) => void;
  descriptionError?: string | null;
  buttonColorError?: string | null;
  disabled?: boolean;
  className?: string;
}

export function BrandingCustomizerPanel({
  description,
  buttonColor,
  logoUrl,
  onDescriptionChange,
  onButtonColorChange,
  onLogoUrlChange,
  descriptionError,
  buttonColorError,
  disabled = false,
  className,
}: BrandingCustomizerPanelProps) {
  const signUpload = useSignUpload();

  const handleImageReady = async (dataUrl: string, blob?: Blob) => {
    if (!blob) {
      onLogoUrlChange(dataUrl);
      return;
    }
    try {
      const { signedUrl, publicUrl } = await signUpload.mutateAsync({
        fileName: "logo.webp",
        contentType: "image/webp",
        fileSize: blob.size,
      });
      if (!signedUrl) {
        toast.error("Upload failed");
        return;
      }
      const res = await fetch(signedUrl, {
        method: "PUT",
        body: blob,
        headers: { "Content-Type": "image/webp" },
      });
      if (!res.ok) {
        toast.error("Upload failed");
        return;
      }
      onLogoUrlChange(publicUrl);
      toast.success("Logo uploaded");
    } catch {
      // Error toasted in mutation
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <ImageUploader
        imageUrl={logoUrl}
        onImageReady={handleImageReady}
        onClear={() => onLogoUrlChange("")}
        disabled={disabled}
      />
      <CopyEditor
        label="Short description"
        value={description}
        onChange={onDescriptionChange}
        placeholder="One line that describes your product."
        maxLength={160}
        error={descriptionError ?? undefined}
        disabled={disabled}
      />
      <ButtonColorPicker
        value={buttonColor}
        onChange={onButtonColorChange}
        error={buttonColorError ?? undefined}
        disabled={disabled}
      />
    </div>
  );
}
