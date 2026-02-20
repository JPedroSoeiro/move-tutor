import { Providers } from "./providers";
import { Sidebar } from "@/components/layout/Sidebar";
import { SessionMonitor } from "@/components/SessionMonitor";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body>
        <Providers>
          <SessionMonitor /> 
          
          <div className="flex">
            <Sidebar />
            <main 
              className="flex-1 p-8 bg-[#050505] min-h-screen"
              style={{ marginTop: '80px' }} 
            >
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}