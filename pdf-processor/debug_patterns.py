#!/usr/bin/env python3
"""
Debug regex patterns for transaction extraction
"""

import re

def test_patterns():
    # Test data
    test_lines = [
        "01/15/2024  STARBUCKS COFFEE #1234        -5.75",
        "01/14/2024  AMAZON.COM AMZN.COM/BILL      -89.99",
        "01/13/2024  SHELL OIL 12345               -45.20",
        "01/12/2024  NETFLIX.COM NETFLIX.COM       -15.99",
        "01/11/2024  SALARY DEPOSIT                3500.00",
        "01/10/2024  UBER TRIP HELP                -12.50"
    ]
    
    # Current patterns
    patterns = [
        r'(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\s+(.+?)\s+([+-]?\$?\d{1,3}(?:,\d{3})*(?:\.\d{2})?)',
        r'(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\s+([+-]?\$?\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s+(.+)',
        r'(.+?)\s+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\s+([+-]?\$?\d{1,3}(?:,\d{3})*(?:\.\d{2})?)',
    ]
    
    print("Testing regex patterns...")
    print("=" * 50)
    
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
    
    # Test simpler patterns
    print("\n" + "=" * 50)
    print("Testing simpler patterns...")
    
    simple_patterns = [
        r'(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\s+(.+?)\s+([+-]?\d+\.?\d*)',
        r'(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\s+(.+?)\s+([+-]?\d+\.\d{2})',
    ]
    
    for i, line in enumerate(test_lines):
        print(f"\nLine {i+1}: {line}")
        for j, pattern in enumerate(simple_patterns):
            match = re.search(pattern, line)
            if match:
                print(f"  Simple Pattern {j+1} MATCH: {match.groups()}")
            else:
                print(f"  Simple Pattern {j+1} no match")

if __name__ == "__main__":
    test_patterns()
