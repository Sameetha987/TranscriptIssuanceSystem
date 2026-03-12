package com.academic.TranscriptSystem.controller;

import com.academic.TranscriptSystem.entity.ActivityLog;
import com.academic.TranscriptSystem.service.ActivityLogService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/activity")
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    public ActivityLogController(ActivityLogService activityLogService) {
        this.activityLogService = activityLogService;
    }

    @GetMapping
    public List<ActivityLog> getRecentActivities() {
        return activityLogService.getRecentActivities();
    }
}