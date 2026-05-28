import type { Project } from '../data/content'

const ACCENT = 'var(--color-accent)'

type Props = { project: Project }

export function ProjectMock({ project }: Props) {
  const { id } = project

  if (id === 'plumm') {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#0a1210] p-4">
        <div className="mb-3 flex gap-2">
          <span className="h-2 w-2 rounded-full bg-red-400/60" />
          <span className="h-2 w-2 rounded-full bg-amber-400/60" />
          <span className="h-2 w-2 rounded-full bg-emerald-400/60" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2 rounded-lg bg-white/5 p-3">
            <div className="bg-accent/40 mb-2 h-2 w-16 rounded" />
            <div className="space-y-1.5">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex justify-between rounded bg-white/[0.04] px-2 py-1.5">
                  <div className="h-1.5 w-12 rounded bg-white/20" />
                  <div className="h-1.5 w-8 rounded" style={{ backgroundColor: ACCENT }} />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg bg-white/5 p-2">
            <div className="font-display text-accent text-lg font-bold">JPK</div>
            <div className="bg-accent/30 mt-2 h-1 w-full rounded" />
            <div className="bg-accent/20 mt-1 h-1 w-2/3 rounded" />
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
          <div className="rounded-xl border border-white/10 bg-black/40 p-3 backdrop-blur-sm">
            <div className="text-accent text-[10px] tracking-widest uppercase">Gdańsk · Seaside</div>
            <div className="mt-1 font-display text-lg font-bold">Mint Apartments</div>
            <div className="mt-2 flex gap-2">
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px]">AI</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px]">7 języków</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (id === 'idrive') {
    return (
      <div className="relative flex h-full w-full flex-col justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#1a1510] to-[#121110] p-4">
        <div
          className="mx-auto h-16 w-28 rounded-lg opacity-90"
          style={{
            background: `linear-gradient(180deg, color-mix(in srgb, ${ACCENT} 40%, transparent) 0%, transparent 100%), #1c1c22`,
          }}
        />
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-white/10 bg-white/5 p-2 text-center">
            <div className="font-display text-accent text-xl font-bold">24/7</div>
            <div className="text-muted text-[9px] uppercase">Pickup</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-2 text-center">
            <div className="font-display text-xl font-bold">Fleet</div>
            <div className="text-muted text-[9px] uppercase">Live</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-xl bg-[#0e0c14] p-4">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <div className="bg-accent/20 h-8 w-8 rounded-lg" />
        <div>
          <div className="text-muted text-[10px]">Agentic OS</div>
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
            <span className="bg-accent h-1.5 w-1.5 rounded-full" />
            <span className="text-[11px] text-white/80">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
