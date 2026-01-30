import { useLocation, useNavigate } from "react-router-dom";
import SetupApiService from "../../../helpers/services/setup/setup-api-service";
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import React, { useState, useEffect } from "react";
import { IoArrowBack } from "react-icons/io5";
import { toast } from "react-toastify";
import FormHeader from "../../../common/FormHeader/FormHeader";
import ErrorHandler from "../../../helpers/ErrorHandler";

const EditMedicineGroup = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();
    const { state } = useLocation();

    const data = state?.data;
    const [medicineGroup, setMedicineGroup] = useState('');
    const [medicineGroupNameValidationError, setMedicineGroupNameValidationError] = useState(false);
    const [modNo, setModNo] = useState<any>('');
    const [modNoValidationError, setModNoValidationError] = useState(false);

    const handlesetMedicineGroup = (value: any) => {
        setMedicineGroup(value);
        setMedicineGroupNameValidationError(false);
    }

    const handleModNoChange = (value: any) => {
        setModNo(value);
        setModNoValidationError(false);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!medicineGroup) {
            setMedicineGroupNameValidationError(true);
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
            editMedicineCompany();
        }
    }
    const editMedicineCompany = async () => {
        try {
            const payload: any = {
                // modNo: modNo,
                medicineGroupName: medicineGroup,
            }
            await setupApiService.editMedicineGroup(data.id, payload);
            navigate('/main/pharmacyMainSetup');
            toast.success('Medicine Group Details Updated Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        if (state?.data) {
            // setModNo(data.modNo);
            setMedicineGroup(data.medicineGroupName);
        }
    }, [state?.data]);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Edit Medicine Group" pageTitle="Setup" />
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
                                                    <Label for="medicineGroupName">Group Name <span className='text-danger'> * </span></Label>
                                                    <Input
                                                        type="text"
                                                        id="medicineGroupName"
                                                        value={medicineGroup}
                                                        onChange={e => handlesetMedicineGroup(e.target.value)}
                                                        invalid={!!medicineGroupNameValidationError}
                                                    />
                                                    {medicineGroupNameValidationError && <div className="invalid-feedback">Group Name Required</div>}
                                                </FormGroup>
                                            </Col>
                                            {/* <Col>
                                                <FormGroup>
                                                    <Label for="name">Version <span className='text-danger'> * </span></Label>
                                                    <Input
                                                        type="text"
                                                        id="name"
                                                        value={modNo}
                                                        onChange={e => handleModNoChange(e.target.value)}
                                                        invalid={!!modNoValidationError}
                                                    />
                                                    {modNoValidationError && (
                                                        <div className="invalid-feedback">Version Required</div>
                                                    )}
                                                </FormGroup>
                                            </Col> */}
                                        </Row>

                                        <Button type="submit" color="primary">Update Medicine Group</Button>
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

export default EditMedicineGroup;