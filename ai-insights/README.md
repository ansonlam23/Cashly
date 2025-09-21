# AI Insights Service with Llama 3.2 3B

This service provides AI-powered financial insights using Ollama with Llama 3.2 3B model.

## 🚀 Quick Start

### Prerequisites

1. **Install Ollama**:
   ```bash
   brew install ollama
   ```

2. **Start Ollama**:
   ```bash
   ollama serve
   ```

3. **Pull the Llama model**:
   ```bash
   ollama pull llama3.2:3b
   ```

### Running the Service

1. **Start the AI service**:
   ```bash
   cd ai-insights
   ./start_llama_service.sh
   ```

   Or manually:
   ```bash
   cd ai-insights
   source venv/bin/activate
   pip install -r requirements.txt
   python server.py
   ```

2. **Verify it's working**:
   ```bash
   curl http://localhost:5000/health
   ```

## 🔧 How It Works

### Service Architecture

- **Flask Server** (`server.py`): HTTP API that receives financial data
- **LLM Service** (`llm_service.py`): Handles communication with Ollama
- **Ollama**: Local LLM server running Llama 3.2 3B
- **Convex Actions**: Call the Flask service, fallback to rule-based if unavailable

### API Endpoints

- `GET /health` - Health check
- `POST /generate-insights` - Generate spending insights
- `POST /generate-investment-insights` - Generate investment insights

### Data Flow

1. **Frontend** → Convex Action
2. **Convex Action** → Flask Service (localhost:5000)
3. **Flask Service** → Ollama (localhost:11434)
4. **Ollama** → Llama 3.2 3B Model
5. **Response** flows back through the chain

## 🎯 Features

### Spending Insights
- Witty analysis of spending patterns
- Category-specific recommendations
- Fun facts about your financial habits
- Actionable advice with humor

### Investment Insights
- Portfolio performance analysis
- Stock-specific insights and recommendations
- Diversification advice
- Risk assessment with personality

## 🔄 Fallback System

If the Llama service is unavailable, the system automatically falls back to the rule-based approach, ensuring the app always works.

## 🐛 Troubleshooting

### Ollama Issues
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Restart Ollama
pkill ollama
ollama serve
```

### Service Issues
```bash
# Check if service is running
curl http://localhost:5000/health

# Check logs
tail -f server.log
```

### Model Issues
```bash
# List available models
ollama list

# Pull model if missing
ollama pull llama3.2:3b
```

## 📊 Performance

- **Model**: Llama 3.2 3B (3 billion parameters)
- **Memory**: ~2GB RAM required
- **Speed**: ~2-5 seconds per insight generation
- **Quality**: High-quality, contextual, and humorous responses

## 🔧 Configuration

### Environment Variables
- `OLLAMA_URL`: Ollama server URL (default: http://localhost:11434)
- `FLASK_PORT`: Flask server port (default: 5000)

### Model Settings
- **Temperature**: 0.8 (creative but focused)
- **Top-p**: 0.9 (good balance of creativity)
- **Max tokens**: 1000 (sufficient for insights)

## 🚀 Production Deployment

For production, consider:
1. Using a more powerful model (llama3.2:8b or llama3.2:70b)
2. Running Ollama on a separate server
3. Adding authentication to the Flask service
4. Implementing caching for repeated requests
5. Using a reverse proxy (nginx) for the Flask service

## 📝 Development

### Adding New Insight Types
1. Add new method to `FinancialInsightsAI` class
2. Create corresponding prompt in `_create_*_prompt` method
3. Add new endpoint in `server.py`
4. Update Convex action to call new endpoint

### Testing
```bash
# Test spending insights
curl -X POST http://localhost:5000/generate-insights \
  -H "Content-Type: application/json" \
  -d '{"totalIncome": 3000, "totalSpending": 2500, "netFlow": 500}'

# Test investment insights
curl -X POST http://localhost:5000/generate-investment-insights \
  -H "Content-Type: application/json" \
  -d '{"portfolioSummary": {"totalValue": 10000, "totalGainLoss": 500}, "investments": []}'
```
