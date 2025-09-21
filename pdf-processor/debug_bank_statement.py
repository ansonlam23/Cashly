#!/usr/bin/env python3
"""
Debug bank statement parsing
"""

import re

def debug_bank_statement():
    # Test data
    test_lines = [
        "06/01       Rent Bill                      $670.00                  $33,902.23",
        "06/03       Check No. 3456, Payment from Nala Spencer    $740.00   $34,642.23",
        "06/15       Deposit                                        $7,245.00 $41,463.93",
    ]
    
    # Test patterns
    patterns = [
        # Pattern 4: Bank statement format - Date, Description, Withdrawal, Deposit, Balance
        r'(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\s+(.+?)\s+(?:Withdrawal:\s*\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?))?\s*(?:Deposit:\s*\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?))?\s*(?:Balance:\s*\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?))?',
        # Pattern 5: Simplified bank statement - Date, Description, Amount (with $)
        r'(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\s+(.+?)\s+\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)',
        # New pattern for bank statement format
        r'(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\s+(.+?)\s+\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s+\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)',
    ]
    
    print("Testing bank statement patterns...")
    print("=" * 60)
    
    for i, line in enumerate(test_lines):
        print(f"\nLine {i+1}: {line}")
        found_match = False
        
        for j, pattern in enumerate(patterns):
            match = re.search(pattern, line)
            if match:
                print(f"  Pattern {j+1} MATCH: {match.groups()}")
                found_match = True
            else:
                print(f"  Pattern {j+1} no match")
        
        if not found_match:
            print("  NO MATCHES FOUND")

if __name__ == "__main__":
    debug_bank_statement()
