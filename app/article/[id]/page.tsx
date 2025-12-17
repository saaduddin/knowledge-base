import { ArticleContent } from "@/components/thread-content"

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-background">
      <ArticleContent threadId={id} />
    </div>
  )
}
