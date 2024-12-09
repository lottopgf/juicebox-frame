import { frameConnector } from "@/lib/connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { mainnet } from "viem/chains";
import { createConfig, WagmiProvider } from "wagmi";

export const config = createConfig(
  getDefaultConfig({
    appName: "Juicebox Frame",
    walletConnectProjectId: "cd15473a8bd1a71d54fa4c0ed7cfd476",
    chains: [mainnet],
    connectors: [frameConnector()],
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
