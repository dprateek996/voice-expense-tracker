import { Button } from '@/components/ui/button';

const EmptyState = ({ icon: Icon, title, description, ctaLabel, onCtaClick }) => {
  return (
    <div className="surface-2 rounded-lg border border-border card-pad-lg text-center shadow-sm">
      <div className="mx-auto mb-8 flex h-12 w-12 items-center justify-center rounded-md bg-muted text-muted-foreground">
        {Icon ? <Icon className="h-5 w-5" aria-hidden="true" /> : null}
      </div>

      <h3 className="text-heading text-2xl font-semibold text-foreground">{title}</h3>
      <p className="text-meta mt-8 text-muted-foreground">{description}</p>

      {ctaLabel ? (
        <div className="mt-8">
          <Button type="button" onClick={onCtaClick} variant="secondary" size="default">
            {ctaLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default EmptyState;
