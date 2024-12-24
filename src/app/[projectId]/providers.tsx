import { CHAIN, transport } from "@/lib/config";
import sdk from "@farcaster/frame-sdk";
import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { useEffect } from "react";
import { mainnet } from "viem/chains";
import { createConfig, WagmiProvider } from "wagmi";

export const config = createConfig(
  getDefaultConfig({
    appName: "Juicebox Frame",
    walletConnectProjectId: "cd15473a8bd1a71d54fa4c0ed7cfd476",
    chains: [CHAIN],
    connectors: [farcasterFrame()],
    transports: {
      [CHAIN.id]: transport,
    },
    ssr: false,
  }),
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          options={{ enforceSupportedChains: true, initialChainId: mainnet.id }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
