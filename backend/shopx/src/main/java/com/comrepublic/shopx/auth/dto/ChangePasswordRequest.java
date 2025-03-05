package com.comrepublic.shopx.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ChangePasswordRequest {
    private String email;
    private String oldPassword;
    private String newPassword;
}
