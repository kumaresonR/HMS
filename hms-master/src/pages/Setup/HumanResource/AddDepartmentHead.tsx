import { useState } from "react";
import AppointmentApiService from "../../../helpers/services/appointment/appointment-api-service";
import ErrorHandler from "../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { Button, Col, Container, Form, FormGroup, Row } from "reactstrap";
import SetupApiService from "../../../helpers/services/setup/setup-api-service";

const AddDepartmentHead = (props: any) => {
    const appointmentApiServic: AppointmentApiService = new AppointmentApiService();
    const setupApiService: SetupApiService = new SetupApiService();

    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<[]>([]);
    const [staff, setStaff] = useState('');
    const [staffValidationError, setStaffValidationError] = useState(false);

    const onSearch = async (query: any) => {
        setIsLoading(true);
        try {
            let url = "department=&searchTerm=" + query
            let result = await appointmentApiServic.searchAllEmployee(url);
            setOptions(result)
        } catch (error: any) {
            return ErrorHandler(error);
        } finally {
            setIsLoading(false);
        }
    }

    const onSelectedStaff = (selectedItem: any) => {
        const staffId = selectedItem?.[0]?.['employeeId'];
        setStaff(staffId);
        setStaffValidationError(false);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!staff) {
            setStaffValidationError(true);
            isFormValid = false;
        }

        return isFormValid;

    }

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }
        try {
            const payload: any = {
                employeeId: staff,
                name: props.data.name,
            }
            await setupApiService.editDepartment(props.data.departmentId, payload);
            toast.success('Department Head Added Successfully', { containerId: 'TR' });
            props.handleClose();
        } catch (error: any) {
            return ErrorHandler(error);
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Container fluid>
                <Row className="align-items-center">
                    <Col>
                        <FormGroup>
                            <label className="text-start mb-2">Department Head  <span className="text-danger">*</span></label>
                            <AsyncTypeahead
                                filterBy={() => true}
                                id="patient-id-search-box"
                                className={` ${staffValidationError ? 'is-invalid' : ''}`}
                                isLoading={isLoading}
                                labelKey="fullName"
                                minLength={1}
                                options={options}
                                onSearch={onSearch}
                                onChange={onSelectedStaff}
                                placeholder="Search by Staff Name or Id"
                            />
                            {staffValidationError && <div className="invalid-feedback">Department Head Required.</div>}
                        </FormGroup>
                    </Col>
                    <Col xs="auto">
                        <Button type="submit" color="primary">Submit</Button>
                    </Col>
                </Row>
            </Container>
        </Form>
    )
}

export default AddDepartmentHead