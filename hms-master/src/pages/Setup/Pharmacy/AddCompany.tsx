import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Label, Input, Button, Form, FormGroup, Card, Col, Container, Row, CardBody } from 'reactstrap';
import FormHeader from '../../../common/FormHeader/FormHeader';
import ErrorHandler from '../../../helpers/ErrorHandler';
import { toast } from 'react-toastify';
import SetupApiService from '../../../helpers/services/setup/setup-api-service';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';

const AddCompany = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const [companyName, setCompanyName] = useState('');
    const [companyNameValidationError, setCompanyNameValidationError] = useState(false);
    const [companyLink, setCmpanyLink] = useState<any>('');
    const [companyLinkValidationError, setCmpanyLinkValidationError] = useState(false);

    const handleCompanyName = (value: any) => {
        setCompanyName(value);
        setCompanyNameValidationError(false);
    }

    const handleCompanyLinkChange = (value: any) => {
        setCmpanyLink(value);
        setCmpanyLinkValidationError(false);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!companyName) {
            setCompanyNameValidationError(true);
            isFormValid = false;
        }

        if (!companyLink) {
            setCmpanyLinkValidationError(true);
            isFormValid = false;
        }

        return isFormValid;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            createMedicineCompany();
        }
    }
    const createMedicineCompany = async () => {
        try {
            const payload: any = [{
                companyLink: companyLink,
                companyName: companyName,
            }]
            await setupApiService.createMedicineCompany(payload);
            navigate('/main/pharmacyMainSetup');
            toast.success('Company Details Added Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Add Company" pageTitle="Setup" />
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
                                            <Col md={6}>
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

export default AddCompany;
