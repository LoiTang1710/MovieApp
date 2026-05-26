const styles = {
  AVAILABLE: 'bg-green-500/15 text-green-400',
  ACTIVE: 'bg-green-500/15 text-green-400',
  HIDDEN: 'bg-gray-500/15 text-gray-400',
  INACTIVE: 'bg-gray-500/15 text-gray-400',
  EXPIRED: 'bg-orange-500/15 text-orange-400',
  USER: 'bg-blue-500/15 text-blue-400',
  ADMIN: 'bg-red-500/15 text-red-400',
}

export default function StatusBadge({ status }) {
  const label = status?.toString() || '—'
  return (
    <span
      className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
        styles[label] || 'bg-white/10 text-gray-300'
      }`}
    >
      {label}
    </span>
  )
}
