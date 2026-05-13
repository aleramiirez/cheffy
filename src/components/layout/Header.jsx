export default function Header({ title, emoji, rightAction }) {
  return (
    <header className="flex items-center justify-between px-4 pt-4 pb-3 bg-bg-main sticky top-0 z-10">
      <h1 className="text-xl font-bold text-text-main flex items-center gap-2">
        {emoji && <span className="text-2xl">{emoji}</span>}
        {title}
      </h1>
      {rightAction && (
        <div className="flex items-center">
          {rightAction}
        </div>
      )}
    </header>
  )
}