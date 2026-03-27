import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import SetupApiService from "../../../helpers/services/setup/setup-api-service";
import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FormHeader from "../../../common/FormHeader/FormHeader";
import ErrorHandler from "../../../helpers/ErrorHandler";

const EditCompany = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();
    const { state } = useLocation();

    const data = state?.data;
    const [companyName, setCompanyName] = useState('');
    const [companyNameValidationError, setCompanyNameValidationError] = useState(false);
    const [companyLink, setCompanyLink] = useState<any>('');
    const [companyLinkValidationError, setCompanyLinkValidationError] = useState(false);

    const handleCompanyName = (value: any) => {
        setCompanyName(value);
        setCompanyNameValidationError(false);
    }

    const handleCompanyLinkChange = (value: any) => {
        setCompanyLink(value);
        setCompanyLinkValidationError(false);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!companyName) {
            setCompanyNameValidationError(true);
            isFormValid = false;
        }

        if (!companyLink) {
            setCompanyLinkValidationError(true);
            isFormValid = false;
        }

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
                companyLink: companyLink,
                companyName: companyName,
            }
            await setupApiService.editMedicineCompany(data.id, payload);
            navigate('/main/pharmacyMainSetup');
            toast.success('Company Details Updated Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        if (state?.data) {
            setCompanyLink(data.companyLink);
            setCompanyName(data.companyName);
        }
    }, [state?.data]);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Edit Company" pageTitle="Setup" />
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
                                                    <Label for="CompanyName">Company Name <span className='text-danger'> * </span></Label>
                                                    <Input
                                                        type="text"
                                                        id="CompanyName"
                                                        value={companyName}
                                                        onChange={e => handleCompanyName(e.target.value)}
                                                        invalid={!!companyNameValidationError}
                                                    />
                                                    {companyNameValidationError && <div className="invalid-feedback">Company Name Required</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col>
                                                <FormGroup>
                                                    <Label for="company-link">Company Link <span className='text-danger'> * </span></Label>
                                                    <Input
                                                        type="url"
                                                        id="company-link"
                                                        value={companyLink}
                                                        onChange={e => handleCompanyLinkChange(e.target.value)}
                                                        invalid={!!companyLinkValidationError}
                                                    />
                                                    {companyLinkValidationError && (
                                                        <div className="invalid-feedback">Company Link Required</div>
                                                    )}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Button type="submit" color="primary">Update Company</Button>
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

export default EditCompany;