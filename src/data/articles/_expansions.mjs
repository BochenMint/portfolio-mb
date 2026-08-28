import { expandClose } from './_expand-close.mjs'
import { expandDelivery } from './_expand-delivery.mjs'
import { expandHitl } from './_expand-hitl.mjs'
import { expandOps } from './_expand-ops.mjs'
import { expandStrony } from './_expand-strony.mjs'
import { expandUaDepth } from './_expand-ua-depth.mjs'

function mergeExpansions(base, extra) {
  const out = { ...base }
  for (const [slug, locs] of Object.entries(extra)) {
    out[slug] = {
      pl: [...(out[slug]?.pl || []), ...(locs.pl || [])],
      en: [...(out[slug]?.en || []), ...(locs.en || [])],
      uk: [...(out[slug]?.uk || []), ...(locs.uk || [])],
    }
  }
  return out
}

export const articleExpansions = mergeExpansions(
  mergeExpansions({ ...expandDelivery, ...expandOps, ...expandHitl, ...expandStrony }, expandClose),
  expandUaDepth,
)
