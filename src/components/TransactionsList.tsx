import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/lib/format";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface Transaction {
  _id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  merchant?: string;
  transactionType: "debit" | "credit";
}

interface TransactionsListProps {
  transactions: Transaction[];
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  return (
    <Card className="bg-[#111111] border-[#333]">
      <CardHeader>
        <CardTitle className="text-[#f5f5f5]">Recent Transactions</CardTitle>
        <CardDescription className="text-[#888]">
          Your latest financial activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#1a1a1a] border border-[#333] hover:border-[#555] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      transaction.transactionType === "credit" 
                        ? "bg-[#00ff88]/20 text-[#00ff88]" 
                        : "bg-[#ff0080]/20 text-[#ff0080]"
                    }`}>
                      {transaction.transactionType === "credit" ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-[#f5f5f5] truncate max-w-[200px]">
                        {transaction.merchant || transaction.description}
                      </p>
                      {transaction.merchant && transaction.merchant !== transaction.description && (
                        <p className="text-xs text-[#888] truncate max-w-[200px]">
                          {transaction.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-[#888]">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                        <Badge 
                          variant="secondary" 
                          className="text-xs bg-[#333] text-[#ccc] hover:bg-[#444]"
                        >
                          {transaction.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.transactionType === "credit" 
                        ? "text-[#00ff88]" 
                        : "text-[#ff0080]"
                    }`}>
                      {transaction.transactionType === "credit" ? "+" : "-"}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-[#888]">
            <div className="text-center">
              <ArrowUpRight className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No transactions found</p>
              <p className="text-sm mt-1">Upload a bank statement to see your transactions</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
