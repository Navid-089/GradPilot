package com.gradpilot.repository;

import com.gradpilot.model.Post;
import com.gradpilot.model.Tag;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class PostRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private PostRepository postRepository;

    private Post testPost;
    private Tag testTag;

    @BeforeEach
    void setUp() {
        testTag = new Tag();
        testTag.setName("test-tag");
        entityManager.persistAndFlush(testTag);

        testPost = new Post();
        testPost.setTitle("Test Post");
        testPost.setContent("Test Content for searching");
        testPost.setUserId(1);
        testPost.setIsAnonymous(false);
        testPost.setCreatedAt(LocalDateTime.now());
        testPost.setUpdatedAt(LocalDateTime.now());

        Set<Tag> tags = new HashSet<>();
        tags.add(testTag);
        testPost.setTags(tags);
    }

    @Test
    void findAllByOrderByCreatedAtDesc_ShouldReturnPostsInDescendingOrder() {
        // Arrange
        Post post1 = createPost("First Post", LocalDateTime.now().minusHours(2));
        Post post2 = createPost("Second Post", LocalDateTime.now().minusHours(1));
        Post post3 = createPost("Third Post", LocalDateTime.now());

        entityManager.persistAndFlush(post1);
        entityManager.persistAndFlush(post2);
        entityManager.persistAndFlush(post3);

        Pageable pageable = PageRequest.of(0, 10);

        // Act
        Page<Post> result = postRepository.findAllByOrderByCreatedAtDesc(pageable);

        // Assert
        assertThat(result.getContent()).hasSize(3);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("Third Post");
        assertThat(result.getContent().get(1).getTitle()).isEqualTo("Second Post");
        assertThat(result.getContent().get(2).getTitle()).isEqualTo("First Post");
    }

    @Test
    void findByTitleOrMessageContainingIgnoreCase_ShouldReturnMatchingPosts() {
        // Arrange
        Post post1 = createPost("Java Programming", LocalDateTime.now().minusHours(1));
        Post post2 = createPost("Python Tutorial", LocalDateTime.now());
        Post post3 = createPost("Advanced Java", LocalDateTime.now().minusMinutes(30));

        entityManager.persistAndFlush(post1);
        entityManager.persistAndFlush(post2);
        entityManager.persistAndFlush(post3);

        Pageable pageable = PageRequest.of(0, 10);

        // Act
        Page<Post> result = postRepository.findByTitleOrMessageContainingIgnoreCase("java", pageable);

        // Assert
        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("Advanced Java");
        assertThat(result.getContent().get(1).getTitle()).isEqualTo("Java Programming");
    }

    @Test
    void findByTagName_ShouldReturnPostsWithSpecificTag() {
        // Arrange
        Tag javaTag = new Tag();
        javaTag.setName("java");
        entityManager.persistAndFlush(javaTag);

        Tag pythonTag = new Tag();
        pythonTag.setName("python");
        entityManager.persistAndFlush(pythonTag);

        Post javaPost = createPost("Java Post", LocalDateTime.now());
        Set<Tag> javaTags = new HashSet<>();
        javaTags.add(javaTag);
        javaPost.setTags(javaTags);

        Post pythonPost = createPost("Python Post", LocalDateTime.now().minusHours(1));
        Set<Tag> pythonTags = new HashSet<>();
        pythonTags.add(pythonTag);
        pythonPost.setTags(pythonTags);

        entityManager.persistAndFlush(javaPost);
        entityManager.persistAndFlush(pythonPost);

        Pageable pageable = PageRequest.of(0, 10);

        // Act
        Page<Post> result = postRepository.findByTagName("java", pageable);

        // Assert
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("Java Post");
    }

    @Test
    void save_ShouldPersistPost() {
        // Act
        Post savedPost = postRepository.save(testPost);

        // Assert
        assertThat(savedPost.getId()).isNotNull();
        assertThat(savedPost.getTitle()).isEqualTo("Test Post");
        assertThat(savedPost.getContent()).isEqualTo("Test Content for searching");
        assertThat(savedPost.getUserId()).isEqualTo(1);
        assertThat(savedPost.getIsAnonymous()).isFalse();
    }

    @Test
    void findById_WhenPostExists_ShouldReturnPost() {
        // Arrange
        Post savedPost = entityManager.persistAndFlush(testPost);

        // Act
        Optional<Post> result = postRepository.findById(savedPost.getId());

        // Assert
        assertThat(result).isPresent();
        assertThat(result.get().getTitle()).isEqualTo("Test Post");
    }

    @Test
    void delete_ShouldRemovePost() {
        // Arrange
        Post savedPost = entityManager.persistAndFlush(testPost);
        Integer postId = savedPost.getId();

        // Act
        postRepository.delete(savedPost);
        entityManager.flush();

        // Assert
        Optional<Post> result = postRepository.findById(postId);
        assertThat(result).isEmpty();
    }

    private Post createPost(String title, LocalDateTime createdAt) {
        Post post = new Post();
        post.setTitle(title);
        post.setContent("Content for " + title);
        post.setUserId(1);
        post.setIsAnonymous(false);
        post.setCreatedAt(createdAt);
        post.setUpdatedAt(createdAt);
        return post;
    }
}
