
import "./globals.css";
export const metadata = {
  title: "TheAlwaysHungry",
  description: "India's first Cafe which gives you reward with food",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
