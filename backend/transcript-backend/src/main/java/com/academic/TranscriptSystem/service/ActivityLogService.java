package com.academic.TranscriptSystem.service;

import com.academic.TranscriptSystem.entity.ActivityLog;
import com.academic.TranscriptSystem.repository.ActivityLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    public ActivityLogService(ActivityLogRepository activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
    }

    public void log(String action, Long transcriptId, String description) {

        ActivityLog log = new ActivityLog(action, transcriptId, description);

        activityLogRepository.save(log);
    }

    public List<ActivityLog> getRecentActivities() {
        return activityLogRepository.findTop10ByOrderByTimestampDesc();
    }
}