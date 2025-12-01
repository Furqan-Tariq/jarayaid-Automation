"use client"

type Props = { text: string }

export default function BulletinContent({ text }: Props) {
  return (
    <div className="border-t border-border p-5 bg-muted/30">
      <div
        dir="rtl"
        className="rounded-2xl bg-background text-foreground shadow-sm border border-border px-5 py-4 leading-8 text-[15px]"
        style={{ lineHeight: 1.9 }}
      >
        {text}
      </div>
    </div>
  )
}
