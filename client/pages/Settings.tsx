import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Bell, Lock, User, Trash2, Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <AppLayout title="Settings">
      <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
        {/* Profile Settings */}
        <Card className="fin-card">
          <div className="fin-card-header flex items-center gap-2">
            <User size={20} className="text-primary" />
            <h3 className="font-semibold text-foreground">Profile Settings</h3>
          </div>
          <div className="fin-card-content space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  First Name
                </label>
                <Input placeholder="John" defaultValue="John" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Last Name
                </label>
                <Input placeholder="Doe" defaultValue="Doe" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="john@example.com"
                defaultValue="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone Number
              </label>
              <Input
                type="tel"
                placeholder="+1 (555) 000-0000"
                defaultValue="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Business Name (Optional)
              </label>
              <Input
                placeholder="Your Business Name"
                defaultValue="John's Freelance Services"
              />
            </div>

            <Button className="gap-2 w-full sm:w-auto">
              <Save size={18} />
              Save Changes
            </Button>
          </div>
        </Card>

        {/* Security Settings */}
        <Card className="fin-card">
          <div className="fin-card-header flex items-center gap-2">
            <Lock size={20} className="text-primary" />
            <h3 className="font-semibold text-foreground">Security Settings</h3>
          </div>
          <div className="fin-card-content space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Change Password
              </label>
              <div className="space-y-3">
                <Input
                  type="password"
                  placeholder="Current Password"
                />
                <Input
                  type="password"
                  placeholder="New Password"
                />
                <Input
                  type="password"
                  placeholder="Confirm New Password"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-foreground">
                    Two-Factor Authentication
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security
                  </p>
                </div>
                <Switch />
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-foreground">
                    Login Alerts
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Get notified of new logins
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <Button className="gap-2 w-full sm:w-auto">
              <Save size={18} />
              Update Security
            </Button>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="fin-card">
          <div className="fin-card-header flex items-center gap-2">
            <Bell size={20} className="text-primary" />
            <h3 className="font-semibold text-foreground">
              Notification Settings
            </h3>
          </div>
          <div className="fin-card-content space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground">
                  Email Notifications
                </h4>
                <p className="text-sm text-muted-foreground">
                  Receive updates via email
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-foreground">
                    Transaction Alerts
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Get notified for large transactions
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">
                    Weekly Summary
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly activity summary
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Notification Email
              </label>
              <Select defaultValue="primary">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">john@example.com</SelectItem>
                  <SelectItem value="secondary">john.doe@work.com</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="gap-2 w-full sm:w-auto">
              <Save size={18} />
              Save Preferences
            </Button>
          </div>
        </Card>

        {/* Preferences */}
        <Card className="fin-card">
          <div className="fin-card-header">
            <h3 className="font-semibold text-foreground">Preferences</h3>
          </div>
          <div className="fin-card-content space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Currency
              </label>
              <Select defaultValue="usd">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">US Dollar (USD)</SelectItem>
                  <SelectItem value="eur">Euro (EUR)</SelectItem>
                  <SelectItem value="gbp">British Pound (GBP)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Theme
              </label>
              <Select defaultValue="light">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="auto">Auto (System)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="gap-2 w-full sm:w-auto">
              <Save size={18} />
              Save Preferences
            </Button>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="fin-card border-destructive/50 bg-destructive/5">
          <div className="fin-card-header border-destructive/20">
            <h3 className="font-semibold text-destructive">Danger Zone</h3>
          </div>
          <div className="fin-card-content space-y-3">
            <div>
              <h4 className="font-medium text-foreground mb-1">
                Delete Account
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Permanently delete your account and all associated data. This action
                cannot be undone.
              </p>
              <Button
                variant="outline"
                className="gap-2 text-destructive hover:bg-destructive/10"
              >
                <Trash2 size={18} />
                Delete Account
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
