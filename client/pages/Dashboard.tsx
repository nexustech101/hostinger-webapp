import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeGenerator } from "@/components/QRCodeGenerator";
import { ProfilePictureUpload } from "@/components/ProfilePictureUpload";
import { EditAccountModal } from "@/components/EditAccountModal";
import { RevenueStatistics } from "@/components/RevenueStatistics";
import { Send, Plus, TrendingUp, DollarSign, Users, FileText } from "lucide-react";

const mockAccountData = {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "+1 (555) 123-4567",
  businessName: "John's Freelance Services",
  address: "123 Business Street, New York, NY 10001",
  joinDate: "2023-01-15",
  accountStatus: "active" as const,
  stripeAccountUrl: "https://stripe.com/redirect/acct_1234567890",
  profileImage: undefined,
};

const topStats = [
  {
    label: "Monthly Revenue",
    value: "$72,450",
    change: "+12.5%",
    up: true,
    icon: DollarSign,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
  },
  {
    label: "Active Clients",
    value: "142",
    change: "+8 this month",
    up: true,
    icon: Users,
    iconColor: "text-indigo-500",
    iconBg: "bg-indigo-500/10",
  },
  {
    label: "Open Invoices",
    value: "40",
    change: "$107.8k outstanding",
    up: null,
    icon: FileText,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
  },
  {
    label: "Avg Invoice Value",
    value: "$2,850",
    change: "+$220 vs last mo.",
    up: true,
    icon: TrendingUp,
    iconColor: "text-sky-500",
    iconBg: "bg-sky-500/10",
  },
];

export default function Dashboard() {
  const [account, setAccount] = useState(mockAccountData);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleSaveAccount = (updated: typeof mockAccountData) => {
    setAccount({ ...account, ...updated });
    setIsEditOpen(false);
  };

  const handleProfilePictureUpload = (file: File) => {
    console.log("Profile picture uploaded:", file.name);
  };

  return (
    <AppLayout title="Dashboard">
      <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">

        {/* ── Top Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {topStats.map((stat) => (
            <Card key={stat.label} className="fin-card">
              <div className="fin-card-content flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground leading-tight">{stat.value}</p>
                  <p
                    className={`text-xs mt-1.5 font-medium ${
                      stat.up === true
                        ? "text-emerald-500"
                        : stat.up === false
                        ? "text-rose-500"
                        : "text-muted-foreground"
                    }`}
                  >
                    {stat.up === true ? "↑ " : stat.up === false ? "↓ " : ""}
                    {stat.change}
                  </p>
                </div>
                <div className={`p-2.5 rounded-xl flex-shrink-0 ${stat.iconBg}`}>
                  <stat.icon size={18} className={stat.iconColor} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* ── Profile + QR ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="fin-card lg:col-span-1">
            <div className="fin-card-header">
              <h3 className="font-semibold text-foreground">Payment QR Code</h3>
            </div>
            <div className="fin-card-content flex flex-col items-center py-6">
              <QRCodeGenerator value={account.stripeAccountUrl} size={180} />
              <p className="text-xs text-muted-foreground text-center mt-4">
                Share this QR code with clients for instant payments
              </p>
            </div>
          </Card>

          <Card className="fin-card lg:col-span-2">
            <div className="fin-card-header flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Profile</h3>
              <EditAccountModal
                account={account}
                onSave={handleSaveAccount}
                isOpen={isEditOpen}
                onOpenChange={setIsEditOpen}
              />
            </div>
            <div className="fin-card-content">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <ProfilePictureUpload
                    currentImage={account.profileImage}
                    onUpload={handleProfilePictureUpload}
                    name={`${account.firstName} ${account.lastName}`}
                    initials={`${account.firstName[0]}${account.lastName[0]}`}
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {account.firstName} {account.lastName}
                    </h2>
                    <p className="text-sm text-muted-foreground">{account.businessName}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Email</p>
                      <p className="font-medium text-foreground">{account.email}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Phone</p>
                      <p className="font-medium text-foreground">{account.phone}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-muted-foreground mb-1">Address</p>
                      <p className="font-medium text-foreground">{account.address}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border flex gap-2">
                    <Button className="gap-2">
                      <Send size={16} />
                      Send Invoice
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Plus size={16} />
                      New Invoice
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* ── Revenue Statistics ── */}
        <RevenueStatistics period="30days" />

      </div>
    </AppLayout>
  );
}