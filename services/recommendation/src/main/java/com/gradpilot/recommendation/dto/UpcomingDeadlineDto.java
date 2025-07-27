package com.gradpilot.recommendation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UpcomingDeadlineDto {
    private String title;
    private String institution;
    private String date;     // Format: YYYY-MM-DD
    private int daysLeft;
}


