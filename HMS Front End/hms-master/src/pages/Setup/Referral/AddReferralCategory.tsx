import { faXmark, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import FormHeader from '../../../common/FormHeader/FormHeader';
import ErrorHandler from '../../../helpers/ErrorHandler';
import SetupApiService from '../../../helpers/services/setup/setup-api-service';

const AddReferralCategory = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const [categoryData, setCategoryData] = useState<any[]>([]);
    const [nameCategoryValidationError, setNameCategoryValidationError] = useState(false);
    const [modNoValidationError, setModNoValidationError] = useState(false);

    const addCategory = () => {
        setCategoryData([...categoryData, {
            name: '',
            // modNo: '',
        }])
    }

    const handleCategoryDataChange = (index: number, field: string, value: any) => {
        const newCategory = [...categoryData];
        newCategory[index] = {
            ...newCategory[index],
            [field]: value,
        }
        setCategoryData(newCategory);

        switch (field) {
            case 'name':
                setNameCategoryValidationError(!value);
                break;
            // case 'modNo':
            //     setModNoValidationError(!value);
            //     break;
            default:
                break;
        }
    }

    const removeCategory = (index: any) => {
        const newCategory = [...categoryData];
        newCategory.splice(index, 1);
        setCategoryData(newCategory);
    };

    const validateForm = () => {
        let isFormValid = true;

        const validationErrors = categoryData.map((item: any) => {
            const errors = {
                name: !item.name,
                // modNo: !item.modNo,
            };
            isFormValid = isFormValid && !Object.values(errors).includes(true);
            return errors;
        });

        setNameCategoryValidationError(validationErrors.some((error: any) => error.name));
        // setModNoValidationError(validationErrors.some((error: any) => error.modNo));

        return isFormValid;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            createReferralCategory();
        }
    }
    const createReferralCategory = async () => {
        try {
            const payload: any = categoryData;
            await setupApiService.createReferralCategory(payload);
            navigate('/main/referralMainSetup');
            toast.success('Referral Category Added Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        addCategory();
    }, []);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Add Referral Category" pageTitle="Setup" />
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
                                        {categoryData.map((item: any, index: any) => (
                                            <Row className='align-items-center'>
                                                <Col>
                                                    <FormGroup>
                                                        <Label for="name"> Name <span className='text-danger'>*</span> </Label>
                                                        <Input
                                                            className={`${nameCategoryValidationError && !item.name ? 'is-invalid' : ''}`}
                                                            type="text"
                                                            id="name"
                                                            value={item.name}
                                                            onChange={e => handleCategoryDataChange(index, 'name', e.target.value)}

                                                        />
                                                        {nameCategoryValidationError && !item.name && <div className="invalid-feedback">Item Category  Required</div>}
                                                    </FormGroup>
                                                </Col>
                                               
                                                {/* <Col>
                                                    <FormGroup>
                                                        <Label for="name">Version <span className='text-danger'> * </span></Label>
                                                        <Input
                                                            className={`${modNoValidationError && !item.modNo ? 'is-invalid' : ''}`}
                                                            type="text"
                                                            id="name"
                                                            value={index.modNo}
                                                            onChange={e => handleCategoryDataChange(index, 'modNo', e.target.value)}
                                                        />
                                                        {modNoValidationError && !item.modNo && (
                                                            <div className="invalid-feedback">Version Required</div>
                                                        )}
                                                    </FormGroup>
                                                </Col> */}
                                                {index !== 0 && (
                                                    <Col xs="auto pt-2">
                                                        <button onClick={() => removeCategory(index)} className="btn btn-soft-danger">
                                                            <FontAwesomeIcon
                                                                className="mx-2"
                                                                icon={faXmark}
                                                            />
                                                        </button>
                                                    </Col>
                                                )}
                                            </Row>
                                        ))}

                                        <Col className='text-start'>
                                            <Button
                                                color="primary"
                                                className="btn btn-primary mx-3 mb-3 add-bt"
                                                onClick={addCategory}><FontAwesomeIcon icon={faCirclePlus} />
                                                &nbsp;Add New</Button>
                                        </Col>

                                        <Col className='text-end'>
                                            <Button type="submit" color="primary">Submit</Button>
                                        </Col>
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

export default AddReferralCategory