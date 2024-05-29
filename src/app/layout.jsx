import "./globals.css";

export const metadata = {
  title: "API com Next.js",
  description: "Api com Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
