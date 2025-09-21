#!/usr/bin/env python3
"""
Debug simple processor
"""

import re

def debug_simple():
    test_data = """
    DATE        DESCRIPTION                    WITHDRAWAL    DEPOSIT    BALANCE
    06/01       Rent Bill                      $670.00                  $33,902.23
    06/03       Check No. 3456, Payment from Nala Spencer    $740.00   $34,642.23
    06/15       Deposit                                        $7,245.00 $41,463.93
    """
    
    date_pattern = r'\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?'
    amount_pattern = r'\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)'
    
    lines = test_data.split('\n')
    
    print("Debugging simple processor...")
    print("=" * 50)
    
    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            continue
            
        print(f"\nLine {i+1}: {line}")
        
        # Check for date and amount
        has_date = bool(re.search(date_pattern, line))
        has_amount = bool(re.search(amount_pattern, line))
        
        print(f"  has_date: {has_date}")
        print(f"  has_amount: {has_amount}")
        
        if has_date and has_amount:
            # Check if it's a header line
            is_header = any(word in line.lower() for word in ['date', 'description', 'withdrawal', 'deposit', 'balance'])
            print(f"  is_header: {is_header}")
            
            if not is_header:
                print("  -> This should be processed as a transaction")
            else:
                print("  -> This is a header line, skipping")
        else:
            print("  -> No date or amount found")

if __name__ == "__main__":
    debug_simple()
