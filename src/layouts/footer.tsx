function Footer() {
  return (
    <>
      <footer className="bg-slate-900 text-slate-200">
        <div className="mx-auto max-w-7xl px-3 py-6 flex flex-col items-center justify-between gap-18">
          <p className="text-sm">
            Welddefectspecimen.
          </p>

          <div className="flex gap-6 text-sm">
            <a href="/about" className="hover:text-white transition">
              About
            </a>
            <a href="/privacy" className="hover:text-white transition">
              Privacy
            </a>
            <a href="/contact" className="hover:text-white transition">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
