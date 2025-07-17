"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Upload, X, Tag, ArrowLeft } from "lucide-react";
import forumService from "@/lib/forum-service";
import Link from "next/link";

export default function CreatePostPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isAnonymous: false,
    fileUrl: "",
    tags: [],
  });
  const [availableTags, setAvailableTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const tags = await forumService.getTags();
      setAvailableTags(tags || []);
    } catch (error) {
      console.error("Error loading tags:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    try {
      setUploading(true);
      const response = await forumService.uploadFile(file);
      setFormData((prev) => ({
        ...prev,
        fileUrl: response.url,
      }));
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFormData((prev) => ({
      ...prev,
      fileUrl: "",
    }));
  };

  const addTag = (tagName) => {
    const tag = tagName.toLowerCase().trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
    setNewTag("");
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleAddNewTag = (e) => {
    e.preventDefault();
    if (newTag.trim()) {
      addTag(newTag);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      await forumService.createPost(formData);
      router.push("/dashboard/forum");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/forum">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forum
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create New Post</h1>
          <p className="text-muted-foreground">
            Share your thoughts, ask questions, or start a discussion
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter a descriptive title for your post"
                required
                maxLength={255}
              />
            </div>

            {/* Content */}
            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Write your post content here..."
                required
                rows={8}
                className="resize-none"
              />
            </div>

            {/* File Upload */}
            <div>
              <Label>Attachment (Optional)</Label>
              <div className="mt-2">
                {formData.fileUrl ? (
                  <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
                    <span className="flex-1 text-sm text-green-600">
                      File uploaded successfully
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="file"
                      id="file"
                      onChange={handleFileUpload}
                      accept="image/*,.pdf,.doc,.docx,.txt"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploading}
                    />
                    <div className="flex items-center gap-2 p-3 border-2 border-dashed rounded-lg text-center hover:bg-gray-50">
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {uploading
                          ? "Uploading..."
                          : "Click to upload file (max 10MB)"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Anonymous Toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                id="anonymous"
                name="isAnonymous"
                checked={formData.isAnonymous}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isAnonymous: checked }))
                }
              />
              <Label htmlFor="anonymous">Post anonymously</Label>
            </div>
          </CardContent>
        </Card>

        {/* Tags Section */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <p className="text-sm text-muted-foreground">
              Add tags to help others find your post
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Selected Tags */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="default" className="text-sm">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-xs hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Add New Tag */}
            {/* <form onSubmit={handleAddNewTag} className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a new tag"
                maxLength={50}
              />
              <Button type="submit" variant="outline">
                <Tag className="w-4 h-4 mr-2" />
                Add
              </Button>
            </form> */}
            <div
              onSubmit={handleAddNewTag}
              className="flex gap-2"
              role="form"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddNewTag(e);
              }}
            >
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a new tag"
                maxLength={50}
              />
              <Button type="button" variant="outline" onClick={handleAddNewTag}>
                <Tag className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>

            {/* Available Tags */}
            {availableTags.length > 0 && (
              <div>
                <Label className="text-sm text-muted-foreground">
                  Popular tags (click to add):
                </Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {availableTags
                    .filter((tag) => !formData.tags.includes(tag))
                    .slice(0, 10)
                    .map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => addTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Link href="/dashboard/forum">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create Post"}
          </Button>
        </div>
      </form>
    </div>
  );
}
