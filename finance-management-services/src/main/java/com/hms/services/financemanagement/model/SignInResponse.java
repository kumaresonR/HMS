package com.hms.services.financemanagement.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@NoArgsConstructor
@AllArgsConstructor
public class SignInResponse {


    @JsonProperty("user_id")
    private String userId;
    @JsonProperty("department_id")
    private String departmentId;
    @JsonProperty("access_token")
    private String accessToken;
    @JsonProperty("refresh_token")
    private String refreshToken;
    @JsonProperty("expire_in")
    private Long expireIn;
    @JsonProperty("email_Id")
    private String emailId;
    @JsonProperty("redirect_uri")
    private String redirectUri;
    @JsonProperty("name")
    private String name;
    @JsonProperty("role")
    private String role;
    @JsonProperty("gender")
    private String gender;
    private RoleDto roleDto;


}


