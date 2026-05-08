"use client";

import { useState, useEffect, useCallback } from "react";
import { getComments, addComment } from "@/app/actions/comments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { timeAgo } from "@/lib/utils";
import { toast } from "sonner";
import { Loader2, MessageCircle, Reply, Send, User } from "lucide-react";
import type { CommentWithReplies } from "@/lib/types/database";

export function CommentSection({ projectId }: { projectId: string }) {
  const [comments, setComments] = useState<CommentWithReplies[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorName, setAuthorName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  const fetchComments = useCallback(async () => {
    const result = await getComments(projectId);
    if (result.data) {
      setComments(result.data as CommentWithReplies[]);
    }
    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    // Load saved author name
    const saved = localStorage.getItem("devprogress_author_name");
    if (saved) setAuthorName(saved);
    fetchComments();
  }, [fetchComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!authorName.trim() || !message.trim()) return;

    setSubmitting(true);
    localStorage.setItem("devprogress_author_name", authorName);

    const result = await addComment(projectId, authorName, message);
    setSubmitting(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      setMessage("");
      fetchComments();
    }
  }

  async function handleReply(parentId: string) {
    if (!authorName.trim() || !replyMessage.trim()) return;

    setSubmitting(true);
    localStorage.setItem("devprogress_author_name", authorName);

    const result = await addComment(
      projectId,
      authorName,
      replyMessage,
      parentId,
    );
    setSubmitting(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      setReplyMessage("");
      setReplyTo(null);
      fetchComments();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-violet-400" />
        <h3 className="text-lg font-semibold">Komentar ({comments.length})</h3>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          placeholder="Nama Anda"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          required
          className="bg-white/5 border-white/10"
        />
        <Textarea
          placeholder="Tulis komentar..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="bg-white/5 border-white/10 min-h-[80px]"
        />
        <Button
          type="submit"
          disabled={submitting}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500"
        >
          {submitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          Kirim
        </Button>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 rounded-lg bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          Belum ada komentar. Jadilah yang pertama berkomentar!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              {/* Parent comment */}
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500/30 to-indigo-500/30 flex items-center justify-center">
                    <User className="h-3.5 w-3.5 text-violet-400" />
                  </div>
                  <span className="text-sm font-medium">
                    {comment.author_name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {timeAgo(comment.created_at)}
                  </span>
                </div>
                <p className="text-sm text-foreground/80 ml-9">
                  {comment.message}
                </p>
                <button
                  onClick={() =>
                    setReplyTo(replyTo === comment.id ? null : comment.id)
                  }
                  className="ml-9 mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-violet-400 transition-colors"
                >
                  <Reply className="h-3 w-3" />
                  Balas
                </button>
              </div>

              {/* Replies */}
              {comment.replies?.length > 0 && (
                <div className="ml-8 space-y-2">
                  {comment.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="rounded-lg border border-white/5 bg-white/[0.01] p-3"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-6 w-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                          <User className="h-3 w-3 text-indigo-400" />
                        </div>
                        <span className="text-sm font-medium">
                          {reply.author_name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {timeAgo(reply.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/80 ml-8">
                        {reply.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply form */}
              {replyTo === comment.id && (
                <div className="ml-8 flex gap-2">
                  <Input
                    placeholder="Tulis balasan..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleReply(comment.id);
                      }
                    }}
                    className="bg-white/5 border-white/10 text-sm h-9"
                  />
                  <Button
                    size="sm"
                    disabled={submitting}
                    onClick={() => handleReply(comment.id)}
                    className="bg-violet-600 hover:bg-violet-500 h-9"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
