import Link from "next/link"

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-block h-6 w-6 rounded-md bg-gradient-to-br from-primary to-accent" aria-hidden />
          <span className="text-sm font-semibold">Stremini</span>
          <span className="text-xs text-muted-foreground">© {new Date().getFullYear()}</span>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center gap-4 text-sm">
            <li>
              <Link href="#pricing" className="hover:text-primary">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="#about" className="hover:text-primary">
                About
              </Link>
            </li>
            <li>
              <Link href="#faq" className="hover:text-primary">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Link href="https://www.instagram.com/streminiai/" target="_blank" rel="noopener noreferrer">
            Instagram
          </Link
          <Link href="https://twitter.com/stremini" target="_blank" rel="noopener noreferrer">
            Twitter
          </Link>
        </div>
      </div>
    </footer>
  )
}
