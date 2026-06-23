// Admin panel has its own layout — no public Navbar/Footer
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ fontFamily: "var(--font-sans)" }}>
      {children}
    </div>
  );
}
