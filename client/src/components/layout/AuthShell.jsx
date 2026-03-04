import { ShieldCheck, Sparkles, Waves } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const PROOF_POINTS = [
  { icon: Waves, title: 'Track expenses with your voice', text: 'Capture entries naturally in seconds with guided confirmation.' },
  { icon: Sparkles, title: 'Instant analytics', text: 'Understand spend trends with a clean dashboard and smart summaries.' },
  { icon: ShieldCheck, title: 'Secure and encrypted', text: 'Your account and session data stay protected with standard auth guards.' },
];

const AuthShell = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 lg:px-8 lg:py-10">
        <div className="mb-8 flex items-center justify-end">
          <ThemeToggle />
        </div>

        <div className="grid flex-1 items-stretch gap-8 lg:grid-cols-2">
          <section className="surface-2 rounded-lg border border-border shadow-sm card-pad-lg">
            <header className="mb-8">
              <p className="text-meta text-muted-foreground">VoEx Access</p>
              <h1 className="text-heading mt-2 text-3xl font-semibold text-foreground">{title}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            </header>
            {children}
          </section>

          <aside className="surface-2 hidden rounded-lg border border-border shadow-sm lg:block">
            <div className="card-pad-lg">
              <p className="text-meta text-muted-foreground">Why teams choose VoEx</p>
              <div className="mt-8 space-y-6">
                {PROOF_POINTS.map((item) => (
                  <article key={item.title} className="rounded-md border border-border bg-background p-6">
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-md bg-muted text-foreground">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-heading text-lg font-medium text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AuthShell;
