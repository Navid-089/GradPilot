package com.gradpilot.service;

import com.gradpilot.dto.*;
import com.gradpilot.model.*;
import com.gradpilot.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ForumService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    // Create a new post
    public PostResponse createPost(CreatePostRequest request, Integer userId) {
        Post post = new Post();
        post.setUserId(userId);
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setIsAnonymous(request.getIsAnonymous());
        post.setFileUrl(request.getFileUrl());

        // Handle tags
        if (request.getTags() != null && !request.getTags().isEmpty()) {
            Set<Tag> tags = new HashSet<>();
            for (String tagName : request.getTags()) {
                Tag tag = tagRepository.findByName(tagName.toLowerCase())
                        .orElseGet(() -> {
                            Tag newTag = new Tag(tagName.toLowerCase());
                            return tagRepository.save(newTag);
                        });
                tags.add(tag);
            }
            post.setTags(tags);
        }

        post = postRepository.save(post);
        return convertToPostResponse(post, userId);
    }

    // Get posts with pagination and filtering
    public Page<PostResponse> getPosts(int page, int size, String tag, String title, Integer userId) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts;

        if (tag != null && !tag.isEmpty()) {
            posts = postRepository.findByTagName(tag.toLowerCase(), pageable);
        } else if (title != null && !title.isEmpty()) {
            // posts = postRepository.findByTitleContainingIgnoreCase(title, pageable);
            posts = postRepository.findByTitleOrMessageContainingIgnoreCase(title.toLowerCase(), pageable);
        } else {
            posts = postRepository.findAllByOrderByCreatedAtDesc(pageable);
        }

        return posts.map(post -> convertToPostResponse(post, userId));
    }

    // Get single post with comments
    public PostDetailResponse getPostDetails(Integer postId, Integer userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtAsc(postId);

        PostResponse postResponse = convertToPostResponse(post, userId);
        List<CommentResponse> commentResponses = comments.stream()
                .map(comment -> convertToCommentResponse(comment, userId))
                .collect(Collectors.toList());

        return new PostDetailResponse(postResponse, commentResponses);
    }

    // Create a comment
    public CommentResponse createComment(Integer postId, CreateCommentRequest request, Integer userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUserId(userId);
        comment.setContent(request.getContent());
        comment.setIsAnonymous(request.getIsAnonymous());

        comment = commentRepository.save(comment);

        // Create notification for post author if not anonymous
        if (!post.getUserId().equals(userId)) {
            createNotification(post.getUserId(), "comment",
                    "Someone commented on your post", postId);
        }

        return convertToCommentResponse(comment, userId);
    }

    // Like/Unlike a post
    public void togglePostLike(Integer postId, LikeRequest request, Integer userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Optional<Like> existingLike = likeRepository.findByUserIdAndPostId(userId, postId);

        if (existingLike.isPresent()) {
            Like like = existingLike.get();
            if (like.getIsLike().equals(request.getIsLike())) {
                // Same type of reaction, remove it
                likeRepository.delete(like);
            } else {
                // Different reaction, update it
                like.setIsLike(request.getIsLike());
                likeRepository.save(like);
            }
        } else {
            // New reaction
            Like like = new Like(userId, post, request.getIsLike());
            likeRepository.save(like);

            // Create notification for post author
            if (!post.getUserId().equals(userId)) {
                String message = request.getIsLike() ? "Someone liked your post" : "Someone disliked your post";
                createNotification(post.getUserId(), "like", message, postId);
            }
        }
    }

    // Like/Unlike a comment
    public void toggleCommentLike(Integer commentId, LikeRequest request, Integer userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        Optional<Like> existingLike = likeRepository.findByUserIdAndCommentId(userId, commentId);

        if (existingLike.isPresent()) {
            Like like = existingLike.get();
            if (like.getIsLike().equals(request.getIsLike())) {
                // Same type of reaction, remove it
                likeRepository.delete(like);
            } else {
                // Different reaction, update it
                like.setIsLike(request.getIsLike());
                likeRepository.save(like);
            }
        } else {
            // New reaction
            Like like = new Like(userId, comment, request.getIsLike());
            likeRepository.save(like);

            // Create notification for comment author
            if (!comment.getUserId().equals(userId)) {
                String message = request.getIsLike() ? "Someone liked your comment" : "Someone disliked your comment";
                createNotification(comment.getUserId(), "like", message, comment.getPost().getId());
            }
        }
    }

    // Get all available tags
    public List<String> getAllTags() {
        return tagRepository.findAll().stream()
                .map(Tag::getName)
                .sorted()
                .collect(Collectors.toList());
    }

    // Helper methods
    // private PostResponse convertToPostResponse(Post post, Integer currentUserId)
    // {
    // PostResponse response = new PostResponse();
    // response.setId(post.getId());
    // response.setTitle(post.getTitle());
    // response.setContent(post.getContent());
    // response.setFileUrl(post.getFileUrl());
    // response.setCreatedAt(post.getCreatedAt());
    // response.setUpdatedAt(post.getUpdatedAt());

    // String authorName = userRepository.findById(post.getUserId())
    // .map(user -> user.getName())
    // .orElse("Unknown User");

    // // Handle anonymous posts
    // response.setAuthorName(post.getIsAnonymous() ? "Anonymous" : authorName);

    // // Set tags
    // if (post.getTags() != null) {
    // response.setTags(post.getTags().stream()
    // .map(Tag::getName)
    // .collect(Collectors.toSet()));
    // }

    // // Set like/dislike counts
    // response.setLikeCount(likeRepository.countLikesByPostId(post.getId()));
    // response.setDislikeCount(likeRepository.countDislikesByPostId(post.getId()));

    // // Set comment count
    // response.setCommentCount(post.getComments() != null ?
    // post.getComments().size() : 0);

    // // Set user interaction status
    // if (currentUserId != null) {
    // likeRepository.findByUserIdAndPostId(currentUserId, post.getId())
    // .ifPresent(like -> {
    // response.setUserLiked(like.getIsLike());
    // response.setUserDisliked(!like.getIsLike());
    // });
    // }

    // return response;
    // }

    private PostResponse convertToPostResponse(Post post, Integer currentUserId) {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setTitle(post.getTitle());
        response.setContent(post.getContent());
        response.setFileUrl(post.getFileUrl());
        response.setCreatedAt(post.getCreatedAt());
        response.setUpdatedAt(post.getUpdatedAt());
        response.setUserId(post.getUserId());
        response.setIsAnonymous(post.getIsAnonymous());

        String authorName = "Unknown User";
        try {
            if (post.getUserId() != null) {
                authorName = userRepository.findById(post.getUserId())
                        .map(user -> user.getName())
                        .orElse("Unknown User");
            }
        } catch (Exception e) {
            // Log the error if you have a logger, e.g.
            // logger.error("Error fetching author name for post " + post.getId(), e);
            authorName = "Unknown User";
        }

        // Handle anonymous posts
        response.setAuthorName(authorName);

        // Set tags
        if (post.getTags() != null) {
            response.setTags(post.getTags().stream()
                    .map(Tag::getName)
                    .collect(Collectors.toSet()));
        }

        // Set like/dislike counts
        response.setLikeCount(likeRepository.countLikesByPostId(post.getId()));
        response.setDislikeCount(likeRepository.countDislikesByPostId(post.getId()));

        // Set comment count
        response.setCommentCount(post.getComments() != null ? post.getComments().size() : 0);

        // Set user interaction status
        if (currentUserId != null) {
            likeRepository.findByUserIdAndPostId(currentUserId, post.getId())
                    .ifPresent(like -> {
                        response.setUserLiked(like.getIsLike());
                        response.setUserDisliked(!like.getIsLike());
                    });
        }

        return response;
    }

    // private CommentResponse convertToCommentResponse(Comment comment, Integer
    // currentUserId) {
    // CommentResponse response = new CommentResponse();
    // response.setId(comment.getId());
    // response.setContent(comment.getContent());
    // response.setCreatedAt(comment.getCreatedAt());

    // // Handle anonymous comments
    // response.setAuthorName(comment.getIsAnonymous() ? "Anonymous" : "User"); //
    // You might want to fetch actual user
    // // names

    // // Set like/dislike counts
    // response.setLikeCount(likeRepository.countLikesByCommentId(comment.getId()));
    // response.setDislikeCount(likeRepository.countDislikesByCommentId(comment.getId()));

    // // Set user interaction status
    // if (currentUserId != null) {
    // likeRepository.findByUserIdAndCommentId(currentUserId, comment.getId())
    // .ifPresent(like -> {
    // response.setUserLiked(like.getIsLike());
    // response.setUserDisliked(!like.getIsLike());
    // });
    // }

    // return response;
    // }

    private CommentResponse convertToCommentResponse(Comment comment, Integer currentUserId) {
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setContent(comment.getContent());
        response.setCreatedAt(comment.getCreatedAt());
        response.setUserId(comment.getUserId());
        response.setIsAnonymous(comment.getIsAnonymous());

        String authorName = "Unknown User";
        try {
            if (comment.getUserId() != null) {
                authorName = userRepository.findById(comment.getUserId())
                        .map(user -> user.getName())
                        .orElse("Unknown User");
            }
        } catch (Exception e) {
            // Optionally log the error here
            authorName = "Unknown User";
        }
        response.setAuthorName(authorName);

        // Set like/dislike counts
        response.setLikeCount(likeRepository.countLikesByCommentId(comment.getId()));
        response.setDislikeCount(likeRepository.countDislikesByCommentId(comment.getId()));

        // Set user interaction status
        if (currentUserId != null) {
            likeRepository.findByUserIdAndCommentId(currentUserId, comment.getId())
                    .ifPresent(like -> {
                        response.setUserLiked(like.getIsLike());
                        response.setUserDisliked(!like.getIsLike());
                    });
        }

        return response;
    }

    private void createNotification(Integer userId, String type, String message, Integer sourceId) {
        Notification notification = new Notification(userId, type, message, sourceId);
        notificationRepository.save(notification);
    }

    public void deletePost(Integer postId) {
        if (!postRepository.existsById(postId)) {
            // throw new ResourceNotFoundException("Post not found with id " + postId);
            throw new RuntimeException("Post not found with id " + postId);
        }
        postRepository.deleteById(postId);
    }

    public void deleteComment(Integer commentId) {
        if (!commentRepository.existsById(commentId)) {
            // throw new ResourceNotFoundException("Comment not found with id " +
            // commentId);
            throw new RuntimeException("Comment not found with id " + commentId);
        }
        commentRepository.deleteById(commentId);
    }
}
