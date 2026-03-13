/**
 * Branding customization: logo upload (with resize), button color, short copy (description).
 * Uses shadcn Card layout, loading/error states, and full accessibility.
 */

import { useState, useCallback } from "react";
import { ImageUploader } from "@/components/Setup/ImageUploader";
import { ButtonColorPicker } from "@/components/branding/ButtonColorPicker";
import { CopyEditor } from "@/components/branding/CopyEditor";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSignUpload } from "@/hooks/useSignUpload";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Palette } from "lucide-react";

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
  /** Inline error for logo upload/validation. */
  logoError?: string | null;
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
  logoError,
  disabled = false,
  className,
}: BrandingCustomizerPanelProps) {
  const signUpload = useSignUpload();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageReady = useCallback(
    async (dataUrl: string, blob?: Blob) => {
      setUploadError(null);
      if (!blob) {
        onLogoUrlChange(dataUrl);
        return;
      }
      setIsUploading(true);
      try {
        const { signedUrl, publicUrl } = await signUpload.mutateAsync({
          fileName: "logo.webp",
          contentType: "image/webp",
          fileSize: blob.size,
        });
        if (!signedUrl) {
          const msg = "Upload failed";
          setUploadError(msg);
          toast.error(msg);
          return;
        }
        const res = await fetch(signedUrl, {
          method: "PUT",
          body: blob,
          headers: { "Content-Type": "image/webp" },
        });
        if (!res.ok) {
          const msg = "Upload failed";
          setUploadError(msg);
          toast.error(msg);
          return;
        }
        onLogoUrlChange(publicUrl ?? dataUrl);
        toast.success("Logo uploaded");
      } catch {
        const msg = "Logo upload failed. Try again.";
        setUploadError(msg);
        // Error may also be toasted in mutation
      } finally {
        setIsUploading(false);
      }
    },
    [onLogoUrlChange, signUpload]
  );

  const displayLogoError = uploadError ?? logoError ?? undefined;

  return (
    <Card
      className={cn("rounded-2xl border border-border bg-card shadow-card", className)}
      aria-labelledby="branding-panel-title"
      aria-describedby="branding-panel-desc"
    >
      <CardHeader className="pb-4">
        <CardTitle
          id="branding-panel-title"
          className="flex items-center gap-2 font-heading text-xl"
        >
          <Palette className="h-5 w-5 text-primary" aria-hidden />
          Branding
        </CardTitle>
        <CardDescription id="branding-panel-desc">
          Logo, short description, and button color for your waitlist page.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ImageUploader
          imageUrl={logoUrl}
          onImageReady={handleImageReady}
          onClear={() => {
            onLogoUrlChange("");
            setUploadError(null);
          }}
          disabled={disabled}
          uploading={isUploading}
          error={displayLogoError}
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
      </CardContent>
    </Card>
  );
}
