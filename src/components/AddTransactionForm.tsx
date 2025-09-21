import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AddTransactionFormProps {
  onAddTransaction: (transaction: {
    description: string;
    amount: number;
    category: string;
    merchant: string;
    date: string;
    transactionType: "debit" | "credit";
  }) => Promise<void>;
  isLoading: boolean;
}

const CATEGORIES = [
  "Food and Drink",
  "Transportation", 
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Travel",
  "Education",
  "Groceries",
  "Gas",
  "Restaurants",
  "Coffee Shops",
  "Online Shopping",
  "Clothing",
  "Home & Garden",
  "Personal Care",
  "Insurance",
  "Investments",
  "Income",
  "Other"
];

const MERCHANT_SUGGESTIONS = [
  "Amazon",
  "Starbucks", 
  "McDonald's",
  "Target",
  "Walmart",
  "Uber",
  "Netflix",
  "Spotify",
  "Apple",
  "Google",
  "Microsoft",
  "Whole Foods",
  "Costco",
  "Shell",
  "Exxon",
  "CVS",
  "Walgreens",
  "Home Depot",
  "Lowe's",
  "Best Buy"
];

export function AddTransactionForm({ onAddTransaction, isLoading }: AddTransactionFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    merchant: "",
    date: new Date(),
    transactionType: "debit" as "debit" | "credit"
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = "Amount must be a positive number";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.merchant.trim()) {
      newErrors.merchant = "Merchant is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onAddTransaction({
        description: formData.description,
        amount: Number(formData.amount),
        category: formData.category,
        merchant: formData.merchant,
        date: format(formData.date, "yyyy-MM-dd"),
        transactionType: formData.transactionType
      });

      // Reset form
      setFormData({
        description: "",
        amount: "",
        category: "",
        merchant: "",
        date: new Date(),
        transactionType: "debit"
      });
      setErrors({});
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to add transaction:", error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Card className="bg-[#111111] border-[#333]">
      <CardHeader>
        <CardTitle className="text-[#f5f5f5] flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Transaction
        </CardTitle>
        <CardDescription className="text-[#888]">
          Manually add a transaction to your financial records
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isOpen ? (
          <Button 
            onClick={() => setIsOpen(true)}
            className="w-full bg-[#00ff88] hover:bg-[#00cc6a] text-black font-semibold"
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Transaction
          </Button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-[#f5f5f5]">
                  Description *
                </Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="e.g., Coffee at Starbucks"
                  className="bg-[#1a1a1a] border-[#333] text-[#f5f5f5]"
                />
                {errors.description && (
                  <p className="text-sm text-red-400">{errors.description}</p>
                )}
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-[#f5f5f5]">
                  Amount *
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#888]">$</span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => handleInputChange("amount", e.target.value)}
                    placeholder="0.00"
                    className="bg-[#1a1a1a] border-[#333] text-[#f5f5f5] pl-8"
                  />
                </div>
                {errors.amount && (
                  <p className="text-sm text-red-400">{errors.amount}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-[#f5f5f5]">
                  Category *
                </Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className="bg-[#1a1a1a] border-[#333] text-[#f5f5f5]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-[#333]">
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category} className="text-[#f5f5f5] hover:bg-[#333]">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-400">{errors.category}</p>
                )}
              </div>

              {/* Merchant */}
              <div className="space-y-2">
                <Label htmlFor="merchant" className="text-[#f5f5f5]">
                  Merchant *
                </Label>
                <Input
                  id="merchant"
                  value={formData.merchant}
                  onChange={(e) => handleInputChange("merchant", e.target.value)}
                  placeholder="e.g., Starbucks"
                  list="merchant-suggestions"
                  className="bg-[#1a1a1a] border-[#333] text-[#f5f5f5]"
                />
                <datalist id="merchant-suggestions">
                  {MERCHANT_SUGGESTIONS.map((merchant) => (
                    <option key={merchant} value={merchant} />
                  ))}
                </datalist>
                {errors.merchant && (
                  <p className="text-sm text-red-400">{errors.merchant}</p>
                )}
              </div>

              {/* Transaction Type */}
              <div className="space-y-2">
                <Label htmlFor="transactionType" className="text-[#f5f5f5]">
                  Type *
                </Label>
                <Select value={formData.transactionType} onValueChange={(value: "debit" | "credit") => handleInputChange("transactionType", value)}>
                  <SelectTrigger className="bg-[#1a1a1a] border-[#333] text-[#f5f5f5]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-[#333]">
                    <SelectItem value="debit" className="text-[#f5f5f5] hover:bg-[#333]">
                      Debit (Money Out)
                    </SelectItem>
                    <SelectItem value="credit" className="text-[#f5f5f5] hover:bg-[#333]">
                      Credit (Money In)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label className="text-[#f5f5f5]">Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-[#1a1a1a] border-[#333] text-[#f5f5f5] hover:bg-[#333]",
                        !formData.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-[#1a1a1a] border-[#333]" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => date && handleInputChange("date", date)}
                      initialFocus
                      className="bg-[#1a1a1a]"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-[#00ff88] hover:bg-[#00cc6a] text-black font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add Transaction"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="border-[#333] text-[#f5f5f5] hover:bg-[#333]"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
