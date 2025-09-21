#!/usr/bin/env python3
"""
PDF Processing Server
A simple HTTP server for processing PDF bank statements
"""

from flask import Flask, request, jsonify
from pdf_processor import BankStatementProcessor
import base64
import io
import os

app = Flask(__name__)
processor = BankStatementProcessor()

@app.route('/process-pdf', methods=['POST'])
def process_pdf():
    try:
        data = request.get_json()
        
        if not data or 'pdfData' not in data:
            return jsonify({
                'success': False,
                'error': 'No PDF data provided'
            }), 400
        
        # Handle both base64 PDF data and plain text
        pdf_data_str = data['pdfData']
        
        print(f"Received PDF data length: {len(pdf_data_str)}")
        print(f"PDF data preview: {pdf_data_str[:100]}...")
        
        # Try to decode as base64 first
        try:
            pdf_data = base64.b64decode(pdf_data_str)
            print(f"Successfully decoded base64, PDF data length: {len(pdf_data)}")
            print(f"PDF data starts with: {pdf_data[:20]}")
            
            # Check if it's a valid PDF
            if not pdf_data.startswith(b'%PDF'):
                print("Warning: Decoded data doesn't start with PDF header")
                # Try to process as text anyway
                pdf_data = pdf_data_str.encode('utf-8')
                result = processor.process_pdf(pdf_data)
            else:
                # If successful, process as PDF
                result = processor.process_pdf(pdf_data)
            
            print(f"Processing result: {result.get('success', False)}, transactions: {len(result.get('transactions', []))}")
        except Exception as e:
            print(f"Base64 decoding failed: {e}")
            # If base64 decoding fails, treat as plain text
            pdf_data = pdf_data_str.encode('utf-8')
            result = processor.process_pdf(pdf_data)
            print(f"Processing as text, result: {result.get('success', False)}, transactions: {len(result.get('transactions', []))}")
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'transactions': []
        }), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)
