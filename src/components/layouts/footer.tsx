import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} D-Lemma. Todos os direitos reservados.
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/terms" className="hover:text-primary">
            Termos
          </Link>
          <Link href="/privacy" className="hover:text-primary">
            Privacidade
          </Link>
          <Link href="/contact" className="hover:text-primary">
            Contato
          </Link>
        </div>
      </div>
    </footer>
  );
}