import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navigate } from "react-router";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/lib/format";
import { Trash2, ArrowUpRight, ArrowDownRight, Search, Filter, Loader2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Sidebar } from "@/components/Sidebar";

export default function Transactions() {
  const { isLoading, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [deleteTransactionId, setDeleteTransactionId] = useState<string | null>(null);

  const transactions = useQuery(api.transactions.getTransactionsByUser, { limit: 1000 });
  const deleteTransaction = useMutation(api.transactions.deleteTransaction);

  // Get unique categories for filter
  const categories = transactions ? [...new Set(transactions.map(t => t.category))] : [];

  // Filter transactions
  const filteredTransactions = transactions?.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.merchant && transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter;
    const matchesType = typeFilter === "all" || 
                       (typeFilter === "income" && transaction.transactionType === "credit") ||
                       (typeFilter === "expense" && transaction.transactionType === "debit");
    
    return matchesSearch && matchesCategory && matchesType;
  }) || [];

  const handleDeleteTransaction = async () => {
    if (deleteTransactionId) {
      try {
        await deleteTransaction({ id: deleteTransactionId as any });
        setDeleteTransactionId(null);
      } catch (error) {
        console.error("Failed to delete transaction:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#00ff88]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  if (!transactions) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ff88] mx-auto mb-4"></div>
          <p className="text-[#888]">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5]">
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 ml-64 p-6">
          <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-[#f5f5f5] mb-2">All Transactions</h1>
            <p className="text-[#888] text-lg">
              View and manage all your financial transactions
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-[#111111] border-[#333] mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#888] h-4 w-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#1a1a1a] border-[#333] text-[#f5f5f5] pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-[#1a1a1a] border-[#333] text-[#f5f5f5]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-[#333]">
                  <SelectItem value="all" className="text-[#f5f5f5]">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category} className="text-[#f5f5f5]">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-[#1a1a1a] border-[#333] text-[#f5f5f5]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-[#333]">
                  <SelectItem value="all" className="text-[#f5f5f5]">All Types</SelectItem>
                  <SelectItem value="income" className="text-[#f5f5f5]">Income</SelectItem>
                  <SelectItem value="expense" className="text-[#f5f5f5]">Expenses</SelectItem>
                </SelectContent>
              </Select>

              {/* Results Count */}
              <div className="flex items-center text-[#888]">
                <Filter className="h-4 w-4 mr-2" />
                {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
              </div>
            </div>
          </CardContent>
        </Card>
          </motion.div>

          {/* Transactions List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-[#111111] border-[#333]">
          <CardHeader>
            <CardTitle className="text-[#f5f5f5]">Transaction History</CardTitle>
            <CardDescription className="text-[#888]">
              {filteredTransactions.length === 0 
                ? "No transactions found matching your filters"
                : `Showing ${filteredTransactions.length} transaction${filteredTransactions.length !== 1 ? 's' : ''}`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-[#888] text-lg mb-2">No transactions found</div>
                <p className="text-[#666]">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {filteredTransactions.map((transaction, index) => (
                    <motion.div
                      key={transaction._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#222] transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {/* Transaction Icon */}
                        <div className="flex-shrink-0">
                          {transaction.transactionType === "credit" ? (
                            <div className="w-10 h-10 bg-[#00ff88]/20 rounded-full flex items-center justify-center">
                              <ArrowUpRight className="h-5 w-5 text-[#00ff88]" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-[#ff0080]/20 rounded-full flex items-center justify-center">
                              <ArrowDownRight className="h-5 w-5 text-[#ff0080]" />
                            </div>
                          )}
                        </div>

                        {/* Transaction Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-medium text-[#f5f5f5] truncate">
                              {transaction.merchant || transaction.description}
                            </h3>
                            <Badge 
                              variant="secondary" 
                              className="text-xs bg-[#333] text-[#ccc] hover:bg-[#444]"
                            >
                              {transaction.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-[#888]">
                            <span>{new Date(transaction.date).toLocaleDateString()}</span>
                            {transaction.merchant && transaction.merchant !== transaction.description && (
                              <span className="truncate max-w-[200px]">
                                {transaction.description}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Amount and Actions */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className={`font-semibold text-lg ${
                            transaction.transactionType === "credit" 
                              ? "text-[#00ff88]" 
                              : "text-[#ff0080]"
                          }`}>
                            {transaction.transactionType === "credit" ? "+" : "-"}
                            {formatCurrency(Math.abs(transaction.amount))}
                          </div>
                        </div>

                        {/* Delete Button */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-[#888] hover:text-[#ff0080] hover:bg-[#ff0080]/10"
                              onClick={() => setDeleteTransactionId(transaction._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-[#111111] border-[#333]">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-[#f5f5f5]">Delete Transaction</AlertDialogTitle>
                              <AlertDialogDescription className="text-[#888]">
                                Are you sure you want to delete this transaction? This action cannot be undone.
                                <br />
                                <br />
                                <strong className="text-[#f5f5f5]">
                                  {transaction.merchant || transaction.description}
                                </strong>
                                <br />
                                <span className={`${
                                  transaction.transactionType === "credit" ? "text-[#00ff88]" : "text-[#ff0080]"
                                }`}>
                                  {transaction.transactionType === "credit" ? "+" : "-"}
                                  {formatCurrency(Math.abs(transaction.amount))}
                                </span>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-[#333] text-[#f5f5f5] hover:bg-[#444]">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleDeleteTransaction}
                                className="bg-[#ff0080] text-white hover:bg-[#ff0080]/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
          </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
