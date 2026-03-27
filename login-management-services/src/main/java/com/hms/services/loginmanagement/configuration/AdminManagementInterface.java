package com.hms.services.loginmanagement.configuration;



import com.hms.services.loginmanagement.model.RoleDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

//@FeignClient(name="admin-management-services")
@FeignClient(name="admin-management-services")
public interface AdminManagementInterface {
    @GetMapping("/roles/{roleId}")
    public ResponseEntity<RoleDto> getRole(@PathVariable String roleId);

}

