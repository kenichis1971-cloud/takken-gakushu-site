import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "宅建士学習サイト",
    template: "%s | 宅建士学習サイト",
  },
  description:
    "宅建士試験の過去問演習・復習・弱点対策・講座比較を進めるための学習サイトです。",
};

const navItems = [
  { href: "/", label: "トップ" },
  { href: "/practice", label: "過去問演習" },
  { href: "/weakness", label: "科目別演習" },
  { href: "/traps", label: "ひっかけ対策" },
  { href: "/review", label: "復習" },
  { href: "/past", label: "収録過去問" },
  { href: "/courses", label: "講座の選び方" },
];

const utilityNavItems = [{ href: "/advertising", label: "広告・PR" }];

const footerItems = [
  { href: "/", label: "トップ" },
  { href: "/courses", label: "講座の選び方" },
  { href: "/advertising", label: "広告・PRについて" },
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/terms", label: "利用規約" },
  { href: "/contact", label: "お問い合わせ" },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <header className="site-header">
          <div className="container header-inner">
            <Link className="brand" href="/" aria-label="宅建士学習サイト トップへ">
              <span className="brand-mark">宅</span>
              <span>
                <span className="brand-title">宅建士学習サイト</span>
                <span className="brand-subtitle">過去問演習・復習・弱点対策</span>
              </span>
            </Link>
            <div className="site-nav-area">
              <nav className="site-nav" aria-label="主要ページ">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    {item.label}
                  </Link>
                ))}
              </nav>
              <nav className="site-utility-nav" aria-label="広告表示について">
                {utilityNavItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="container footer-inner">
            <p>宅建士試験の学習を、少しずつ続けるための学習サイトです。</p>
            <nav aria-label="補助ページ">
              {footerItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
