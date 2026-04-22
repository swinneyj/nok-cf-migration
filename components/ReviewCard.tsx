interface ReviewProps {
  name: string
  date: string
  rating?: number
  text: string
  location?: string
  source?: string
}

export default function ReviewCard({ name, date, rating = 5, text, location, source }: ReviewProps) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2)
  return (
    <div className="card-dark p-6">
      <div className="stars text-sm mb-3">{'★'.repeat(rating)}</div>
      <p className="text-white/70 text-sm leading-relaxed mb-5 italic">"{text}"</p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-400 font-bold text-xs font-display">
          {initials}
        </div>
        <div>
          <div className="text-white font-semibold text-sm">{name}</div>
          <div className="text-white/30 text-xs">{location ? `${location} · ` : ''}{date}</div>
          {source && <div className="text-gold-400/80 text-[11px] mt-1 uppercase tracking-wide">{source}</div>}
        </div>
      </div>
    </div>
  )
}
