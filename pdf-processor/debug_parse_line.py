#!/usr/bin/env python3
"""
Debug parse_line function
"""

import re
from datetime import datetime

def debug_parse_line():
    test_line = "06/01       Rent Bill                      $670.00                  $33,902.23"
    
    date_pattern = r'\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?'
    amount_pattern = r'\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)'
    
    print(f"Testing line: {test_line}")
    
    # Find date
    date_match = re.search(date_pattern, test_line)
    print(f"Date match: {date_match}")
    if date_match:
        date_str = date_match.group()
        print(f"Date string: {date_str}")
    
    # Find amounts
    amount_matches = re.findall(amount_pattern, test_line)
    print(f"Amount matches: {amount_matches}")
    
    if amount_matches:
        amount_str = amount_matches[0]
        print(f"First amount: {amount_str}")
        amount = float(amount_str.replace(',', ''))
        print(f"Parsed amount: {amount}")
    
    # Check withdrawal keywords
    withdrawal_keywords = ['bill', 'withdrawal', 'debit', 'payment', 'rent', 'electric', 'phone', 'internet', 'payroll', 'tax']
    is_withdrawal = any(keyword in test_line.lower() for keyword in withdrawal_keywords)
    print(f"Is withdrawal: {is_withdrawal}")
    
    # Extract description
    if date_match:
        date_end = date_match.end()
        amount_start = test_line.find('$' + amount_matches[0])
        description = test_line[date_end:amount_start].strip()
        print(f"Description: '{description}'")
    
    # Test date parsing
    if date_match:
        date_str = date_match.group()
        date_formats = [
            '%m/%d/%Y', '%m-%d-%Y', '%m/%d/%y', '%m-%d-%y',
            '%d/%m/%Y', '%d-%m-%Y', '%d/%m/%y', '%d-%m-%y',
            '%Y-%m-%d', '%Y/%m/%d'
        ]
        
        date_parsed = None
        for fmt in date_formats:
            try:
                date_parsed = datetime.strptime(date_str, fmt)
                print(f"Date parsed with format {fmt}: {date_parsed}")
                break
            except ValueError:
                continue
        
        if not date_parsed:
            print("Date parsing failed")

if __name__ == "__main__":
    debug_parse_line()
