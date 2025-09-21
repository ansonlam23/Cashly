import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import { TrendingUp, Store, ShoppingBag, Coffee, Car, Utensils } from "lucide-react";

interface Merchant {
  merchant: string;
  amount: number;
  transactionCount: number;
  category: string;
}

interface TopMerchantsProps {
  merchants: Merchant[];
}

const MERCHANT_ICONS: Record<string, any> = {
  "Amazon": ShoppingBag,
  "Starbucks": Coffee,
  "McDonald's": Utensils,
  "Target": Store,
  "Walmart": Store,
  "Uber": Car,
  "Netflix": TrendingUp,
  "Spotify": TrendingUp,
  "Apple": Store,
  "Google": Store,
  "Microsoft": Store,
  "Whole Foods": Store,
  "Costco": Store,
  "Shell": Car,
  "Exxon": Car,
  "CVS": Store,
  "Walgreens": Store,
  "Home Depot": Store,
  "Lowe's": Store,
  "Best Buy": Store,
};

const CATEGORY_COLORS: Record<string, string> = {
  "Food and Drink": "bg-orange-500",
  "Coffee Shops": "bg-amber-500",
  "Transportation": "bg-blue-500",
  "Shopping": "bg-purple-500",
  "Entertainment": "bg-pink-500",
  "Groceries": "bg-green-500",
  "Restaurants": "bg-red-500",
  "Gas": "bg-yellow-500",
  "Online Shopping": "bg-indigo-500",
  "Other": "bg-gray-500",
};

export function TopMerchants({ merchants }: TopMerchantsProps) {
  const topMerchants = merchants.slice(0, 5);

  return (
    <Card className="bg-[#111111] border-[#333]">
      <CardHeader>
        <CardTitle className="text-[#f5f5f5] flex items-center gap-2">
          <Store className="h-5 w-5" />
          Top Merchants
        </CardTitle>
        <CardDescription className="text-[#888]">
          Where you spend the most money
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topMerchants.length > 0 ? (
            topMerchants.map((merchant, index) => {
              const IconComponent = MERCHANT_ICONS[merchant.merchant] || Store;
              const categoryColor = CATEGORY_COLORS[merchant.category] || "bg-gray-500";
              
              return (
                <div key={merchant.merchant} className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg hover:bg-[#222] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-[#333] rounded-full">
                      <span className="text-sm font-bold text-[#f5f5f5]">#{index + 1}</span>
                    </div>
                    <IconComponent className="h-5 w-5 text-[#888]" />
                    <div>
                      <div className="font-medium text-[#f5f5f5]">{merchant.merchant}</div>
                      <div className="text-sm text-[#888]">
                        {merchant.transactionCount} transaction{merchant.transactionCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={`${categoryColor} text-white`}>
                      {merchant.category}
                    </Badge>
                    <div className="text-right">
                      <div className="font-bold text-[#f5f5f5]">{formatCurrency(merchant.amount)}</div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-[#888]">
              <Store className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No merchant data available</p>
              <p className="text-sm mt-1">Add some transactions to see your top merchants</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
