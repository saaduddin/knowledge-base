"use client"

import Link from "next/link"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { ThumbsUp, MessageSquare } from "lucide-react"
import { format } from "date-fns"

interface Article {
  id: string
  title: string
  slug: string
  body: string
  locked: boolean
  pinned: boolean
  user: {
    id: string
    username: string
    avatar?: string
  }
  tags?: Array<{ id: string; name: string; color: string }>
  createdAt: string
  Post?: any[] // API returns 'Post' (capital P) as the posts array
  posts?: any[] // Fallback for compatibility
  likes?: Array<{ id: string; userId: string; dislike?: boolean }>
  _count?: {
    Post?: number // API may return _count.Post
    posts?: number
  }
}

export function ArticleCard({ thread }: { thread: Article }) {
  const postsCount = thread._count?.Post || thread._count?.posts || thread.Post?.length || thread.posts?.length || 0
  const likesCount = thread.likes?.filter((l) => !l.dislike).length || 0

  return (
    <Link href={`/article/${thread.id}`}>
      <Card className="hover:border-primary/50 transition-colors">
        <CardHeader className="pb-3">
          <h3 className="text-lg font-semibold truncate">{thread.title}</h3>
        </CardHeader>
        <CardFooter className="pt-3 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {format(new Date(thread.createdAt), "MMM d, yyyy")}
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span>{postsCount}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <ThumbsUp className="h-4 w-4" />
              <span>{likesCount}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
