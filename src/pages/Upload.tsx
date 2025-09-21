import { useAuth } from "@/hooks/use-auth";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useRef } from "react";
import { Loader2, Upload as UploadIcon, FileText, CheckCircle, AlertTriangle, Eye, Save, X } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ExtractedTransaction {
  date: string;
  description: string;
  amount: number;
  merchant?: string;
  category: string;
  transactionType: "debit" | "credit";
}

interface ProcessingResult {
  success: boolean;
  transactions: ExtractedTransaction[];
  summary: {
    totalTransactions: number;
    totalIncome: number;
    totalExpenses: number;
    netFlow: number;
    uniqueMerchants: number;
    categories: Record<string, number>;
  };
  error?: string;
}

export default function Upload() {
  const { isLoading, isAuthenticated } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{ success: boolean; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const processPDF = useAction(api.pdfUpload.processPDFUpload);
  const saveTransactions = useAction(api.pdfUpload.saveExtractedTransactions);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setProcessingResult(null);
      setSaveResult(null);
    } else {
      alert('Please select a valid PDF file');
    }
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setProcessingResult(null);
      setSaveResult(null);
    } else {
      alert('Please drop a valid PDF file');
    }
  };

  const handleProcessPDF = async () => {
    if (!file) return;

    // Check file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setProcessingResult({
        success: false,
        transactions: [],
        summary: {
          totalTransactions: 0,
          totalIncome: 0,
          totalExpenses: 0,
          netFlow: 0,
          uniqueMerchants: 0,
          categories: {}
        },
        error: 'File too large. Please upload a PDF smaller than 10MB.'
      });
      return;
    }

    setIsProcessing(true);
    setSaveResult(null);

    try {
      // Convert file to base64 using FileReader (more efficient for large files)
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove data URL prefix to get just the base64 string
          const base64String = result.split(',')[1];
          resolve(base64String);
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });

      console.log('PDF file info:', {
        name: file.name,
        size: file.size,
        type: file.type,
        base64Length: base64.length
      });

      // Process PDF
      const result = await processPDF({
        pdfData: base64,
        fileName: file.name,
      });

      console.log('Processing result:', result);
      setProcessingResult(result as ProcessingResult);
    } catch (error) {
      console.error('Error processing PDF:', error);
      setProcessingResult({
        success: false,
        transactions: [],
        summary: {
          totalTransactions: 0,
          totalIncome: 0,
          totalExpenses: 0,
          netFlow: 0,
          uniqueMerchants: 0,
          categories: {}
        },
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveTransactions = async () => {
    if (!processingResult?.transactions.length) return;

    setIsSaving(true);

    try {
      const result = await saveTransactions({
        transactions: processingResult.transactions,
        fileName: file?.name || 'unknown.pdf',
      });

      setSaveResult({
        success: true,
        message: `Successfully saved ${result.savedCount} transactions!`
      });
    } catch (error) {
      console.error('Error saving transactions:', error);
      setSaveResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to save transactions'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#00ff88]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#f5f5f5] mb-4">Authentication Required</h1>
          <p className="text-[#888]">Please log in to upload bank statements.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <Sidebar />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 ml-64 p-8"
      >
        <div className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-bold text-[#f5f5f5] mb-2 flex items-center gap-3"
          >
            <UploadIcon className="h-8 w-8 text-[#00ff88]" />
            Upload Bank Statement
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[#888]"
          >
            Upload your PDF bank statement to automatically extract and import transactions
          </motion.p>
        </div>

        <div className="space-y-6">
          {/* File Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-[#111111] border-[#333]">
              <CardHeader>
                <CardTitle className="text-[#f5f5f5] flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Upload PDF Bank Statement
                </CardTitle>
                <CardDescription className="text-[#888]">
                  Select or drag and drop your bank statement PDF file
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    file
                      ? 'border-[#00ff88] bg-[#00ff88]/5'
                      : 'border-[#333] hover:border-[#555]'
                  }`}
                  onDrop={handleFileDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={(e) => e.preventDefault()}
                >
                  {file ? (
                    <div className="space-y-4">
                      <CheckCircle className="h-12 w-12 text-[#00ff88] mx-auto" />
                      <div>
                        <p className="text-[#f5f5f5] font-medium">{file.name}</p>
                        <p className="text-sm text-[#888]">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <div className="flex gap-2 justify-center">
                        <Button
                          onClick={handleProcessPDF}
                          disabled={isProcessing}
                          className="bg-[#00ff88] hover:bg-[#00cc6a] text-black"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Extract Transactions
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setFile(null);
                            setProcessingResult(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <UploadIcon className="h-12 w-12 text-[#888] mx-auto" />
                      <div>
                        <p className="text-[#f5f5f5] font-medium mb-2">
                          Drop your PDF here, or click to browse
                        </p>
                        <p className="text-sm text-[#888]">
                          Supported format: PDF files only
                        </p>
                      </div>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="border-[#333] text-[#f5f5f5] hover:bg-[#1a1a1a]"
                      >
                        <UploadIcon className="h-4 w-4 mr-2" />
                        Choose File
                      </Button>
                    </div>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Processing Progress */}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-[#111111] border-[#0088ff]">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-[#0088ff] mx-auto" />
                    <div>
                      <p className="text-[#f5f5f5] font-medium">Processing PDF...</p>
                      <p className="text-sm text-[#888]">
                        Extracting transactions from your bank statement
                      </p>
                    </div>
                    <Progress value={66} className="w-full max-w-xs mx-auto" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Processing Results */}
          {processingResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {processingResult.success ? (
                <>
                  {/* Summary */}
                  <Card className="bg-[#111111] border-[#00ff88]">
                    <CardHeader>
                      <CardTitle className="text-[#00ff88] flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Extraction Successful
                      </CardTitle>
                      <CardDescription className="text-[#888]">
                        Found {processingResult.summary.totalTransactions} transactions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-[#f5f5f5]">
                            {processingResult.summary.totalTransactions}
                          </div>
                          <div className="text-sm text-[#888]">Transactions</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-[#00ff88]">
                            {formatCurrency(processingResult.summary.totalIncome)}
                          </div>
                          <div className="text-sm text-[#888]">Total Income</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-[#ff0080]">
                            {formatCurrency(processingResult.summary.totalExpenses)}
                          </div>
                          <div className="text-sm text-[#888]">Total Expenses</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${
                            processingResult.summary.netFlow >= 0 ? 'text-[#00ff88]' : 'text-[#ff0080]'
                          }`}>
                            {formatCurrency(processingResult.summary.netFlow)}
                          </div>
                          <div className="text-sm text-[#888]">Net Flow</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Category Breakdown */}
                  <Card className="bg-[#111111] border-[#333]">
                    <CardHeader>
                      <CardTitle className="text-[#f5f5f5]">Category Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(processingResult.summary.categories).map(([category, amount]) => (
                          <Badge key={category} className="bg-[#00ff88] text-black">
                            {category}: {formatCurrency(amount)}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Transactions Preview */}
                  <Card className="bg-[#111111] border-[#333]">
                    <CardHeader>
                      <CardTitle className="text-[#f5f5f5]">Transaction Preview</CardTitle>
                      <CardDescription className="text-[#888]">
                        Review the extracted transactions before saving
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="max-h-96 overflow-y-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Merchant</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {processingResult.transactions.slice(0, 20).map((transaction, index) => (
                              <TableRow key={index}>
                                <TableCell className="text-[#f5f5f5]">
                                  {formatDate(transaction.date)}
                                </TableCell>
                                <TableCell className="text-[#f5f5f5]">
                                  {transaction.description}
                                </TableCell>
                                <TableCell className="text-[#888]">
                                  {transaction.merchant || '-'}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="border-[#333] text-[#888]">
                                    {transaction.category}
                                  </Badge>
                                </TableCell>
                                <TableCell className={`text-right font-medium ${
                                  transaction.amount >= 0 ? 'text-[#00ff88]' : 'text-[#ff0080]'
                                }`}>
                                  {formatCurrency(transaction.amount)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        {processingResult.transactions.length > 20 && (
                          <p className="text-sm text-[#888] mt-4 text-center">
                            ... and {processingResult.transactions.length - 20} more transactions
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Save Button */}
                  <div className="flex justify-center">
                    <Button
                      onClick={handleSaveTransactions}
                      disabled={isSaving}
                      className="bg-[#00ff88] hover:bg-[#00cc6a] text-black px-8 py-3 text-lg"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Saving Transactions...
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5 mr-2" />
                          Save All Transactions
                        </>
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                /* Error State */
                <Card className="bg-[#111111] border-[#ff0080]">
                  <CardHeader>
                    <CardTitle className="text-[#ff0080] flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Processing Failed
                    </CardTitle>
                    <CardDescription className="text-[#888]">
                      {processingResult.error || 'Unknown error occurred'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#f5f5f5]">
                      Please try uploading a different PDF file or check if the file is a valid bank statement.
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {/* Save Result */}
          {saveResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`bg-[#111111] border-2 ${
                saveResult.success ? 'border-[#00ff88]' : 'border-[#ff0080]'
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    {saveResult.success ? (
                      <CheckCircle className="h-6 w-6 text-[#00ff88]" />
                    ) : (
                      <AlertTriangle className="h-6 w-6 text-[#ff0080]" />
                    )}
                    <p className={`font-medium ${
                      saveResult.success ? 'text-[#00ff88]' : 'text-[#ff0080]'
                    }`}>
                      {saveResult.message}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
