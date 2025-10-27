import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduBuddy - Your Personalized AI Tutor",
  description:
    "EduBuddy is an intelligent AI tutor powered by Azure OpenAI that helps students learn any subject effectively.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
