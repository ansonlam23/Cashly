#!/usr/bin/env python3
"""
Simple PDF processor that works with bank statements
"""

import re
from datetime import datetime
from typing import List, Dict, Any, Optional

class SimpleBankStatementProcessor:
    def __init__(self):
        self.date_pattern = r'\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?'
        self.amount_pattern = r'\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)'
        
    def process_pdf(self, pdf_data: bytes) -> Dict[str, Any]:
        """Process PDF and extract transactions"""
        try:
            # Extract text
            text = pdf_data.decode('utf-8')
            
            # Find transaction lines
            lines = text.split('\n')
            transactions = []
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                    
                # Look for lines with date and amount
                if re.search(self.date_pattern, line) and re.search(self.amount_pattern, line):
                    # Skip header lines
                    if any(word in line.lower() for word in ['date', 'description', 'withdrawal', 'balance']):
                        continue
                    
                    # Parse the line
                    transaction = self.parse_line(line)
                    if transaction:
                        transactions.append(transaction)
            
            # Create summary
            total_income = sum(t['amount'] for t in transactions if t['amount'] > 0)
            total_expenses = sum(abs(t['amount']) for t in transactions if t['amount'] < 0)
            net_flow = total_income - total_expenses
            
            return {
                'success': True,
                'transactions': transactions,
                'summary': {
                    'totalTransactions': len(transactions),
                    'totalIncome': total_income,
                    'totalExpenses': total_expenses,
                    'netFlow': net_flow,
                    'uniqueMerchants': len(set(t['merchant'] for t in transactions)),
                    'categories': {}
                },
                'metadata': {
                    'processedAt': datetime.now().isoformat(),
                    'extractedTextLength': len(text),
                    'transactionLinesFound': len(transactions)
                }
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'transactions': [],
                'summary': {
                    'totalTransactions': 0,
                    'totalIncome': 0,
                    'totalExpenses': 0,
                    'netFlow': 0,
                    'uniqueMerchants': 0,
                    'categories': {}
                }
            }
    
    def parse_line(self, line: str) -> Optional[Dict[str, Any]]:
        """Parse a single transaction line"""
        # Find date
        date_match = re.search(self.date_pattern, line)
        if not date_match:
            return None
            
        date_str = date_match.group()
        
        # Find amounts
        amount_matches = re.findall(self.amount_pattern, line)
        if not amount_matches:
            return None
            
        # Get the first amount (usually the transaction amount)
        amount_str = amount_matches[0]
        amount = float(amount_str.replace(',', ''))
        
        # Determine if it's a withdrawal or deposit
        # Look for keywords that indicate withdrawal
        withdrawal_keywords = ['bill', 'withdrawal', 'debit', 'payment', 'rent', 'electric', 'phone', 'internet', 'payroll', 'tax']
        is_withdrawal = any(keyword in line.lower() for keyword in withdrawal_keywords)
        
        if is_withdrawal:
            amount = -abs(amount)
        else:
            amount = abs(amount)
        
        # Extract description (everything between date and first amount)
        date_end = date_match.end()
        amount_start = line.find('$' + amount_str)
        description = line[date_end:amount_start].strip()
        
        # Parse date
        date = self.parse_date(date_str)
        if not date:
            return None
            
        # Determine transaction type
        transaction_type = 'debit' if amount < 0 else 'credit'
        
        # Categorize
        category = self.categorize_transaction(description)
        
        return {
            'date': date.strftime('%Y-%m-%d'),
            'description': description,
            'amount': amount,
            'merchant': description,
            'category': category,
            'transactionType': transaction_type
        }
    
    def parse_date(self, date_str: str) -> Optional[datetime]:
        """Parse date string to datetime object"""
        date_formats = [
            '%m/%d/%Y', '%m-%d-%Y', '%m/%d/%y', '%m-%d-%y',
            '%d/%m/%Y', '%d-%m-%Y', '%d/%m/%y', '%d-%m-%y',
            '%Y-%m-%d', '%Y/%m/%d', '%m/%d', '%m-%d'
        ]
        
        for fmt in date_formats:
            try:
                parsed_date = datetime.strptime(date_str, fmt)
                # If no year specified, assume current year
                if parsed_date.year == 1900:
                    parsed_date = parsed_date.replace(year=2024)
                return parsed_date
            except ValueError:
                continue
        
        return None
    
    def categorize_transaction(self, description: str) -> str:
        """Categorize transaction based on description"""
        desc_lower = description.lower()
        
        if any(keyword in desc_lower for keyword in ['rent', 'electric', 'phone', 'internet', 'utilities']):
            return 'Utilities'
        elif any(keyword in desc_lower for keyword in ['bill', 'payment']):
            return 'Bills'
        elif any(keyword in desc_lower for keyword in ['deposit', 'salary', 'payroll']):
            return 'Income'
        elif any(keyword in desc_lower for keyword in ['interest', 'earned']):
            return 'Interest'
        elif any(keyword in desc_lower for keyword in ['tax', 'withholding']):
            return 'Taxes'
        elif any(keyword in desc_lower for keyword in ['check', 'payment']):
            return 'Income'
        else:
            return 'Other'

if __name__ == "__main__":
    # Test the processor
    processor = SimpleBankStatementProcessor()
    
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
    
    result = processor.process_pdf(test_data.encode('utf-8'))
    
    print("Simple Processor Test:")
    print(f"Success: {result['success']}")
    print(f"Transactions found: {len(result['transactions'])}")
    
    if result['transactions']:
        print("\nFirst 5 transactions:")
        for i, tx in enumerate(result['transactions'][:5]):
            print(f"  {i+1}. {tx['date']} - {tx['description']} - ${tx['amount']} ({tx['category']})")
