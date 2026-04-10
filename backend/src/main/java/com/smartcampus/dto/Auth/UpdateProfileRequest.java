package com.smartcampus.dto.Auth;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String name;
    private String pictureUrl;
}
