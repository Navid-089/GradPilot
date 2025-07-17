package com.gradpilot.service;

import com.gradpilot.dto.*;
import com.gradpilot.model.*;
import com.gradpilot.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ForumServiceTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private TagRepository tagRepository;

    @Mock
    private LikeRepository likeRepository;

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ForumService forumService;

    private Post testPost;
    private Comment testComment;
    private Tag testTag;
    private CreatePostRequest createPostRequest;
    private CreateCommentRequest createCommentRequest;
    private LikeRequest likeRequest;

    @BeforeEach
    void setUp() {
        testPost = new Post();
        testPost.setId(1);
        testPost.setTitle("Test Post");
        testPost.setContent("Test Content");
        testPost.setUserId(1);
        testPost.setIsAnonymous(false);
        testPost.setCreatedAt(LocalDateTime.now());
        testPost.setUpdatedAt(LocalDateTime.now());

        testComment = new Comment();
        testComment.setId(1);
        testComment.setContent("Test Comment");
        testComment.setUserId(2);
        testComment.setIsAnonymous(false);
        testComment.setPost(testPost);
        testComment.setCreatedAt(LocalDateTime.now());

        testTag = new Tag();
        testTag.setId(1);
        testTag.setName("test-tag");

        createPostRequest = new CreatePostRequest();
        createPostRequest.setTitle("Test Post");
        createPostRequest.setContent("Test Content");
        createPostRequest.setIsAnonymous(false);
        createPostRequest.setTags(new HashSet<>(Arrays.asList("test-tag")));

        createCommentRequest = new CreateCommentRequest();
        createCommentRequest.setContent("Test Comment");
        createCommentRequest.setIsAnonymous(false);

        likeRequest = new LikeRequest();
        likeRequest.setIsLike(true);
    }

    @Test
    void createPost_ShouldSaveAndReturnPostResponse() {
        // Arrange
        when(tagRepository.findByName("test-tag")).thenReturn(Optional.of(testTag));
        when(postRepository.save(any(Post.class))).thenReturn(testPost);

        // Act
        PostResponse result = forumService.createPost(createPostRequest, 1);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo("Test Post");
        assertThat(result.getContent()).isEqualTo("Test Content");
        verify(postRepository).save(any(Post.class));
    }

    @Test
    void createPost_WithNewTag_ShouldCreateTagAndPost() {
        // Arrange
        when(tagRepository.findByName("new-tag")).thenReturn(Optional.empty());
        when(tagRepository.save(any(Tag.class))).thenReturn(testTag);
        when(postRepository.save(any(Post.class))).thenReturn(testPost);

        createPostRequest.setTags(new HashSet<>(Arrays.asList("new-tag")));

        // Act
        PostResponse result = forumService.createPost(createPostRequest, 1);

        // Assert
        assertThat(result).isNotNull();
        verify(tagRepository).save(any(Tag.class));
        verify(postRepository).save(any(Post.class));
    }

    @Test
    void createComment_WhenPostExists_ShouldSaveAndReturnCommentResponse() {
        // Arrange
        when(postRepository.findById(1)).thenReturn(Optional.of(testPost));
        when(commentRepository.save(any(Comment.class))).thenReturn(testComment);

        // Act
        CommentResponse result = forumService.createComment(1, createCommentRequest, 2);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getContent()).isEqualTo("Test Comment");
        verify(commentRepository).save(any(Comment.class));
    }

    @Test
    void createComment_WhenPostDoesNotExist_ShouldThrowException() {
        // Arrange
        when(postRepository.findById(1)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> forumService.createComment(1, createCommentRequest, 2))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Post not found");
    }

    @Test
    void togglePostLike_WhenNoExistingLike_ShouldCreateNewLike() {
        // Arrange
        when(postRepository.findById(1)).thenReturn(Optional.of(testPost));
        when(likeRepository.findByUserIdAndPostId(1, 1)).thenReturn(Optional.empty());

        // Act
        forumService.togglePostLike(1, likeRequest, 1);

        // Assert
        verify(likeRepository).save(any(Like.class));
        // verify(likeRepository, never()).delete(any(Like.class));
    }

    @Test
    void togglePostLike_WhenSameLikeExists_ShouldDeleteLike() {
        // Arrange
        Like existingLike = new Like();
        existingLike.setId(1);
        existingLike.setUserId(1);
        existingLike.setPost(testPost);
        existingLike.setIsLike(true);

        when(postRepository.findById(1)).thenReturn(Optional.of(testPost));
        when(likeRepository.findByUserIdAndPostId(1, 1)).thenReturn(Optional.of(existingLike));

        // Act
        forumService.togglePostLike(1, likeRequest, 1);

        // Assert
        verify(likeRepository).delete(existingLike);
        verify(likeRepository, never()).save(any(Like.class));
    }

    @Test
    void togglePostLike_WhenDifferentLikeExists_ShouldUpdateLike() {
        // Arrange
        Like existingLike = new Like();
        existingLike.setId(1);
        existingLike.setUserId(1);
        existingLike.setPost(testPost);
        existingLike.setIsLike(false); // Opposite of request

        when(postRepository.findById(1)).thenReturn(Optional.of(testPost));
        when(likeRepository.findByUserIdAndPostId(1, 1)).thenReturn(Optional.of(existingLike));

        // Act
        forumService.togglePostLike(1, likeRequest, 1);

        // Assert
        verify(likeRepository).save(existingLike);
        assertThat(existingLike.getIsLike()).isTrue();
    }


    @Test
    void getAllTags_ShouldReturnListOfTagNames() {
        // Arrange
        List<Tag> tags = Arrays.asList(testTag);
        when(tagRepository.findAll()).thenReturn(tags);

        // Act
        List<String> result = forumService.getAllTags();

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0)).isEqualTo("test-tag");
        verify(tagRepository).findAll();
    }
}
