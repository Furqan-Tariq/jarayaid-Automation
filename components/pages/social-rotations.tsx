// components/pages/social-rotations.tsx
"use client"

import { useMemo, useState } from "react"
import { Plus, Sparkles, Filter, Search, Quote, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

// --- Types ---
type ToggleItem = { text: string; active: boolean }
type PlatformKey = "tiktok" | "instagram" | "facebook" | "youtube"

type Rotations = {
  // shared sections
  titles: ToggleItem[]
  captions: ToggleItem[]
  intro: ToggleItem[]
  outro: ToggleItem[]
  joiningWords: ToggleItem[]
  // YouTube-only sections (optional on non-YouTube tabs)
  yt_titles?: ToggleItem[]
  yt_descriptions?: ToggleItem[]
  yt_tags?: ToggleItem[]
  yt_categoryIds?: ToggleItem[]
  yt_defaultLanguages?: ToggleItem[]
  yt_privacyStatus?: ToggleItem[]
  yt_madeForKids?: ToggleItem[]
  yt_paidPromotion?: ToggleItem[]
  yt_syntheticMedia?: ToggleItem[]
  yt_thumbnails?: ToggleItem[]
}

export default function SocialRotations() {
  const [activeTab, setActiveTab] = useState<PlatformKey>("tiktok")

  // Default 3 active entries for Joining words across all platforms
  const defaultJoining: ToggleItem[] = [
    { text: "Mentioned", active: true },
    { text: "Notified", active: true },
    { text: "Updated", active: true },
  ]

  const [data, setData] = useState<Record<PlatformKey, Rotations>>({
    tiktok: {
      titles: [
        { text: "Daily News Byte", active: true },
        { text: "Quick Headlines", active: false },
        { text: "60-Second Recap", active: false },
      ],
      captions: [
        { text: "Swipe for more 👉", active: true },
        { text: "Your 60-sec news recap", active: false },
      ],
      intro: [
        { text: "Welcome to today’s TikTok bulletin!", active: true },
        { text: "Here’s what’s trending now.", active: false },
      ],
      outro: [
        { text: "Follow for daily updates!", active: true },
        { text: "See you in the next reel!", active: false },
      ],
      joiningWords: [...defaultJoining],
    },
    instagram: {
      titles: [
        { text: "IG News Roundup", active: true },
        { text: "Today on Insta", active: false },
      ],
      captions: [
        { text: "#news #daily #update", active: true },
        { text: "Save & share this post", active: false },
      ],
      intro: [
        { text: "Welcome to your IG update.", active: true },
        { text: "Top stories you need to know.", active: false },
      ],
      outro: [
        { text: "Like & follow for more!", active: true },
        { text: "See you tomorrow 👋", active: false },
      ],
      joiningWords: [...defaultJoining],
    },
    facebook: {
      titles: [
        { text: "FB Headlines Today", active: true },
        { text: "Daily News Digest", active: false },
      ],
      captions: [
        { text: "Comment your thoughts below", active: true },
        { text: "Share this with friends", active: false },
      ],
      intro: [
        { text: "Welcome to the Facebook bulletin.", active: true },
        { text: "Let’s dive into today’s news.", active: false },
      ],
      outro: [
        { text: "Thanks for watching on Facebook!", active: true },
        { text: "More updates coming soon.", active: false },
      ],
      joiningWords: [...defaultJoining],
    },
    youtube: {
      // Keep legacy fields empty (unused) because YouTube tab is custom below
      titles: [],
      captions: [],
      intro: [],
      outro: [],
      joiningWords: [],
      // YouTube-specific defaults
      yt_titles: [{ text: "YouTube News Bulletin", active: true }],
      yt_descriptions: [{ text: "Top stories and updates.", active: true }],
      yt_tags: [
        { text: "news", active: true },
        { text: "politics", active: true },
        { text: "update", active: true },
      ],
      yt_categoryIds: [{ text: "25", active: true }],
      yt_defaultLanguages: [
        { text: "ar", active: true },
        { text: "en", active: false },
      ],
      yt_privacyStatus: [
        { text: "public", active: true },
        { text: "unlisted", active: false },
        { text: "private", active: false },
      ],
      yt_madeForKids: [
        { text: "No", active: true },
        { text: "Yes", active: false },
      ],
      yt_paidPromotion: [
        { text: "No", active: true },
        { text: "Yes", active: false },
      ],
      yt_syntheticMedia: [
        { text: "No", active: true },
        { text: "Yes", active: false },
      ],
      yt_thumbnails: [],
    },
  })

  // Page-level tools
  const [query, setQuery] = useState("")
  const [activeOnly, setActiveOnly] = useState(false)

  // --- Safe helpers (handle optional sections) ---
  const toggleItem = (platform: PlatformKey, section: keyof Rotations, index: number) => {
    setData(prev => {
      const platformState = { ...prev[platform] }
      const current = (platformState[section] as ToggleItem[] | undefined) ?? []
      const newArr = [...current]
      if (!newArr[index]) return prev
      newArr[index] = { ...newArr[index], active: !newArr[index].active }
      return { ...prev, [platform]: { ...platformState, [section]: newArr } }
    })
  }

  const addItem = (platform: PlatformKey, section: keyof Rotations, text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setData(prev => {
      const platformState = { ...prev[platform] }
      const arr = (platformState[section] as ToggleItem[] | undefined) ?? []
      const nextArr = [...arr, { text: trimmed, active: false }]
      return { ...prev, [platform]: { ...platformState, [section]: nextArr } }
    })
  }

  // --- Reusable Section card ---
  const Section = ({
    platform,
    title,
    sectionKey,
    addLabel,
    icon,
    hint,
  }: {
    platform: PlatformKey
    title: string
    sectionKey: keyof Rotations
    addLabel: string
    icon?: React.ReactNode
    hint?: string
  }) => {
    const items = (data[platform][sectionKey] as ToggleItem[] | undefined) ?? []

    const [adding, setAdding] = useState(false)
    const [draft, setDraft] = useState("")

    const filtered = useMemo(() => {
      const base = activeOnly ? items.filter(i => i.active) : items
      if (!query.trim()) return base
      const q = query.toLowerCase()
      return base.filter(i => i.text.toLowerCase().includes(q))
    }, [items, activeOnly, query])

    const activeCount = items.filter(i => i.active).length

    const handleSubmit = () => {
      addItem(platform, sectionKey, draft)
      setDraft("")
      setAdding(false)
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleSubmit()
      if (e.key === "Escape") {
        setAdding(false)
        setDraft("")
      }
    }

    return (
      <Card className="bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/70 border-border/60 rounded-2xl shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              {icon}
              <div>
                <CardTitle className="text-base">{title}</CardTitle>
                {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="rounded-full">{activeCount} Active</Badge>
              {!adding ? (
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setAdding(true)}>
                  <Plus size={16} /> {addLabel}
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    autoFocus
                    placeholder={`New ${title.slice(0, -1) || "item"}`}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={onKeyDown}
                    className="h-9 w-[240px]"
                  />
                  <Button size="sm" className="bg-accent hover:bg-accent/90" onClick={handleSubmit}>
                    Add
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { setAdding(false); setDraft("") }}>
                    <X className="size-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          {filtered.length === 0 ? (
            <div className="text-sm text-muted-foreground border border-dashed border-border rounded-xl p-6 text-center">
              No items match your filters.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map((it, idx) => (
                <div
                  key={`${title}-${idx}`}
                  className="group rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors px-4 py-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2">
                    <Quote className="size-4 text-muted-foreground/70" />
                    <p className="text-sm leading-snug text-foreground">{it.text}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleItem(platform, sectionKey, idx)}
                    className={`text-xs px-2.5 py-1.5 rounded-full transition-colors ${
                      it.active
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                    aria-pressed={it.active}
                  >
                    {it.active ? "Active" : "Inactive"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // --- Platform panel ---
  const PlatformPanel = ({ platform }: { platform: PlatformKey }) => {
    if (platform === "youtube") {
      const totalActive =
        (data.youtube.yt_titles?.filter(i => i.active).length || 0) +
        (data.youtube.yt_descriptions?.filter(i => i.active).length || 0) +
        (data.youtube.yt_tags?.filter(i => i.active).length || 0) +
        (data.youtube.yt_categoryIds?.filter(i => i.active).length || 0) +
        (data.youtube.yt_defaultLanguages?.filter(i => i.active).length || 0) +
        (data.youtube.yt_privacyStatus?.filter(i => i.active).length || 0) +
        (data.youtube.yt_madeForKids?.filter(i => i.active).length || 0) +
        (data.youtube.yt_paidPromotion?.filter(i => i.active).length || 0) +
        (data.youtube.yt_syntheticMedia?.filter(i => i.active).length || 0) +
        (data.youtube.yt_thumbnails?.filter(i => i.active).length || 0)

      return (
        <div className="space-y-6">
          {/* Platform toolbar */}
          <Card className="bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/70 border-border/60 rounded-2xl">
            <CardContent className="py-4">
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="size-4" />
                  <span className="text-muted-foreground">Active across sections:</span>
                  <Badge className="rounded-full">{totalActive}</Badge>
                </div>

                <Separator className="hidden md:block mx-1 h-6" orientation="vertical" />

                <div className="flex items-center gap-2 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Search text across this platform…"
                      className="pl-8"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2">
                    <Filter className="size-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Active only</span>
                    <Switch checked={activeOnly} onCheckedChange={setActiveOnly} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* YOUTUBE-SPECIFIC CARDS */}
          <Section platform={platform} title="Titles" sectionKey="yt_titles" addLabel="Add Title" hint="You can keep multiple and toggle which one is active." />
          <Section platform={platform} title="Descriptions" sectionKey="yt_descriptions" addLabel="Add Description" hint="Multiline supported; keep several templates and toggle active ones." />
          <Section platform={platform} title="Tags" sectionKey="yt_tags" addLabel="Add Tag" hint="Active tags will be sent as the tag list." />
          <Section platform={platform} title="Category IDs" sectionKey="yt_categoryIds" addLabel="Add Category ID" hint="Common: 25 = News & Politics" />
          <Section platform={platform} title="Default Languages" sectionKey="yt_defaultLanguages" addLabel="Add Language Code" hint="e.g., ar, en" />
          <Section platform={platform} title="Privacy Status" sectionKey="yt_privacyStatus" addLabel="Add Status" hint="Choose one: public, unlisted, private." />
          <Section platform={platform} title="Made for Kids" sectionKey="yt_madeForKids" addLabel="Add Option" hint="Yes/No — only one should be active." />
          <Section platform={platform} title="Has Paid Promotion" sectionKey="yt_paidPromotion" addLabel="Add Option" hint="Yes/No — set disclosure flag." />
          <Section platform={platform} title="Contains Synthetic Media" sectionKey="yt_syntheticMedia" addLabel="Add Option" hint="Yes/No — used for compliance." />
          <Section platform={platform} title="Thumbnails" sectionKey="yt_thumbnails" addLabel="Add Thumbnail Path/URL" hint="Provide file path or URL for custom thumbnail." />
        </div>
      )
    }

    // Non-YouTube platforms: keep original sections
    const totalActive =
      data[platform].titles.filter(i => i.active).length +
      data[platform].captions.filter(i => i.active).length +
      data[platform].intro.filter(i => i.active).length +
      data[platform].outro.filter(i => i.active).length +
      data[platform].joiningWords.filter(i => i.active).length

    return (
      <div className="space-y-6">
        {/* Platform toolbar */}
        <Card className="bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/70 border-border/60 rounded-2xl">
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="size-4" />
                <span className="text-muted-foreground">Active across sections:</span>
                <Badge className="rounded-full">{totalActive}</Badge>
              </div>

              <Separator className="hidden md:block mx-1 h-6" orientation="vertical" />

              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search text across this platform…"
                    className="pl-8"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2">
                  <Filter className="size-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Active only</span>
                  <Switch checked={activeOnly} onCheckedChange={setActiveOnly} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sections */}
        <Section
          platform={platform}
          title="Titles"
          sectionKey="titles"
          addLabel="Add Title"
          icon={<Badge variant="outline" className="rounded-full">T</Badge>}
          hint="Short, punchy, platform-native titles."
        />
        <Section
          platform={platform}
          title="Captions"
          sectionKey="captions"
          addLabel="Add Caption"
          icon={<Badge variant="outline" className="rounded-full">C</Badge>}
          hint="Captions support discovery and context."
        />
        <Section
          platform={platform}
          title="Welcome / Intro Messages"
          sectionKey="intro"
          addLabel="Add Intro"
          icon={<Badge variant="outline" className="rounded-full">IN</Badge>}
          hint="Openers that set tone and hook attention."
        />
        <Section
          platform={platform}
          title="Goodbye / Outro Messages"
          sectionKey="outro"
          addLabel="Add Outro"
          icon={<Badge variant="outline" className="rounded-full">OUT</Badge>}
          hint="Closers with a clear call-to-action."
        />
        {/* NEW: Joining words section */}
        <Section
          platform={platform}
          title="Joining words"
          sectionKey="joiningWords"
          addLabel="Add Joining word"
          icon={<Badge variant="outline" className="rounded-full">JW</Badge>}
          hint="Bridge words inserted between items/stories."
        />
      </div>
    )
  }

  // --- Page layout ---
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Social Rotational Libraries</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Curate titles, captions, intro/outro messages, and joining words for each platform.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as PlatformKey)} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
          <TabsTrigger value="tiktok" className="capitalize">TikTok</TabsTrigger>
          <TabsTrigger value="instagram" className="capitalize">Instagram</TabsTrigger>
          <TabsTrigger value="facebook" className="capitalize">Facebook</TabsTrigger>
          <TabsTrigger value="youtube" className="capitalize">YouTube</TabsTrigger>
        </TabsList>

        <TabsContent value="tiktok"><PlatformPanel platform="tiktok" /></TabsContent>
        <TabsContent value="instagram"><PlatformPanel platform="instagram" /></TabsContent>
        <TabsContent value="facebook"><PlatformPanel platform="facebook" /></TabsContent>
        <TabsContent value="youtube"><PlatformPanel platform="youtube" /></TabsContent>
      </Tabs>
    </div>
  )
}
