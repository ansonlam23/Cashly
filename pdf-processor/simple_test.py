#!/usr/bin/env python3
"""
Simple test with basic pattern
"""

import re

def test_simple():
    # Test data
    test_line = "06/01       Rent Bill                      $670.00                  $33,902.23"
    
    # Very simple pattern
    pattern = r'(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\s+(.+?)\s+\$(\d+\.\d{2})'
    
    print(f"Testing line: {test_line}")
    print(f"Pattern: {pattern}")
    
    match = re.search(pattern, test_line)
    if match:
        print(f"MATCH: {match.groups()}")
    else:
        print("NO MATCH")
        
        # Try to debug why it's not matching
        print("\nDebugging:")
        print(f"Date part: {test_line[:10]}")
        print(f"Description part: {test_line[10:50]}")
        print(f"Amount part: {test_line[50:60]}")
        
        # Try a simpler pattern
        simple_pattern = r'(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\s+(.+?)\s+\$(\d+\.\d{2})'
        match2 = re.search(simple_pattern, test_line)
        if match2:
            print(f"Simple pattern MATCH: {match2.groups()}")
        else:
            print("Simple pattern NO MATCH")

if __name__ == "__main__":
    test_simple()
