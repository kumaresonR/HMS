import { useLocation, useNavigate } from "react-router-dom";
import SetupApiService from "../../../helpers/services/setup/setup-api-service";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ErrorHandler from "../../../helpers/ErrorHandler";
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import React from "react";
import { IoArrowBack } from "react-icons/io5";
import FormHeader from "../../../common/FormHeader/FormHeader";
import AppointmentApiService from "../../../helpers/services/appointment/appointment-api-service";
import { AsyncTypeahead } from "react-bootstrap-typeahead";

const EditDepartment = () => {
    const setupApiService: SetupApiService = new SetupApiService();
    const appointmentApiServic: AppointmentApiService = new AppointmentApiService();

    let navigate: any = useNavigate();

    const { state } = useLocation();

    const data = state?.data;

    const [name, setName] = useState('');
    const [nameValidationError, setNameValidationError] = useState(false);
    const [modNo, setModNo] = useState<any>('');
    const [modNoValidationError, setModNoValidationError] = useState(false);
    const [options, setOptions] = useState<[]>([]);
    const [staff, setStaff] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleNameChange = (value: any) => {
        setName(value);
        setNameValidationError(false);
    }

    const handleModNoChange = (value: any) => {
        setModNo(value);
        setModNoValidationError(false);
    }

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
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!name) {
            setNameValidationError(true);
            isFormValid = false;
        }

        // if (!modNo) {
        //     setModNoValidationError(true);
        //     isFormValid = false;
        // }

        return isFormValid;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            editDepartment();
        }
    }
    const editDepartment = async () => {
        try {
            const payload: any = {
                // employeeId: staff,
                name: name,
            }
            await setupApiService.editDepartment(data.departmentId, payload);
            navigate('/main/humanResourceMainSetup');
            toast.success('Department Updated Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        if (state?.data) {
            setName(data.name);
        }
    }, [state?.data]);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Edit Department" pageTitle="Setup" />
                    <Card>
                        <CardBody>
                            <div className='text-end'>
                                <Button
                                    color="primary"
                                    onClick={() => navigate(-1)}
                                    className="btn btn-primary add-btn mx-2"
                                >
                                    <IoArrowBack /> Back
                                </Button>
                            </div>
                            <Row className="d-flex justify-content-center">
                                <Col xl={12}>
                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col>
                                                <FormGroup>
                                                    <Label for="departmentName">Department Name <span className='text-danger'> * </span></Label>
                                                    <Input
                                                        type="text"
                                                        id="name"
                                                        value={name}
                                                        onChange={e => handleNameChange(e.target.value)}
                                                        invalid={!!nameValidationError}
                                                    />
                                                    {nameValidationError && (
                                                        <div className="invalid-feedback">Department Name Required</div>
                                                    )}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Button type="submit" color="primary">Submit</Button>
                                    </Form>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default EditDepartment