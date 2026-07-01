export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex h-12 items-center justify-between px-4">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} University Management Portal. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="/privacy"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
