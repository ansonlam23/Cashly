# Investments Section Setup Guide

## ✅ API Key Configuration

Your Alpha Vantage API key has been added to the code as a fallback: `4Y9CTEY1GZ8L2Q7R`

### Recommended: Set Environment Variable in Convex Dashboard

For better security and configuration management, you should set the environment variable in your Convex dashboard:

1. Go to your [Convex Dashboard](https://dashboard.convex.dev)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add a new environment variable:
   - **Name**: `ALPHA_VANTAGE_API_KEY`
   - **Value**: `4Y9CTEY1GZ8L2Q7R`
5. Save the changes

### Current Status

The investments section is now fully functional with your API key! You can:

- ✅ Add stock investments (AAPL, TSLA, MSFT, etc.)
- ✅ View real-time stock prices
- ✅ Track portfolio gains/losses
- ✅ Monitor daily changes
- ✅ Delete investments
- ✅ Refresh all prices at once

### Features Available

1. **Portfolio Dashboard** - Overview of total value and performance
2. **Add Investments** - Enter ticker symbols, shares, and average cost
3. **Real-time Updates** - Get current market prices
4. **Gain/Loss Tracking** - See profit/loss for each holding
5. **Beautiful UI** - Dark theme with smooth animations

### API Rate Limits

- Alpha Vantage free tier: 25 requests per day
- 5 requests per minute
- The app includes error handling for rate limits

### Testing

Try adding some popular stocks:
- AAPL (Apple)
- TSLA (Tesla)
- MSFT (Microsoft)
- GOOGL (Google)
- AMZN (Amazon)

The investments section is now ready to use! 🚀
