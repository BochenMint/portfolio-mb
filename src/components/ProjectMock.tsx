import type { Project } from '../data/content'

type Props = { project: Project }

export function ProjectMock({ project }: Props) {
  const { id, accent } = project

  if (id === 'plumm') {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#0a1210] p-4">
        <div className="mb-3 flex gap-2">
          <span className="h-2 w-2 rounded-full bg-red-400/60" />
          <span className="h-2 w-2 rounded-full bg-gold/60" />
          <span className="h-2 w-2 rounded-full bg-mint/60" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2 rounded-lg bg-white/5 p-3">
            <div className="mb-2 h-2 w-16 rounded bg-mint/40" />
            <div className="space-y-1.5">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex justify-between rounded bg-white/[0.04] px-2 py-1.5">
                  <div className="h-1.5 w-12 rounded bg-white/20" />
                  <div className="h-1.5 w-8 rounded" style={{ backgroundColor: accent }} />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg bg-mint/10 p-2">
            <div className="font-display text-lg font-bold text-mint">JPK</div>
            <div className="mt-2 h-1 w-full rounded bg-mint/30" />
            <div className="mt-1 h-1 w-2/3 rounded bg-mint/20" />
          </div>
        </div>
      </div>
    )
  }

  if (id === 'mint') {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-xl">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'linear-gradient(160deg, rgba(5,5,8,0.2) 0%, rgba(5,5,8,0.85) 70%), linear-gradient(135deg, #1a3a4a 0%, #0d1f28 50%, #050508 100%)',
          }}
        />
        <div className="relative flex h-full flex-col justify-end p-4">
          <div className="glass rounded-xl p-3">
            <div className="text-[10px] tracking-widest text-mint uppercase">Gdańsk · Seaside</div>
            <div className="mt-1 font-display text-lg font-bold">Mint Apartments</div>
            <div className="mt-2 flex gap-2">
              <span className="rounded-full bg-mint/20 px-2 py-0.5 text-[10px] text-mint">AI</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px]">7 języków</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (id === 'idrive') {
    return (
      <div className="relative flex h-full w-full flex-col justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#1a1510] to-ink p-4">
        <div
          className="mx-auto h-16 w-28 rounded-lg opacity-90"
          style={{
            background: `linear-gradient(180deg, ${accent}40 0%, transparent 100%), #1c1c22`,
            boxShadow: `0 20px 40px ${accent}22`,
          }}
        />
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-gold/20 bg-gold/5 p-2 text-center">
            <div className="font-display text-gold text-xl font-bold">24/7</div>
            <div className="text-[9px] text-muted uppercase">Pickup</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-2 text-center">
            <div className="font-display text-xl font-bold">Fleet</div>
            <div className="text-[9px] text-muted uppercase">Live</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-xl bg-[#0e0c14] p-4">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <div className="h-8 w-8 rounded-lg" style={{ background: `${accent}33` }} />
        <div>
          <div className="text-[10px] text-muted">Agentic OS</div>
          <div className="h-1.5 w-20 rounded bg-white/30" />
        </div>
      </div>
      <div className="mt-3 flex-1 space-y-2">
        {['Plan', 'Execute', 'Audit'].map((label, i) => (
          <div
            key={label}
            className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.03] px-2 py-2"
            style={{ marginLeft: i * 8 }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
            <span className="text-[11px] text-cream/80">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
