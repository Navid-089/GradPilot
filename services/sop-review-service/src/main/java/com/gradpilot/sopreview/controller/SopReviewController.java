package com.gradpilot.sopreview.controller;

import com.gradpilot.sopreview.dto.ReviewRequest;
import com.gradpilot.sopreview.dto.ReviewResponse;
import com.gradpilot.sopreview.service.SopReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/sop")
@CrossOrigin(origins = "*")
public class SopReviewController {

    private final SopReviewService sopReviewService;

    public SopReviewController(SopReviewService sopReviewService) {
        this.sopReviewService = sopReviewService;
    }

    @PostMapping("/review")
    public ResponseEntity<ReviewResponse> reviewSop(@RequestBody ReviewRequest request) {
        String feedback = sopReviewService.getSopFeedback(request.sopText());
        return ResponseEntity.ok(new ReviewResponse(feedback));
    }
}