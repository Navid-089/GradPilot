"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Clock,
  Send,
  ThumbsDown,
  FileImage,
  Download,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import forumService from "@/lib/forum-service";
import { useAuth } from "@/lib/auth-context";
import { AvatarImage } from "@radix-ui/react-avatar";

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [commentAnonymous, setCommentAnonymous] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [deletingPost, setDeletingPost] = useState(false);
  const [deletingComment, setDeletingComment] = useState(null);

  useEffect(() => {
    if (params.id) {
      loadPost();
    }
  }, [params.id]);

  const getAvatarSrc = (userId, gender) => {
    console.log("User ID: ", userId);
    console.log("Page Gender: ", gender);
    if (!userId || !gender) return "/placeholder.svg";
    let folder = "common";
    let count = 2;
    if (gender === "male") {
      folder = "male";
      count = 43;
    } else if (gender === "female") {
      folder = "female";
      count = 24;
    }
    const idx = (userId % count) + 1;
    return `/avatars/${folder}/${folder}_${idx}.png`;
  };

  const loadPost = async () => {
    try {
      setLoading(true);
      const data = await forumService.getPost(params.id);
      setPost(data.post);
      setComments(data.comments || []);
      console.log("Logged in user:", user);
    } catch (error) {
      console.error("Error loading post:", error);
    } finally {
      setLoading(false);
    }
    console.log("Post userId:", post.userId);
  };

  const handlePostLike = async (isLike) => {
    try {
      await forumService.togglePostLike(params.id, isLike);
      loadPost(); // Refresh to get updated counts
    } catch (error) {
      console.error("Error toggling post like:", error);
    }
  };

  const handleCommentLike = async (commentId, isLike) => {
    try {
      await forumService.toggleCommentLike(commentId, isLike);
      loadPost(); // Refresh to get updated counts
    } catch (error) {
      console.error("Error toggling comment like:", error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      await forumService.addComment(params.id, {
        content: newComment,
        isAnonymous: commentAnonymous,
      });
      setNewComment("");
      setCommentAnonymous(false);
      loadPost(); // Refresh to show new comment
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeletePost = async () => {
    try {
      setDeletingPost(true);
      await forumService.deletePost(params.id);
      router.push("/dashboard/forum"); // Redirect to forum after deletion
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    } finally {
      setDeletingPost(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      setDeletingComment(commentId);
      await forumService.deleteComment(commentId);
      loadPost(); // Refresh to remove deleted comment
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment. Please try again.");
    } finally {
      setDeletingComment(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFileType = (url) => {
    const extension = url.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
      return "image";
    } else if (["pdf"].includes(extension)) {
      return "pdf";
    } else if (["doc", "docx"].includes(extension)) {
      return "document";
    }
    return "file";
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">Loading post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <p>Post not found.</p>
          <Link href="/dashboard/forum">
            <Button className="mt-4">Back to Forum</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/forum">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forum
          </Button>
        </Link>
      </div>

      {/* Post */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl">{post.title}</CardTitle>
              {user && post && Number(user.userId) === Number(post.userId) && (
                <AlertDialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-red-600 focus:text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Post
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Post</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this post? This action
                        cannot be undone. All comments associated with this post
                        will also be deleted.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeletePost}
                        disabled={deletingPost}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {deletingPost ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={getAvatarSrc(post.userId, post.userGender)}
                    alt={user?.name}
                  />
                  <AvatarFallback>
                    {post.isAnonymous
                      ? "A"
                      : post.authorName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {/* <span>By {post.authorName}</span> */}
                {post.isAnonymous ? (
                  <span>Anonymous User</span>
                ) : (
                  <span>{post.authorName}</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(post.createdAt)}
              </div>
              {/* {post.updatedAt !== post.createdAt && (
                <span className="text-xs">
                  (edited {formatDate(post.updatedAt)})
                </span>
              )} */}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Content */}
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* File Attachment */}
          {post.fileUrl && (
            <div className="border rounded-lg p-4">
              {getFileType(post.fileUrl) === "image" ? (
                <div className="space-y-2">
                  <img
                    src={post.fileUrl}
                    alt="Post attachment"
                    className="max-w-full h-auto rounded-md"
                  />
                  <a
                    href={post.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Download className="w-4 h-4" />
                    Download original
                  </a>
                </div>
              ) : (
                <a
                  href={post.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <FileImage className="w-4 h-4" />
                  View attachment
                </a>
              )}
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePostLike(true)}
              className={post.userLiked ? "text-red-500" : ""}
            >
              <Heart
                className={`w-4 h-4 mr-1 ${
                  post.userLiked ? "fill-current" : ""
                }`}
              />
              {post.likeCount || 0}
            </Button>
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePostLike(false)}
              className={post.userDisliked ? "text-blue-500" : ""}
            >
              <ThumbsDown
                className={`w-4 h-4 mr-1 ${
                  post.userDisliked ? "fill-current" : ""
                }`}
              />
              {post.dislikeCount || 0}
            </Button> */}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MessageCircle className="w-4 h-4" />
              {comments.length} Comments
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Comment */}
      <Card>
        <CardHeader>
          <CardTitle>Add a Comment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment here..."
              rows={4}
              className="resize-none"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="comment-anonymous"
                  checked={commentAnonymous}
                  onCheckedChange={setCommentAnonymous}
                />
                <Label htmlFor="comment-anonymous">Comment anonymously</Label>
              </div>
              <Button
                type="submit"
                disabled={submittingComment || !newComment.trim()}
              >
                <Send className="w-4 h-4 mr-2" />
                {submittingComment ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Comments */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Comments ({comments.length})</h3>

        {comments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                No comments yet. Be the first to comment!
              </p>
            </CardContent>
          </Card>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {/* Comment Header */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      {/* <Avatar className="w-5 h-5">
                        <AvatarFallback>
                          {comment.authorName.charAt(0).toUpperCase()}
                          {comment.isAnonymous
                            ? "A"
                            : comment.authorName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar> */}
                      <Avatar className="w-5 h-5">
                        {!comment.isAnonymous &&
                        comment.userId &&
                        comment.userGender ? (
                          <img
                            src={getAvatarSrc(
                              comment.userId,
                              comment.userGender
                            )}
                            alt={comment.authorName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : null}
                        <AvatarFallback>
                          {comment.isAnonymous
                            ? "A"
                            : comment.authorName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {comment.isAnonymous ? (
                        <span>Anonymous User</span>
                      ) : (
                        <span>{comment.authorName}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(comment.createdAt)}
                    </div>
                  </div>

                  {/* Comment Content */}
                  <p className="whitespace-pre-wrap">{comment.content}</p>

                  {/* Comment Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCommentLike(comment.id, true)}
                        className={comment.userLiked ? "text-red-500" : ""}
                      >
                        <Heart
                          className={`w-3 h-3 mr-1 ${
                            comment.userLiked ? "fill-current" : ""
                          }`}
                        />
                        {comment.likeCount || 0}
                      </Button>
                      {/* <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCommentLike(comment.id, false)}
                        className={comment.userDisliked ? "text-blue-500" : ""}
                      >
                        <ThumbsDown
                          className={`w-3 h-3 mr-1 ${
                            comment.userDisliked ? "fill-current" : ""
                          }`}
                        />
                        {comment.dislikeCount || 0}
                      </Button> */}
                    </div>
                    {user &&
                      post &&
                      Number(user.userId) === Number(comment.userId) && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Comment
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this comment?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteComment(comment.id)}
                                disabled={deletingComment === comment.id}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {deletingComment === comment.id
                                  ? "Deleting..."
                                  : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
