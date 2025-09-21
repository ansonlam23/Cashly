#!/usr/bin/env python3
"""
Test script for bank statement format
"""

from pdf_processor import BankStatementProcessor
import base64

def test_bank_statement():
    processor = BankStatementProcessor()
    
    # Test with bank statement format
    test_data = """
    DATE        DESCRIPTION                    WITHDRAWAL    DEPOSIT    BALANCE
    06/01       Rent Bill                      $670.00                  $33,902.23
    06/03       Check No. 3456, Payment from Nala Spencer    $740.00   $34,642.23
    06/08       Electric Bill                  $347.85                  $34,294.38
    06/13       Phone Bill                     $75.45                   $34,218.93
    06/15       Deposit                                        $7,245.00 $41,463.93
    06/18       Debit Transaction, Photography Tools Warehouse $339.96  $41,123.97
    06/24       Deposit                                        $3,255.00 $44,378.97
    06/25       Internet Bill                  $88.88                   $44,290.09
    06/28       Check No. 0231, Payment from Kyubi Tayler    $935.00   $45,225.09
    06/29       Payroll Run                    $6,493.65                $38,731.44
    06/30       Debit Transaction, Picture Perfect Equipments $1,234.98 $37,496.46
    06/30       Interest Earned                                $18.75    $37,515.21
    06/30       Withholding Tax                $3.75                    $37,511.46
    """
    
    # Convert to bytes
    test_bytes = test_data.encode('utf-8')
    
    print("Testing bank statement format...")
    print("Input data:")
    print(test_data)
    print("\nProcessing...")
    
    result = processor.process_pdf(test_bytes)
    
    print("\nResult:")
    print(f"Success: {result['success']}")
    print(f"Transactions found: {len(result['transactions'])}")
    print(f"Error: {result.get('error', 'None')}")
    
    if result['transactions']:
        print("\nTransactions:")
        for i, tx in enumerate(result['transactions'][:5]):  # Show first 5
            print(f"  {i+1}. {tx['date']} - {tx['description']} - ${tx['amount']} ({tx['transactionType']})")
    else:
        print("No transactions found")

if __name__ == "__main__":
    test_bank_statement()
