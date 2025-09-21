#!/usr/bin/env python3
"""
Detailed debug script for transaction parsing
"""

from pdf_processor import BankStatementProcessor
import re

def debug_parsing():
    processor = BankStatementProcessor()
    
    # Test data
    test_data = """
    Date        Description                    Amount
    01/15/2024  STARBUCKS COFFEE #1234        -5.75
    01/14/2024  AMAZON.COM AMZN.COM/BILL      -89.99
    01/13/2024  SHELL OIL 12345               -45.20
    01/12/2024  NETFLIX.COM NETFLIX.COM       -15.99
    01/11/2024  SALARY DEPOSIT                3500.00
    01/10/2024  UBER TRIP HELP                -12.50
    """
    
    print("Testing detailed parsing...")
    print("=" * 60)
    
    # Extract text
    text = processor.extract_text_from_pdf(test_data.encode('utf-8'))
    print(f"Extracted text:\n{text}")
    print("\n" + "=" * 60)
    
    # Find transaction lines
    lines = processor.find_transaction_lines(text)
    print(f"Found {len(lines)} transaction lines:")
    for i, line in enumerate(lines):
        print(f"  {i+1}: {line}")
    
    print("\n" + "=" * 60)
    
    # Parse each line
    for i, line in enumerate(lines):
        print(f"\nParsing line {i+1}: {line}")
        
        # Test regex patterns
        for j, pattern in enumerate(processor.transaction_patterns):
            match = re.search(pattern, line)
            if match:
                print(f"  Pattern {j+1} MATCH: {match.groups()}")
                
                # Test date parsing
                date_str = match.groups()[0] if re.match(processor.date_pattern, match.groups()[0]) else match.groups()[1]
                date = processor.parse_date(date_str)
                print(f"  Date parsing: '{date_str}' -> {date}")
                
                # Test amount parsing
                amount_str = match.groups()[2] if re.match(processor.amount_pattern, match.groups()[2]) else match.groups()[1]
                amount = processor.parse_amount(amount_str)
                print(f"  Amount parsing: '{amount_str}' -> {amount}")
                
                if date and amount is not None:
                    print(f"  ✅ VALID TRANSACTION")
                else:
                    print(f"  ❌ INVALID TRANSACTION")
            else:
                print(f"  Pattern {j+1} no match")

if __name__ == "__main__":
    debug_parsing()
