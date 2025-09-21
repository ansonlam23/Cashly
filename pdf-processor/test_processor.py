#!/usr/bin/env python3
"""
Test script for PDF processor
"""

from pdf_processor import BankStatementProcessor
import base64

def test_processor():
    processor = BankStatementProcessor()
    
    # Test with a simple mock PDF-like string
    test_data = """
    Date        Description                    Amount
    01/15/2024  STARBUCKS COFFEE #1234        -5.75
    01/14/2024  AMAZON.COM AMZN.COM/BILL      -89.99
    01/13/2024  SHELL OIL 12345               -45.20
    01/12/2024  NETFLIX.COM NETFLIX.COM       -15.99
    01/11/2024  SALARY DEPOSIT                3500.00
    01/10/2024  UBER TRIP HELP                -12.50
    """
    
    # Convert to bytes
    test_bytes = test_data.encode('utf-8')
    
    print("Testing PDF processor...")
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
        for i, tx in enumerate(result['transactions'][:3]):  # Show first 3
            print(f"  {i+1}. {tx['date']} - {tx['description']} - ${tx['amount']}")
    else:
        print("No transactions found")

if __name__ == "__main__":
    test_processor()
