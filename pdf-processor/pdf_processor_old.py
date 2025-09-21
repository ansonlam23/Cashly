#!/usr/bin/env python3
"""
PDF Bank Statement Processor
Extracts transactions from PDF bank statements using pdfplumber and pandas
"""

import pdfplumber
import pandas as pd
import re
import json
import sys
from datetime import datetime
from typing import List, Dict, Any, Optional
import io
import base64

class BankStatementProcessor:
    def __init__(self):
        self.date_pattern = r'\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?'
        self.amount_pattern = r'\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)'
        
        # Common transaction keywords
        self.income_keywords = [
            'deposit', 'salary', 'payroll', 'refund', 'transfer in', 
            'direct deposit', 'interest', 'dividend', 'cashback'
        ]
        
        self.expense_keywords = [
            'purchase', 'payment', 'withdrawal', 'transfer out', 'fee',
            'charge', 'debit', 'atm', 'pos', 'online', 'mobile'
        ]

    def extract_text_from_pdf(self, pdf_data: bytes) -> str:
        """Extract text from PDF bytes or plain text"""
        try:
            # First try to decode as plain text (for testing)
            try:
                text = pdf_data.decode('utf-8')
                # If it looks like plain text (not PDF), return it
                if not text.startswith('%PDF'):
                    return text
            except:
                pass
            
            # If it's a real PDF, use pdfplumber
            with pdfplumber.open(io.BytesIO(pdf_data)) as pdf:
                text = ""
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
                return text
        except Exception as e:
            raise Exception(f"Error extracting text from PDF: {str(e)}")

    def clean_text(self, text: str) -> str:
        """Clean and normalize text"""
        # Remove extra whitespace but preserve newlines
        text = re.sub(r'[ \t]+', ' ', text)  # Replace multiple spaces/tabs with single space
        text = re.sub(r'\n\s*\n', '\n', text)  # Remove empty lines
        # Remove page numbers and headers
        text = re.sub(r'Page \d+ of \d+', '', text)
        text = re.sub(r'Statement Period:.*?\n', '', text)
        # Remove account numbers (partially)
        text = re.sub(r'Account: \d{4}-\d{4}-\d{4}-\d{4}', '', text)
        return text.strip()

    def find_transaction_lines(self, text: str) -> List[str]:
        """Find lines that look like transactions"""
        lines = text.split('\n')
        transaction_lines = []
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # Check if line contains date and amount
            has_date = bool(re.search(self.date_pattern, line))
            has_amount = bool(re.search(self.amount_pattern, line))
            
            # Skip headers, footers, and summary lines
            skip_words = [
                'balance', 'total', 'summary', 'statement', 'account',
                'date', 'description', 'amount', 'debit', 'credit',
                'beginning', 'ending', 'available', 'current'
            ]
            
            should_skip = any(skip_word in line.lower() for skip_word in skip_words)
            
            if should_skip:
                continue
                
            if has_date and has_amount and len(line) > 10:
                transaction_lines.append(line)
        return transaction_lines

    def parse_transaction_line(self, line: str) -> Optional[Dict[str, Any]]:
        """Parse a single transaction line"""
        for i, pattern in enumerate(self.transaction_patterns):
            match = re.search(pattern, line)
            if match:
                groups = match.groups()
                
                # Handle all patterns (3 groups)
                if len(groups) == 3:
                    if re.match(self.date_pattern, groups[0]):
                        # Date first
                        date_str = groups[0]
                        if re.match(self.amount_pattern, groups[2]):
                            # Date, Description, Amount
                            description = groups[1].strip()
                            amount_str = groups[2]
                        else:
                            # Date, Amount, Description
                            amount_str = groups[1]
                            description = groups[2].strip()
                    else:
                        # Description, Date, Amount
                        description = groups[0].strip()
                        date_str = groups[1]
                        amount_str = groups[2]
                    
                    # Parse amount
                    amount = self.parse_amount(amount_str)
                    if amount is None:
                        continue
                else:
                    continue
                
                # Parse date
                date = self.parse_date(date_str)
                if not date:
                    continue
                
                # Determine transaction type
                transaction_type = self.determine_transaction_type(description, amount)
                
                # Extract merchant name
                merchant = self.extract_merchant_name(description)
                
                # Categorize transaction
                category = self.categorize_transaction(description, merchant)
                
                return {
                    'date': date.strftime('%Y-%m-%d'),
                    'description': description,
                    'amount': amount,
                    'merchant': merchant,
                    'category': category,
                    'transactionType': transaction_type
                }
        
        return None

    def parse_date(self, date_str: str) -> Optional[datetime]:
        """Parse date string to datetime object"""
        date_formats = [
            '%m/%d/%Y', '%m-%d-%Y', '%m/%d/%y', '%m-%d-%y',
            '%d/%m/%Y', '%d-%m-%Y', '%d/%m/%y', '%d-%m-%y',
            '%Y-%m-%d', '%Y/%m/%d'
        ]
        
        for fmt in date_formats:
            try:
                return datetime.strptime(date_str, fmt)
            except ValueError:
                continue
        
        return None

    def parse_amount(self, amount_str: str) -> Optional[float]:
        """Parse amount string to float"""
        try:
            # Remove currency symbols and commas
            cleaned = re.sub(r'[$,]', '', amount_str)
            # Handle negative amounts
            if cleaned.startswith('(') and cleaned.endswith(')'):
                cleaned = '-' + cleaned[1:-1]
            return float(cleaned)
        except (ValueError, AttributeError):
            return None

    def determine_transaction_type(self, description: str, amount: float) -> str:
        """Determine if transaction is income or expense"""
        desc_lower = description.lower()
        
        # Check for income keywords
        if any(keyword in desc_lower for keyword in self.income_keywords):
            return 'credit'
        
        # Check for expense keywords
        if any(keyword in desc_lower for keyword in self.expense_keywords):
            return 'debit'
        
        # Use amount sign as fallback
        return 'credit' if amount > 0 else 'debit'

    def extract_merchant_name(self, description: str) -> str:
        """Extract merchant name from description"""
        # Remove common prefixes
        prefixes_to_remove = [
            'POS ', 'ATM ', 'ONLINE ', 'MOBILE ', 'DEBIT CARD ',
            'CREDIT CARD ', 'ACH ', 'WIRE ', 'TRANSFER '
        ]
        
        merchant = description
        for prefix in prefixes_to_remove:
            if merchant.upper().startswith(prefix):
                merchant = merchant[len(prefix):]
                break
        
        # Remove location info (common patterns)
        merchant = re.sub(r'\s+\d{5}(-\d{4})?$', '', merchant)  # ZIP codes
        merchant = re.sub(r'\s+[A-Z]{2}\s+\d{2}/\d{2}$', '', merchant)  # State and date
        merchant = re.sub(r'\s+\d{2}/\d{2}$', '', merchant)  # Date
        
        return merchant.strip()

    def categorize_transaction(self, description: str, merchant: str) -> str:
        """Categorize transaction based on description and merchant"""
        desc_lower = description.lower()
        merchant_lower = merchant.lower()
        
        # Food and Dining
        if any(keyword in desc_lower for keyword in [
            'restaurant', 'cafe', 'coffee', 'pizza', 'burger', 'food',
            'dining', 'lunch', 'dinner', 'breakfast', 'starbucks',
            'mcdonald', 'subway', 'kfc', 'domino', 'papa john'
        ]):
            return 'Food and Drink'
        
        # Transportation
        if any(keyword in desc_lower for keyword in [
            'uber', 'lyft', 'taxi', 'gas', 'fuel', 'parking',
            'metro', 'bus', 'train', 'airline', 'flight'
        ]):
            return 'Transportation'
        
        # Shopping
        if any(keyword in desc_lower for keyword in [
            'amazon', 'walmart', 'target', 'shop', 'store',
            'purchase', 'retail', 'mall', 'online'
        ]):
            return 'Shopping'
        
        # Entertainment
        if any(keyword in desc_lower for keyword in [
            'netflix', 'spotify', 'movie', 'cinema', 'theater',
            'game', 'entertainment', 'subscription'
        ]):
            return 'Entertainment'
        
        # Groceries
        if any(keyword in desc_lower for keyword in [
            'grocery', 'supermarket', 'market', 'safeway',
            'kroger', 'whole foods', 'trader joe'
        ]):
            return 'Groceries'
        
        # Utilities
        if any(keyword in desc_lower for keyword in [
            'electric', 'water', 'gas bill', 'internet', 'phone',
            'utility', 'cable', 'wifi'
        ]):
            return 'Utilities'
        
        # Healthcare
        if any(keyword in desc_lower for keyword in [
            'pharmacy', 'medical', 'doctor', 'hospital',
            'health', 'cvs', 'walgreens'
        ]):
            return 'Healthcare'
        
        # Education
        if any(keyword in desc_lower for keyword in [
            'tuition', 'school', 'university', 'college',
            'book', 'textbook', 'education'
        ]):
            return 'Education'
        
        return 'Other'

    def process_pdf(self, pdf_data: bytes) -> Dict[str, Any]:
        """Main method to process PDF and extract transactions"""
        try:
            # Extract text from PDF
            text = self.extract_text_from_pdf(pdf_data)
            cleaned_text = self.clean_text(text)
            
            # Find transaction lines
            transaction_lines = self.find_transaction_lines(cleaned_text)
            
            # Parse transactions
            transactions = []
            for line in transaction_lines:
                transaction = self.parse_transaction_line(line)
                if transaction:
                    transactions.append(transaction)
            
            # Create summary
            total_income = sum(t['amount'] for t in transactions if t['amount'] > 0)
            total_expenses = sum(abs(t['amount']) for t in transactions if t['amount'] < 0)
            net_flow = total_income - total_expenses
            
            # Get unique merchants
            merchants = list(set(t['merchant'] for t in transactions if t['merchant']))
            
            # Get category breakdown
            categories = {}
            for transaction in transactions:
                category = transaction['category']
                if category not in categories:
                    categories[category] = 0
                categories[category] += abs(transaction['amount'])
            
            return {
                'success': True,
                'transactions': transactions,
                'summary': {
                    'totalTransactions': len(transactions),
                    'totalIncome': total_income,
                    'totalExpenses': total_expenses,
                    'netFlow': net_flow,
                    'uniqueMerchants': len(merchants),
                    'categories': categories
                },
                'metadata': {
                    'processedAt': datetime.now().isoformat(),
                    'extractedTextLength': len(cleaned_text),
                    'transactionLinesFound': len(transaction_lines)
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

def main():
    """Test the PDF processor"""
    try:
        # Check if PDF data is provided via stdin
        if not sys.stdin.isatty():
            # Read PDF data from stdin
            pdf_data = sys.stdin.buffer.read()
        elif len(sys.argv) >= 2:
            # Read PDF data from file
            pdf_path = sys.argv[1]
            with open(pdf_path, 'rb') as f:
                pdf_data = f.read()
        else:
            print(json.dumps({
                'success': False,
                'error': 'No PDF data provided. Usage: python pdf_processor.py <pdf_file_path> or pipe PDF data to stdin',
                'transactions': []
            }))
            sys.exit(1)
        
        processor = BankStatementProcessor()
        result = processor.process_pdf(pdf_data)
        
        print(json.dumps(result, indent=2))
        
    except Exception as e:
        print(json.dumps({
            'success': False,
            'error': str(e),
            'transactions': []
        }, indent=2))

if __name__ == "__main__":
    main()
