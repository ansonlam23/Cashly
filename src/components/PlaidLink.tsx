import { useState, useEffect } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Link, CheckCircle } from "lucide-react";

interface PlaidLinkProps {
  onSuccess?: () => void;
}

export function PlaidLink({ onSuccess }: PlaidLinkProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createLinkToken = useAction(api.plaidActions.createLinkTokenAction);
  const exchangePublicToken = useAction(api.plaidActions.exchangePublicTokenAction);
  const savePlaidItem = useMutation(api.plaidMutations.savePlaidItem);

  useEffect(() => {
    const initializePlaid = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Create link token
        const token = await createLinkToken({ userId: "demo-user" });
        setLinkToken(token);
      } catch (err) {
        console.error('Failed to initialize Plaid:', err);
        setError('Failed to initialize Plaid Link');
      } finally {
        setIsLoading(false);
      }
    };

    initializePlaid();
  }, [createLinkToken]);

  const handlePlaidSuccess = async (publicToken: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Exchange public token for access token
      const { accessToken, itemId } = await exchangePublicToken({ publicToken });

      // Save Plaid item to database
      await savePlaidItem({ accessToken, itemId });

      setIsConnected(true);
      onSuccess?.();
    } catch (err) {
      console.error('Failed to connect account:', err);
      setError('Failed to connect your bank account');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaidError = (error: any) => {
    console.error('Plaid error:', error);
    setError('Failed to connect your bank account');
  };

  const handlePlaidExit = () => {
    console.log('Plaid Link exited');
  };

  const openPlaidLink = () => {
    if (!linkToken) return;

    // For now, we'll use a simple approach since we don't have the Plaid Link component
    // In a real implementation, you'd use the @plaid/link-react component
    console.log('Opening Plaid Link with token:', linkToken);
    
    // Simulate successful connection for demo purposes
    // Replace this with actual Plaid Link integration
    setTimeout(() => {
      handlePlaidSuccess('sandbox_public_token_demo');
    }, 2000);
  };

  if (isConnected) {
    return (
      <Card className="bg-[#111111] border-[#00ff88]">
        <CardHeader>
          <CardTitle className="text-[#f5f5f5] flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-[#00ff88]" />
            Bank Account Connected
          </CardTitle>
          <CardDescription className="text-[#888]">
            Your bank account is successfully connected and ready to fetch transactions.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-[#111111] border-[#333]">
      <CardHeader>
        <CardTitle className="text-[#f5f5f5]">Connect Your Bank Account</CardTitle>
        <CardDescription className="text-[#888]">
          Connect your bank account to automatically fetch and analyze your transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-[#ff0080]/10 border border-[#ff0080]/20 rounded-lg p-3 mb-4">
            <p className="text-[#ff0080] text-sm">{error}</p>
          </div>
        )}
        
        <Button
          onClick={openPlaidLink}
          disabled={isLoading || !linkToken}
          className="w-full bg-[#00ff88] hover:bg-[#00cc6a] text-[#0a0a0a] font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Link className="mr-2 h-4 w-4" />
              Connect Bank Account
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
