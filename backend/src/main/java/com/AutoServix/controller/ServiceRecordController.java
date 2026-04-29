package com.AutoServix.controller;

import com.AutoServix.models.ServiceRecord;
import com.AutoServix.service.ServiceRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/services")
public class ServiceRecordController {

    @Autowired
    private ServiceRecordService serviceRecordService;

    @GetMapping("/history")
    public ResponseEntity<List<ServiceRecord>> getMyServiceHistory(Authentication auth) {
        return ResponseEntity.ok(serviceRecordService.getCustomerServiceHistory(auth.getName()));
    }

    @PatchMapping("/{id}/rate")
    public ResponseEntity<ServiceRecord> rateService(
            @PathVariable Integer id,
            @RequestBody Map<String, Integer> body) {
        Integer rating = body.get("rating");
        return ResponseEntity.ok(serviceRecordService.rateServiceRecord(id, rating));
    }
}
