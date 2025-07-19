"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Search,
  Plus,
  Heart,
  MessageCircle,
  Clock,
  Tag,
  Filter,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import forumService from "@/lib/forum-service";
import { useAuth } from "@/lib/auth-context";

export default function ForumPage() {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [deletingPost, setDeletingPost] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadPosts();
    }, 500); // debounce for search/filter/page

    return () => clearTimeout(delayDebounce);
  }, [currentPage, selectedTag, searchTitle]);

  useEffect(() => {
    loadTags(); // Run only once
  }, []);

  const loadPosts = async () => {
    // if (!token) return;
    try {
      setLoading(true);
      const response = await forumService.getPosts(
        currentPage,
        10,
        selectedTag || null,
        searchTitle || null
      );
      setPosts(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const tagsData = await forumService.getTags();
      setTags(tagsData || []);
    } catch (error) {
      console.error("Error loading tags:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    loadPosts();
  };

  const handleTagFilter = (tag) => {
    setSelectedTag(tag === selectedTag ? "" : tag);
    setCurrentPage(0);
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

  const handlePostLike = async (postId, isLike) => {
    try {
      await forumService.togglePostLike(postId, isLike);
      loadPosts(); // Refresh posts to update like counts
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      setDeletingPost(postId);
      await forumService.deletePost(postId);
      loadPosts(); // Refresh posts to remove deleted post
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    } finally {
      setDeletingPost(null);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Forum</h1>
          <p className="text-muted-foreground">
            Connect with the community, ask questions, and share knowledge
          </p>
        </div>
        <Link href="/dashboard/forum/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search posts by title..."
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </form>

          {/* Tags Filter */}
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Badge
              variant={selectedTag === "" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleTagFilter("")}
            >
              All
            </Badge>
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleTagFilter(tag)}
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      {loading ? (
        <div className="text-center py-8">Loading posts...</div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No posts found.</p>
            <Link href="/dashboard/forum/create">
              <Button className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Create the first post
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Link href={`/dashboard/forum/posts/${post.id}`}>
                      <CardTitle className="hover:text-blue-600 cursor-pointer">
                        {post.title}
                      </CardTitle>
                    </Link>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      {post.isAnonymous ? (
                        <span>Anonymous User</span>
                      ) : (
                        <span>By {post.authorName}</span>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(post.createdAt)}
                      </div>
                    </div>
                  </div>
                  {user && post.userId === user.id && (
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
                            Are you sure you want to delete this post? This
                            action cannot be undone. All comments associated
                            with this post will also be deleted.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeletePost(post.id)}
                            disabled={deletingPost === post.id}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {deletingPost === post.id
                              ? "Deleting..."
                              : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {post.content.substring(0, 200)}...
                </p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePostLike(post.id, true)}
                      className={post.userLiked ? "text-red-500" : ""}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          post.userLiked ? "fill-current" : ""
                        }`}
                      />
                      {post.likeCount || 0}
                    </Button>
                    {/* <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePostLike(post.id, false)}
                      className={post.userDisliked ? "text-blue-500" : ""}
                    >
                      👎 {post.dislikeCount || 0}
                    </Button> */}
                  </div>
                  <Link href={`/dashboard/forum/posts/${post.id}`}>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {post.commentCount || 0} Comments
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {currentPage + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
            }
            disabled={currentPage === totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
