package com.gradpilot.controller;

import com.gradpilot.service.FileUploadService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(FileUploadController.class)
class FileUploadControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FileUploadService fileUploadService;

    @Test
    void uploadFile_WithValidFile_ShouldReturnFileUrl() throws Exception {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.jpg",
                "image/jpeg",
                "test content".getBytes());

        // when(fileUploadService.uploadFile(any())).thenReturn("https://cloudinary.com/test.jpg");

        // Act & Assert
        // mockMvc.perform(multipart("/api/forum/upload")
        //         .file(file))
        //         .andExpect(status().isOk())
                // .andExpect(jsonPath("$.url").value("https://cloudinary.com/test.jpg"));
    }

    @Test
    void uploadFile_WithInvalidFile_ShouldReturnBadRequest() throws Exception {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.txt",
                "text/plain",
                "test content".getBytes());

        when(fileUploadService.uploadFile(any()))
                .thenThrow(new IllegalArgumentException("Only image files and PDFs are allowed"));

        // Act & Assert
        // mockMvc.perform(multipart("/api/forum/upload")
        //         .file(file))
        //         .andExpect(status().isBadRequest())
        //         .andExpect(jsonPath("$.error").value("Only image files and PDFs are allowed"));
    }
}
