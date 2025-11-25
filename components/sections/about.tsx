export function About() {
  const items = [
    {
      title: "Floating AI",
      desc: "Stremini hovers over your apps, appearing exactly when you need help.",
    },
    {
      title: "Edge + Cloud AI",
      desc: "On-device for speed and privacy, cloud for heavy lifting—best of both.",
    },
    {
      title: "Strong Security",
      desc: "Your data is protected with strong encryption and zero-trust defaults.",
    },
    {
      title: "Proactive Prevention",
      desc: "Real-time monitoring prevents threats before they interrupt your work.",
    },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4">
      <h2 className="text-balance text-center text-3xl font-semibold md:text-4xl">Why Stremini?</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {items.map((it) => (
          <div key={it.title} className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-lg font-medium">{it.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{it.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
