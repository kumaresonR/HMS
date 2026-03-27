package com.hms.services.opdmanagement.model;

import lombok.Data;

import java.util.List;

@Data
public class PaginatedResponse<T> {
    private List<T> content;
    private long totalRecords;
    private int page;
    private int size;
    private int totalPages;
    private T firstRecord;
    private T lastRecord;

    public PaginatedResponse(List<T> content, int page, int size, long totalRecords, int totalPages) {
        this.content = content;
        this.page = page;
        this.size = size;
        this.totalRecords = totalRecords;
        this.totalPages = totalPages;
        this.firstRecord = (content != null && !content.isEmpty()) ? content.get(0) : null;
        this.lastRecord = (content != null && !content.isEmpty()) ? content.get(content.size() - 1) : null;
    }
}

