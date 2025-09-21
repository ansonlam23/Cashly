import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Calendar, TrendingUp, AlertTriangle, Target, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ForecastData {
  period: string;
  predictedAmount: number;
  label: string;
}

interface Insight {
  type: string;
  message: string;
  amount?: number;
  category?: string;
  percentage?: number;
}

interface SpendingForecastProps {
  forecast: ForecastData[];
  insights: Insight[];
  title: string;
  description: string;
}

export function SpendingForecast({ forecast, insights, title, description }: SpendingForecastProps) {
  if (!forecast || forecast.length === 0) {
    return (
      <Card className="bg-[#111111] border-[#333]">
        <CardHeader>
          <CardTitle className="text-[#f5f5f5] flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription className="text-[#888]">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-[#888]">
            <div className="text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No forecast data available</p>
              <p className="text-sm mt-1">Add more transactions to generate predictions</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
  const formatTooltip = (value: number, name: string) => [formatCurrency(value), name];

  const averageMonthly = forecast[0]?.predictedAmount || 0;
  const yearlyProjection = averageMonthly * 12;

  return (
    <div className="space-y-6">
      {/* Forecast Chart */}
      <Card className="bg-[#111111] border-[#333]">
        <CardHeader>
          <CardTitle className="text-[#f5f5f5] flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription className="text-[#888]">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  dataKey="label" 
                  stroke="#888"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#888"
                  fontSize={12}
                  tickFormatter={formatCurrency}
                />
                <Tooltip 
                  formatter={formatTooltip}
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#f5f5f5'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="predictedAmount"
                  stroke="#00ff88"
                  fill="#00ff88"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#111111] border-[#333]">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#00ff88]/20 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-[#00ff88]" />
              </div>
              <div>
                <div className="text-sm text-[#888]">Monthly Average</div>
                <div className="text-2xl font-bold text-[#f5f5f5]">
                  {formatCurrency(averageMonthly)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-[#333]">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#0088ff]/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-[#0088ff]" />
              </div>
              <div>
                <div className="text-sm text-[#888]">Yearly Projection</div>
                <div className="text-2xl font-bold text-[#f5f5f5]">
                  {formatCurrency(yearlyProjection)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-[#333]">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#ff0080]/20 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-[#ff0080]" />
              </div>
              <div>
                <div className="text-sm text-[#888]">Forecast Period</div>
                <div className="text-2xl font-bold text-[#f5f5f5]">
                  {forecast.length} months
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      {insights && insights.length > 0 && (
        <Card className="bg-[#111111] border-[#333]">
          <CardHeader>
            <CardTitle className="text-[#f5f5f5] flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              AI Insights & Predictions
            </CardTitle>
            <CardDescription className="text-[#888]">
              Personalized insights based on your spending patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  insight.type === 'yearly_projection' ? 'border-[#0088ff]/30 bg-[#0088ff]/5' :
                  insight.type === 'top_category' ? 'border-[#ff0080]/30 bg-[#ff0080]/5' :
                  'border-[#333] bg-[#1a1a1a]'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      insight.type === 'yearly_projection' ? 'bg-[#0088ff]/20' :
                      insight.type === 'top_category' ? 'bg-[#ff0080]/20' :
                      'bg-[#333]'
                    }`}>
                      {insight.type === 'yearly_projection' ? (
                        <TrendingUp className="h-4 w-4 text-[#0088ff]" />
                      ) : insight.type === 'top_category' ? (
                        <Target className="h-4 w-4 text-[#ff0080]" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-[#888]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-[#f5f5f5] font-medium">{insight.message}</p>
                      {insight.amount && (
                        <div className="text-sm text-[#888] mt-1">
                          Based on your current spending rate
                        </div>
                      )}
                      {insight.percentage && (
                        <div className="text-sm text-[#888] mt-1">
                          This represents {insight.percentage.toFixed(1)}% of your total spending
                        </div>
                      )}
                    </div>
                    {insight.type === 'yearly_projection' && (
                      <Badge className="bg-[#0088ff] text-white">
                        Projection
                      </Badge>
                    )}
                    {insight.type === 'top_category' && (
                      <Badge className="bg-[#ff0080] text-white">
                        Top Category
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Behavioral Nudges */}
      <Card className="bg-[#111111] border-[#00ff88]">
        <CardHeader>
          <CardTitle className="text-[#00ff88] flex items-center gap-2">
            <Target className="h-5 w-5" />
            Behavioral Nudges
          </CardTitle>
          <CardDescription className="text-[#888]">
            Actionable suggestions to improve your financial habits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-[#1a1a1a] rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-[#00ff88]/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-[#00ff88]" />
                </div>
                <span className="font-semibold text-[#f5f5f5]">Savings Opportunity</span>
              </div>
              <p className="text-sm text-[#888]">
                If you reduce your monthly spending by just 10%, you could save{' '}
                <span className="text-[#00ff88] font-semibold">
                  ${(averageMonthly * 0.1 * 12).toLocaleString()}
                </span>{' '}
                per year.
              </p>
            </div>

            <div className="p-4 bg-[#1a1a1a] rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-[#0088ff]/20 rounded-lg flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-[#0088ff]" />
                </div>
                <span className="font-semibold text-[#f5f5f5]">Budget Planning</span>
              </div>
              <p className="text-sm text-[#888]">
                Based on your current patterns, consider setting a monthly budget of{' '}
                <span className="text-[#0088ff] font-semibold">
                  ${(averageMonthly * 1.1).toLocaleString()}
                </span>{' '}
                to account for occasional spikes.
              </p>
            </div>

            <div className="p-4 bg-[#1a1a1a] rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-[#ff0080]/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-[#ff0080]" />
                </div>
                <span className="font-semibold text-[#f5f5f5]">Trend Alert</span>
              </div>
              <p className="text-sm text-[#888]">
                Monitor your spending closely. If current trends continue, you'll spend{' '}
                <span className="text-[#ff0080] font-semibold">
                  ${yearlyProjection.toLocaleString()}
                </span>{' '}
                this year.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
