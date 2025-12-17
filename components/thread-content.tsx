"use client"

import { useEffect, useState } from "react"
import { PostCard } from "@/components/post-card"
import { ReplyForm } from "@/components/reply-form"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ForumAPI } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { Loader2, ThumbsDown, Lock, Pin, ArrowLeft, Heart } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"
import { PollWidget } from "@/components/poll-widget"
import { ForumHeader } from "@/components/forum-header"
import { useToast } from "@/components/ui/use-toast"
import { useAuthDialog } from "@/lib/auth-dialog-context"

export function ArticleContent({ threadId }: { threadId: string }) {
  const router = useRouter()
  const { user, token } = useAuth()
  const { openAuthDialog } = useAuthDialog()
  const [thread, setArticle] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const loadArticle = async () => {
    setIsLoading(true)
    try {
      const [threadData, postsData] = await Promise.all([
        ForumAPI.getArticle(threadId),
        ForumAPI.getPosts({ threadId, limit: 100 }),
      ])
      setArticle(threadData)
      setPosts(postsData.posts || [])
    } catch (error) {
      console.error("Failed to load thread:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setPosts([])
    setArticle(null)
    loadArticle()
  }, [threadId])

  const handleLike = async () => {
    if (!token) {
      openAuthDialog()
      return
    }
    try {
      const hasLiked = thread.likes?.some((l: any) => l.userId === user?.id && !l.dislike)
      await ForumAPI.likeArticle(threadId, hasLiked, token)
      loadArticle()
    } catch (error) {
      console.error("Failed to like")
    }
  }

  const handleDislike = async () => {
    if (!token) {
      openAuthDialog()
      return
    }
    try {
      const hasDisliked = thread.likes?.some((l: any) => l.userId === user?.id && l.dislike)
      await ForumAPI.dislikeArticle(threadId, hasDisliked, token)
      loadArticle()
    } catch (error) {
      console.error("Failed to dislike")
    }
  }

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </main>
    )
  }

  if (!thread) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Article not found</p>
          <Button onClick={() => router.push("/")} className="mt-4">
            Go Home
          </Button>
        </div>
      </main>
    )
  }

  const isArticleOwner = user?.id === thread.user?.id

  const likesCount = thread.likes?.filter((l: any) => !l.dislike).length || 0
  const dislikesCount = thread.likes?.filter((l: any) => l.dislike).length || 0

  const hasLiked = thread.likes?.some((l: any) => l.userId === user?.id && !l.dislike)
  const hasDisliked = thread.likes?.some((l: any) => l.userId === user?.id && l.dislike)

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <ForumHeader />

        <Button variant="ghost" className="mb-4" onClick={() => router.push("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to KB
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start gap-3 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={thread.user?.avatar || "/placeholder.svg"} />
                <AvatarFallback>{thread.user?.username?.[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {thread.pinned && <Pin className="h-4 w-4 text-primary" />}
                  {thread.locked && <Lock className="h-4 w-4 text-muted-foreground" />}
                  <h1 className="text-2xl font-bold">{thread.title}</h1>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{thread.user?.username}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>

            {thread.tags && thread.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {thread.tags.map((tag: any) => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    style={{ backgroundColor: tag.color + "20", color: tag.color }}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap mb-4">{thread.body}</p>

            {thread.poll && (
              <div className="mb-4">
                <PollWidget threadId={threadId} poll={thread.poll} />
              </div>
            )}

            <div className="flex items-center gap-2 pt-4 border-t">
              <Button variant={hasLiked ? "default" : "outline"} size="sm" onClick={handleLike}>
                <Heart className="h-4 w-4 mr-1" />
                {likesCount}
              </Button>
              <Button variant={hasDisliked ? "default" : "outline"} size="sm" onClick={handleDislike}>
                <ThumbsDown className="h-4 w-4 mr-1" />
                {dislikesCount}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">{posts.length} Replies</h2>

          {user && !thread.locked && (
            <Card className="mb-4">
              <CardContent className="pt-6">
                <ReplyForm threadId={threadId} onSuccess={loadArticle} />
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onUpdate={loadArticle} isArticleOwner={isArticleOwner} />
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No replies yet. Be the first to respond!</p>
              {!user && (
                <Button variant="outline" onClick={openAuthDialog}>
                  Sign in to reply
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
