#!/usr/bin/env python3
"""
AI Insights Service using Ollama with Llama 3.2 3B
Generates personalized financial insights with humor and actionable advice
"""

import json
import requests
import sys
from typing import Dict, List, Any

class FinancialInsightsAI:
    def __init__(self, ollama_url: str = "http://localhost:11434"):
        self.ollama_url = ollama_url
        self.model = "llama3.2:3b"
    
    def generate_insights(self, financial_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate AI insights from financial data"""
        
        # Extract key metrics
        total_income = financial_data.get('totalIncome', 0)
        total_spending = financial_data.get('totalSpending', 0)
        net_flow = financial_data.get('netFlow', 0)
        current_balance = financial_data.get('currentBalance', 0)
        
        # Category breakdown
        spending_by_category = financial_data.get('spendingByCategory', [])
        top_categories = sorted(spending_by_category, key=lambda x: x.get('amount', 0), reverse=True)[:3]
        
        # Top merchants
        top_merchants = financial_data.get('topMerchants', [])[:3]
        
        # Goals data
        goals = financial_data.get('goals', [])
        active_goals = [g for g in goals if g.get('isActive', True)]
        
        # Monthly trend
        monthly_trend = financial_data.get('monthlyTrend', [])
        
        # Create the prompt
        prompt = self._create_prompt(
            total_income, total_spending, net_flow, current_balance,
            top_categories, top_merchants, active_goals, monthly_trend
        )
        
        # Generate insights using Ollama
        insights = self._call_ollama(prompt)
        
        return insights
    
    def _create_prompt(self, total_income: float, total_spending: float, net_flow: float, 
                      current_balance: float, top_categories: List[Dict], 
                      top_merchants: List[Dict], goals: List[Dict], 
                      monthly_trend: List[Dict]) -> str:
        """Create a detailed prompt for the LLM"""
        
        # Format category data
        category_text = ""
        for i, cat in enumerate(top_categories, 1):
            category_text += f"{i}. {cat.get('category', 'Unknown')}: ${cat.get('amount', 0):,.2f}\n"
        
        # Format merchant data
        merchant_text = ""
        for i, merchant in enumerate(top_merchants, 1):
            merchant_text += f"{i}. {merchant.get('merchant', 'Unknown')}: ${merchant.get('totalAmount', 0):,.2f} ({merchant.get('count', 0)} transactions)\n"
        
        # Format goals data
        goals_text = ""
        for goal in goals[:3]:  # Top 3 goals
            progress = (goal.get('currentAmount', 0) / goal.get('targetAmount', 1)) * 100
            goals_text += f"- {goal.get('title', 'Goal')}: ${goal.get('currentAmount', 0):,.2f}/${goal.get('targetAmount', 0):,.2f} ({progress:.1f}%)\n"
        
        # Monthly trend analysis
        trend_text = ""
        if len(monthly_trend) >= 2:
            recent = monthly_trend[-1].get('amount', 0)
            previous = monthly_trend[-2].get('amount', 0)
            change = ((recent - previous) / previous * 100) if previous > 0 else 0
            trend_text = f"Monthly spending change: {change:+.1f}% (${recent:,.2f} vs ${previous:,.2f})"
        
        prompt = f"""You are a fun, witty financial advisor for college students. Analyze this financial data and provide insights with humor and actionable advice.

FINANCIAL DATA:
- Total Income: ${total_income:,.2f}
- Total Spending: ${total_spending:,.2f}
- Net Flow: ${net_flow:,.2f}
- Current Balance: ${current_balance:,.2f}

TOP SPENDING CATEGORIES:
{category_text}

TOP MERCHANTS:
{merchant_text}

ACTIVE GOALS:
{goals_text}

TREND DATA:
{trend_text}

Please provide insights in this JSON format:
{{
  "spendingHighlights": {{
    "biggestExpense": "Funny comment about the biggest expense",
    "overspendingAlert": "Witty alert about overspending (if applicable)",
    "positiveReinforcement": "Encouraging message about good financial behavior"
  }},
  "categoryInsights": [
    {{
      "category": "Category name",
      "insight": "Humorous insight about this category",
      "suggestion": "Actionable tip to improve spending in this category"
    }}
  ],
  "predictions": [
    {{
      "type": "goal_timeline",
      "message": "Prediction about goal achievement timeline",
      "actionable": "Specific step to improve timeline"
    }}
  ],
  "funFacts": [
    "Humorous observation about spending patterns",
    "Light-hearted comparison or joke"
  ],
  "actionableRecommendations": [
    "Specific, realistic step 1",
    "Specific, realistic step 2",
    "Specific, realistic step 3"
  ]
}}

Keep it fun, relatable, and student-friendly. Use emojis sparingly. Make jokes about relatable college experiences. Be encouraging but honest about spending habits."""

        return prompt
    
    def _call_ollama(self, prompt: str) -> Dict[str, Any]:
        """Call Ollama API to generate insights"""
        try:
            response = requests.post(
                f"{self.ollama_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.8,
                        "top_p": 0.9,
                        "max_tokens": 1000
                    }
                },
                timeout=60
            )
            
            if response.status_code == 200:
                result = response.json()
                response_text = result.get('response', '')
                
                # Try to extract JSON from the response
                try:
                    # Find JSON in the response
                    start_idx = response_text.find('{')
                    end_idx = response_text.rfind('}') + 1
                    
                    if start_idx != -1 and end_idx != 0:
                        json_str = response_text[start_idx:end_idx]
                        return json.loads(json_str)
                    else:
                        # Fallback if no JSON found
                        return self._create_fallback_insights(response_text)
                except json.JSONDecodeError:
                    return self._create_fallback_insights(response_text)
            else:
                print(f"Error calling Ollama: {response.status_code}", file=sys.stderr)
                return self._create_fallback_insights("")
                
        except Exception as e:
            print(f"Error in LLM call: {e}", file=sys.stderr)
            return self._create_fallback_insights("")
    
    def _create_fallback_insights(self, response_text: str) -> Dict[str, Any]:
        """Create fallback insights if LLM fails"""
        return {
            "spendingHighlights": {
                "biggestExpense": "Your biggest expense needs some attention! 💸",
                "overspendingAlert": "Time to check those spending habits!",
                "positiveReinforcement": "Every small step counts toward your financial goals! 🎯"
            },
            "categoryInsights": [
                {
                    "category": "General",
                    "insight": "Your spending patterns show room for optimization",
                    "suggestion": "Try tracking your daily expenses for a week"
                }
            ],
            "predictions": [
                {
                    "type": "general",
                    "message": "With consistent effort, you can reach your financial goals",
                    "actionable": "Set up automatic savings transfers"
                }
            ],
            "funFacts": [
                "Financial health is a journey, not a destination! 🚀"
            ],
            "actionableRecommendations": [
                "Review your spending categories monthly",
                "Set up a budget for discretionary spending",
                "Consider using a budgeting app for better tracking"
            ]
        }

def main():
    """Test the AI insights service"""
    if len(sys.argv) < 2:
        print("Usage: python llm_service.py <financial_data_json>")
        sys.exit(1)
    
    try:
        financial_data = json.loads(sys.argv[1])
        ai = FinancialInsightsAI()
        insights = ai.generate_insights(financial_data)
        print(json.dumps(insights, indent=2))
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
