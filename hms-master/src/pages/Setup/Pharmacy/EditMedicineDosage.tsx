import { useLocation, useNavigate } from "react-router-dom";
import SetupApiService from "../../../helpers/services/setup/setup-api-service";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ErrorHandler from "../../../helpers/ErrorHandler";
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import FormHeader from "../../../common/FormHeader/FormHeader";
import { IoArrowBack } from "react-icons/io5";

const EditMedicineDosage = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const { state } = useLocation();

    const data = state?.data;

    const [medicineCategoryData, setMedicineCategoryData] = useState([]);
    const [medicineCategory, setMedicineCategory] = useState('');
    const [medicineCategoryValidationError, setMedicineCategoryValidationError] = useState(false);
    const [dose, setDose] = useState('');
    const [doseValidationError, setDoseValidationError] = useState(false);
    const [unitData, setUnitData] = useState([]);
    const [unit, setUnit] = useState('');
    const [unitValidationError, setUnitValidationError] = useState(false);
    const [modNo, setModNo] = useState<any>('');
    const [modNoValidationError, setModNoValidationError] = useState(false);

    const handleMedicicneCategoryChange = (value: any) => {
        setMedicineCategory(value);
        setMedicineCategoryValidationError(false);
    }

    const handleDosageChange = (value: any) => {
        setDose(value);
        setDoseValidationError(false);
    }

    const handleUnitChange = (value: any) => {
        setUnit(value);
        setUnitValidationError(false);
    }

    const handleModNoChange = (value: any) => {
        setModNo(value);
        setModNoValidationError(false);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!medicineCategory) {
            setMedicineCategoryValidationError(true);
            isFormValid = false;
        }

        if (!dose) {
            setDoseValidationError(true);
            isFormValid = false;
        }

        if (!unit) {
            setUnitValidationError(true);
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
            createMedicineDosage();
        }
    }
    const createMedicineDosage = async () => {
        try {
            const payload: any = {
                // modNo: modNo,
                medicineCategory: medicineCategory,
                dose: dose,
                unit: unit,
            }
            await setupApiService.editMedicineDosage(data.id, payload);
            navigate('/main/pharmacyMainSetup');
            toast.success('Dosage Updated Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllMedicineCategory = async () => {
        try {
            let result = await setupApiService.getAllMedicineCategory();
            setMedicineCategoryData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllUnit = async () => {
        try {
            let result = await setupApiService.getAllUnit();
            setUnitData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllMedicineCategory();
        getAllUnit();
        if (state?.data) {
            // setModNo(data.modNo);
            setMedicineCategory(data.medicineCategory);
            setDose(data.dose);
            setUnit(data.unit);
        }
    }, [state?.data]);

    return (
        <Container fluid>
            <FormHeader title="Edit Medicine Dosage" pageTitle="Setup" />
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
                                            <Label for="medicineCategory">Medicine Category <span className='text-danger'> * </span></Label>
                                            <Input
                                                type="select"
                                                id="medicineCategory"
                                                value={medicineCategory}
                                                onChange={e => handleMedicicneCategoryChange(e.target.value)}
                                                invalid={!!medicineCategoryValidationError}
                                            >
                                                <option value="">Select Category</option>
                                                {medicineCategoryData.map((item: any, idx: any) => (
                                                    <option key={idx} value={item.categoryName}>{item.categoryName}</option>
                                                ))}
                                            </Input>
                                            {medicineCategoryValidationError && (
                                                <div className="invalid-feedback">Medicine Category Required</div>
                                            )}
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="dose">Dose <span className='text-danger'> * </span></Label>
                                            <Input
                                                type="text"
                                                id="dose"
                                                value={dose}
                                                onChange={e => handleDosageChange(e.target.value)}
                                                invalid={!!doseValidationError}
                                            />
                                            {doseValidationError && (
                                                <div className="invalid-feedback">Dose Required</div>
                                            )}
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="unit">Unit <span className='text-danger'> * </span></Label>
                                            <Input
                                                type="select"
                                                id="unit"
                                                value={unit}
                                                onChange={e => handleUnitChange(e.target.value)}
                                                invalid={!!unitValidationError}
                                            >
                                                <option value="">Select Unit</option>
                                                {unitData.map((item: any, idx: any) => (
                                                    <option key={idx} value={item.unitName}>{item.unitName}</option>
                                                ))}
                                            </Input>
                                            {unitValidationError && (
                                                <div className="invalid-feedback">Unit Required</div>
                                            )}
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

                                <Button type="submit" color="primary">
                                    Submit
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Container>
    );
};

export default EditMedicineDosage;