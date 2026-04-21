import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Save } from "lucide-react";

interface AccountDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  businessName?: string;
  address?: string;
}

interface EditAccountModalProps {
  account: AccountDetails;
  onSave?: (updated: AccountDetails) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditAccountModal({
  account,
  onSave,
  isOpen: controlledOpen,
  onOpenChange,
}: EditAccountModalProps) {
  const [isOpen, setIsOpen] = useState(controlledOpen ?? false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<AccountDetails>(account);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof AccountDetails
  ) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email) {
        alert("Please fill in all required fields");
        return;
      }

      onSave?.(formData);
      setIsSaving(false);
      handleOpenChange(false);
    } catch (error) {
      console.error("Error saving account details:", error);
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(account);
    handleOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Edit2 size={18} />
          <span className="hidden sm:inline">Edit Account</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Account Details</DialogTitle>
          <DialogDescription>
            Update your account information. All fields are required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              First Name *
            </label>
            <Input
              value={formData.firstName}
              onChange={(e) => handleInputChange(e, "firstName")}
              placeholder="John"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Last Name *
            </label>
            <Input
              value={formData.lastName}
              onChange={(e) => handleInputChange(e, "lastName")}
              placeholder="Doe"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email Address *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange(e, "email")}
              placeholder="john@example.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Phone Number
            </label>
            <Input
              type="tel"
              value={formData.phone || ""}
              onChange={(e) => handleInputChange(e, "phone")}
              placeholder="+1 (555) 000-0000"
            />
          </div>

          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Business Name
            </label>
            <Input
              value={formData.businessName || ""}
              onChange={(e) => handleInputChange(e, "businessName")}
              placeholder="Your Business Name"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Address
            </label>
            <Input
              value={formData.address || ""}
              onChange={(e) => handleInputChange(e, "address")}
              placeholder="123 Business Street, City, State 12345"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            <Save size={16} />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
