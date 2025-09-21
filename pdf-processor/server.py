#!/usr/bin/env python3
"""
PDF Processing Server
A simple HTTP server for processing PDF bank statements
"""

from flask import Flask, request, jsonify
from pdf_processor import BankStatementProcessor
import base64
import io

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
        
        # Decode base64 PDF data
        pdf_data = base64.b64decode(data['pdfData'])
        
        # Process the PDF
        result = processor.process_pdf(pdf_data)
        
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
    app.run(host='0.0.0.0', port=5001, debug=True)
