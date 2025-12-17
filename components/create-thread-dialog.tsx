"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { ForumAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"

export function CreateArticleDialog({ onSuccess }: { onSuccess?: () => void }) {
  const { token } = useAuth()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPoll, setShowPoll] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    pinned: false,
    locked: false,
  })
  const [pollData, setPollData] = useState({
    title: "",
    options: [
      { title: "", color: "#8b5cf6" },
      { title: "", color: "#3b82f6" },
    ],
  })

  const addPollOption = () => {
    const colors = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#ec4899"]
    setPollData({
      ...pollData,
      options: [...pollData.options, { title: "", color: colors[pollData.options.length % colors.length] }],
    })
  }

  const removePollOption = (index: number) => {
    setPollData({
      ...pollData,
      options: pollData.options.filter((_, i) => i !== index),
    })
  }

  const updatePollOption = (index: number, title: string) => {
    const newOptions = [...pollData.options]
    newOptions[index].title = title
    setPollData({ ...pollData, options: newOptions })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    setIsLoading(true)
    try {
      const payload: any = { ...formData, tagIds: [] }

      if (showPoll && pollData.title && pollData.options.every((opt) => opt.title)) {
        payload.poll = {
          title: pollData.title,
          options: pollData.options.map((opt) => ({
            title: opt.title,
            color: opt.color,
            extendedData: {},
          })),
        }
      }

      await ForumAPI.createArticle(payload, token)
      toast({ title: "Article created!", description: "Your thread has been posted." })
      setOpen(false)
      setFormData({ title: "", body: "", pinned: false, locked: false })
      setPollData({
        title: "",
        options: [
          { title: "", color: "#8b5cf6" },
          { title: "", color: "#3b82f6" },
        ],
      })
      setShowPoll(false)
      onSuccess?.()
    } catch (error) {
      console.error("Failed to create thread:", error)
      toast({
        title: "Failed to create thread",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Article
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit New Article</DialogTitle>
          <DialogDescription>
            Share your knowledge by creating a new article thread.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="What's your article about?"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="body">Content</Label>
            <Textarea
              id="body"
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              placeholder="Describe your article in detail... (Markdown supported)"
              rows={8}
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="pinned"
                checked={formData.pinned}
                onCheckedChange={(checked) => setFormData({ ...formData, pinned: checked as boolean })}
              />
              <label
                htmlFor="pinned"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Pin article
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="locked"
                checked={formData.locked}
                onCheckedChange={(checked) => setFormData({ ...formData, locked: checked as boolean })}
              />
              <label
                htmlFor="locked"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Lock article
              </label>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Article"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
