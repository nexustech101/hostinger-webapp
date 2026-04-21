import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Plus,
  Send,
  Download,
  Trash2,
  Eye,
  Copy,
} from "lucide-react";
import { useState } from "react";

// Mock invoices
const mockInvoices = [
  {
    id: "inv-1",
    invoiceNumber: "INV-001",
    clientName: "Acme Corporation",
    clientEmail: "billing@acme.com",
    total: 2700.0,
    status: "sent",
    dueDate: "2024-02-10",
    createdAt: "2024-01-10",
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-002",
    clientName: "Tech Startup Inc",
    clientEmail: "accounts@techstartup.com",
    total: 5000.0,
    status: "draft",
    dueDate: "2024-02-15",
    createdAt: "2024-01-12",
  },
  {
    id: "inv-3",
    invoiceNumber: "INV-003",
    clientName: "Global Solutions Ltd",
    clientEmail: "finance@globalsolutions.com",
    total: 1500.0,
    status: "paid",
    dueDate: "2024-01-28",
    createdAt: "2024-01-05",
  },
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredInvoices = invoices.filter((inv) =>
    filterStatus === "all" ? true : inv.status === filterStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-700";
      case "sent":
        return "bg-blue-100 text-blue-700";
      case "paid":
        return "bg-green-100 text-green-700";
      case "overdue":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusCapitalized = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <AppLayout title="Invoices">
      <div className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Invoices
            </h2>
            <p className="text-muted-foreground">
              Create and manage invoices for your clients
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={18} />
                Create Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
                <DialogDescription>
                  Fill in the details below to create a new invoice
                </DialogDescription>
              </DialogHeader>
              <CreateInvoiceForm onClose={() => setIsCreateOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="fin-card">
          <div className="fin-card-content flex flex-wrap gap-2">
            {["all", "draft", "sent", "paid", "overdue"].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(status)}
              >
                {status === "all" ? "All Invoices" : getStatusCapitalized(status)}
              </Button>
            ))}
          </div>
        </Card>

        {/* Invoices List */}
        <div className="space-y-3">
          {filteredInvoices.length > 0 ? (
            filteredInvoices.map((invoice) => (
              <Card key={invoice.id} className="fin-card hover:shadow-md transition-shadow">
                <div className="fin-card-content">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText size={20} className="text-primary" />
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {invoice.invoiceNumber}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {invoice.clientName}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Due: {invoice.dueDate}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">
                        ${invoice.total.toFixed(2)}
                      </p>
                      <span
                        className={`inline-block px-3 py-1 rounded text-xs font-medium ${getStatusColor(
                          invoice.status
                        )}`}
                      >
                        {getStatusCapitalized(invoice.status)}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        title="View invoice"
                      >
                        <Eye size={16} />
                      </Button>

                      {invoice.status === "draft" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            title="Send to client"
                          >
                            <Send size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 text-destructive hover:text-destructive"
                            title="Delete invoice"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </>
                      )}

                      {invoice.status === "sent" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          title="Copy payment link"
                        >
                          <Copy size={16} />
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        title="Download as PDF"
                      >
                        <Download size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="fin-card">
              <div className="fin-card-content text-center py-12">
                <FileText size={48} className="text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  {filterStatus === "all"
                    ? "No invoices yet. Create your first invoice!"
                    : `No ${filterStatus} invoices`}
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* Invoice Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="fin-card">
            <div className="fin-card-content">
              <p className="text-sm text-muted-foreground">Total Invoices</p>
              <p className="text-2xl font-bold text-foreground">{invoices.length}</p>
            </div>
          </Card>
          <Card className="fin-card">
            <div className="fin-card-content">
              <p className="text-sm text-muted-foreground">Paid</p>
              <p className="text-2xl font-bold text-success">
                ${invoices
                  .filter((i) => i.status === "paid")
                  .reduce((sum, i) => sum + i.total, 0)
                  .toFixed(2)}
              </p>
            </div>
          </Card>
          <Card className="fin-card">
            <div className="fin-card-content">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-warning">
                ${invoices
                  .filter((i) => i.status === "sent")
                  .reduce((sum, i) => sum + i.total, 0)
                  .toFixed(2)}
              </p>
            </div>
          </Card>
          <Card className="fin-card">
            <div className="fin-card-content">
              <p className="text-sm text-muted-foreground">Draft</p>
              <p className="text-2xl font-bold">
                {invoices.filter((i) => i.status === "draft").length}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

function CreateInvoiceForm({ onClose }: { onClose: () => void }) {
  const [lineItems, setLineItems] = useState([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);

  const addLineItem = () => {
    setLineItems([...lineItems, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call API to create invoice
    console.log("Create invoice:", lineItems);
    onClose();
  };

  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Client Name
          </label>
          <Input placeholder="Acme Corporation" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Client Email
          </label>
          <Input type="email" placeholder="billing@acme.com" required />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Client Address
        </label>
        <Textarea placeholder="123 Business Street, City, State 12345" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Issue Date
          </label>
          <Input type="date" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Due Date
          </label>
          <Input type="date" required />
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-foreground">
            Line Items
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addLineItem}
            className="gap-2"
          >
            <Plus size={16} />
            Add Item
          </Button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {lineItems.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                placeholder="Description"
                value={item.description}
                onChange={(e) => {
                  const updated = [...lineItems];
                  updated[index].description = e.target.value;
                  setLineItems(updated);
                }}
                className="flex-1 px-2 py-1 border border-input rounded text-sm"
              />
              <input
                type="number"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => {
                  const updated = [...lineItems];
                  updated[index].quantity = parseInt(e.target.value) || 0;
                  setLineItems(updated);
                }}
                className="w-16 px-2 py-1 border border-input rounded text-sm"
              />
              <input
                type="number"
                placeholder="Price"
                value={item.unitPrice}
                onChange={(e) => {
                  const updated = [...lineItems];
                  updated[index].unitPrice = parseFloat(e.target.value) || 0;
                  setLineItems(updated);
                }}
                className="w-20 px-2 py-1 border border-input rounded text-sm"
              />
              <button
                type="button"
                onClick={() => removeLineItem(index)}
                className="text-destructive hover:bg-destructive/10 p-1 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-secondary/30 p-3 rounded space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (8%):</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-base border-t pt-1">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Notes (Optional)
        </label>
        <Textarea placeholder="Thank you for your business!" />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Create Invoice</Button>
      </div>
    </form>
  );
}
