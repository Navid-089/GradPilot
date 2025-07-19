import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ChatbotProvider } from "@/components/chatbot/chatbot-provider";
import { NotificationBar } from "@/components/notification/notification-bar";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GradPilot - Your Graduate School Application Assistant",
  description:
    "AI-powered platform to assist postgraduate applicants in finding suitable universities",
  generator: "v0.dev",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {/* <NotificationBar message="Welcome to GradPilot! Your graduate school application assistant." /> */}
            <ChatbotProvider>{children}</ChatbotProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
