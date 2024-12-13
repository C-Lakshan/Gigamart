package com.comrepublic.shopx.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationRequest {

    private String firstName;
    private String lastName;
    private String email;
    private CharSequence password;
    private String phoneNumber;

}
