#!/bin/bash

# Start Llama AI Insights Service
echo "🚀 Starting Llama AI Insights Service..."

# Check if Ollama is running
if ! curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "❌ Ollama is not running. Please start Ollama first:"
    echo "   brew install ollama"
    echo "   ollama serve"
    echo "   ollama pull llama3.2:3b"
    exit 1
fi

# Check if llama3.2:3b model is available
if ! ollama list | grep -q "llama3.2:3b"; then
    echo "📥 Downloading llama3.2:3b model..."
    ollama pull llama3.2:3b
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies if needed
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Start the Flask server
echo "🌟 Starting AI Insights Server on http://localhost:5000"
echo "   Health check: http://localhost:5000/health"
echo "   Press Ctrl+C to stop"
echo ""

python server.py
