import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Mail, Phone, MapPin, Building2 } from "lucide-react";

interface AccountInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  businessName?: string;
  address?: string;
  joinDate: string;
  accountStatus: "active" | "inactive" | "suspended";
}

interface AccountInformationProps {
  account: AccountInfo;
  onEdit?: () => void;
}

export function AccountInformation({ account, onEdit }: AccountInformationProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "inactive":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
      case "suspended":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusCapitalized = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const memberSince = new Date(account.joinDate);
  const monthsActive = Math.floor(
    (Date.now() - memberSince.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );

  return (
    <Card className="fin-card">
      <div className="fin-card-header flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Account Information</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="gap-2"
        >
          <Edit2 size={16} />
          Edit
        </Button>
      </div>

      <div className="fin-card-content space-y-6">
        {/* Personal Information */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">
            Personal Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">First Name</p>
              <p className="font-medium text-foreground">{account.firstName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Last Name</p>
              <p className="font-medium text-foreground">{account.lastName}</p>
            </div>
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <Mail size={14} className="text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Email</p>
              </div>
              <p className="font-medium text-foreground">{account.email}</p>
            </div>
            {account.phone && (
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <Phone size={14} className="text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Phone</p>
                </div>
                <p className="font-medium text-foreground">{account.phone}</p>
              </div>
            )}
          </div>
        </div>

        {/* Business Information */}
        {account.businessName && (
          <div className="border-t border-border pt-4">
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Business Information
            </h4>
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Building2 size={14} className="text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Business Name</p>
                </div>
                <p className="font-medium text-foreground">
                  {account.businessName}
                </p>
              </div>
              {account.address && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={14} className="text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Address</p>
                  </div>
                  <p className="font-medium text-foreground">{account.address}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Account Status */}
        <div className="border-t border-border pt-4">
          <h4 className="text-sm font-semibold text-foreground mb-3">
            Account Status
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  account.accountStatus
                )}`}
              >
                {getStatusCapitalized(account.accountStatus)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Member Since</span>
              <span className="font-medium text-foreground">
                {memberSince.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Account Age</span>
              <span className="font-medium text-foreground">
                {monthsActive} month{monthsActive !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
