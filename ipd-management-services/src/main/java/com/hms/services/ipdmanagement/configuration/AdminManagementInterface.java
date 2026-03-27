package com.hms.services.ipdmanagement.configuration;


import com.hms.services.ipdmanagement.model.EmployeeDetails;
import com.hms.services.ipdmanagement.model.IPDCombinedDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name="admin-management-services")
//@FeignClient(name="admin-management-services",url = "${admin-management-services.url}")
public interface AdminManagementInterface {
    @GetMapping("/employees/{id}")
    public ResponseEntity<EmployeeDetails> getEmployeeById(@PathVariable String id);
    @PostMapping("/bed-details/{bedDetailsId}")
    public void getUpdateRoomEntries(
            @PathVariable("bedDetailsId") String id,
            @RequestParam("status") boolean status);
    @GetMapping("/bed-details/room_details/{bedDetailsId}")
    public ResponseEntity<IPDCombinedDTO.BedDetailsDTO> getAllRoomEntries(@PathVariable ("bedDetailsId") String id);
    @GetMapping("/charges/master-table/{chargeId}")
    public ResponseEntity<IPDCombinedDTO.CombinedCharges> getAllByChargeId(@PathVariable("chargeId") String chargeId, @RequestParam(value = "insuranceId", required = false) String insuranceId);
}

