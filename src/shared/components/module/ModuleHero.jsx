function ModuleHero({ eyebrow = "Epic Inventory", title, description, stats = [], action }) {
  return (
    <section className="app-card p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">{eyebrow}</p>
          <h2 className="mt-2 text-3xl font-semibold text-[var(--color-text)]">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">{description}</p>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>

      {stats.length ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border px-4 py-3" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-muted)' }}>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-soft)]">{stat.label}</p>
              <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">{stat.value}</p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default ModuleHero;
