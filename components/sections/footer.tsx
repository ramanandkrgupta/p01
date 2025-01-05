export function Footer() {
  return (
    <footer className="py-12 bg-secondary">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">Serve Ease</h3>
            <p className="text-muted-foreground">
              Expert services at your doorstep
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Services</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>Home Cleaning</li>
              <li>Plumbing</li>
              <li>Electrical</li>
              <li>Beauty & Spa</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>About Us</li>
              <li>Careers</li>
              <li>Blog</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Legal</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Cookie Policy</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-muted-foreground">
          <p>© 2024 Serve Ease. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}