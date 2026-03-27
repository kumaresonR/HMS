import { Button, Col, Container, Form, FormGroup, Input, Modal, ModalBody, ModalHeader, Row } from "reactstrap"
import { useEffect, useState } from "react";
import ErrorHandler from "../../../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import OPDApiService from "../../../../../helpers/services/opd/opd-api-service";
import { medicineData } from "../../../../../common/data/IpdData";
import IPDApiService from "../../../../../helpers/services/ipd/ipd-api-service";
import SetupApiService from "../../../../../helpers/services/setup/setup-api-service";
import PharmacyApiService from "../../../../../helpers/services/pharmacy/pharmacy-api-service";

const AddMedication = (props: any) => {
    const opdApiService: OPDApiService = new OPDApiService();
    const iPDApiService: IPDApiService = new IPDApiService();
    const setupApiService: SetupApiService = new SetupApiService();
    const pharmacyApiService: PharmacyApiService = new PharmacyApiService();

    const [note, setNote] = useState('');
    const [time, setTime] = useState('');
    const [timeValidationError, setTimeValidationError] = useState(false);
    const [medicineCategory, setMedicineCategory] = useState('');
    const [medicineCategoryValidationError, setMedicineCategoryValidationError] = useState(false);
    const [medicineName, setMedicineName] = useState('');
    const [medicineNameValidationError, setMedicineNameValidationError] = useState(false);
    const [date, setDate] = useState(props.date);
    const [dateValidationError, setDateValidationError] = useState(false);
    const [dosage, setDosage] = useState('');
    const [dosageValidationError, setDosageValidationError] = useState(false);
    const [remarks, setRemarks] = useState('');
    const [dosageData, setDosageData] = useState<any>([]);
    const [selectedCategory, setSelectedCategory] = useState<any>([])
    const [medicineCategoryData, setMedicineCategoryData] = useState([]);
    const [medicineDosageData, setMedicineDosageData] = useState([]);
    const [medicineStockData, setMedicineStockData] = useState<any>([]);

    const handleDateChange = (value: any) => {
        setDate(value);
        setDateValidationError(false);
    }

    const handleTimeChange = (value: any) => {
        setTime(value);
        setTimeValidationError(false);
    }

    const handleMedicineCategoryChange = (value: any) => {
        setMedicineCategory(value);
        setMedicineCategoryValidationError(false);
        setMedicineName('');
        setDosage('');
        // const categoryData = medicineStockData.find((data: any) => data.category === value);
        // setSelectedCategory(categoryData || []);
        // const dosageData = medicineDosageData.find((data: any) => data.medicineCategory === value);
        // setDosageData(dosageData || []);
    }

    const handleMedicineNameChange = (name: string) => {
        setMedicineName(name);
        setMedicineNameValidationError(false);
        setDosage('');
    };

    const handleDosageChange = (value: any) => {
        setDosage(value);
        setDosageValidationError(false);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!date) {
            setDateValidationError(true);
            isFormValid = false;
        }

        if (!time) {
            setTimeValidationError(true);
            isFormValid = false;
        }

        if (!medicineCategory) {
            setMedicineCategoryValidationError(true);
            isFormValid = false;
        }

        if (!medicineName) {
            setMedicineNameValidationError(true);
            isFormValid = false;
        }

        if (!dosage) {
            setDosageValidationError(true);
            isFormValid = false;
        }

        return isFormValid;
    }
    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            doCreateMedication();
        }
    };

    const doCreateMedication = async () => {
        try {
            let payload: any = {
                medicineId: '',
                medicineName: medicineName,
                medicineCategory: medicineCategory,
                date: date,
                dosage: [
                    {
                        dosage: dosage,
                        remarks: remarks || 'NA',
                        dosageTime: time
                    }
                ],
                // date : date,
                // time : time
            };
            if (props.title === 'ipd') {
                payload.ipdId = props?.data?.admissions?.ipdId;
            } else {
                payload.opdId = props?.data?.admissions?.opdId;
            }

            if (props.title === 'ipd') {
                await iPDApiService.createMedication(payload);
            } else {
                await opdApiService.createMedication(payload);
            }
            toast.success('Medication Added Successfully', { containerId: 'TR' });
            props.refresh();
            props.handleClose();
        } catch (error: any) {
            console.log("Medication Added Failed", error);
            return ErrorHandler(error)
        }
    }

    const getAllMedicineCategory = async () => {
        try {
            let data = await setupApiService.getAllMedicineCategory();
            setMedicineCategoryData(data);
        } catch (error) {
            console.log(error);
        }
    }

    const getAllMedicineDosage = async () => {
        try {
            let data = await setupApiService.getAllMedicineDosage();
            setMedicineDosageData(data);
        } catch (error) {
            console.log(error);
        }
    }

    const getAllMedicineStock = async () => {
        try {
            let url = "all"
            let result = await pharmacyApiService.getAllMedicineStock(url);
            console.log("getAllMedicineStock", result);
            setMedicineStockData(result);
        } catch (error: any) {
            console.log("getAllMedicineStock Error");
            console.log(error);
        }
    }

    useEffect(() => {
        getAllMedicineCategory();
        getAllMedicineDosage();
        getAllMedicineStock();
    }, []);

    return <>
        <Container fluid>
            <Row>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <label className="text-start mb-2">Date <span className="text-danger">*</span></label>
                                <Input className={` ${dateValidationError ? 'is-invalid' : ''}`}
                                    id="date"
                                    name="date"
                                    type="date"
                                    value={date}
                                    onChange={e => handleDateChange(e.target.value)}
                                />
                                {dateValidationError && <div className="invalid-feedback">Date Required.</div>}
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <label className="text-start mb-2">Time </label>
                                <Input className={` ${timeValidationError ? 'is-invalid' : ''}`}
                                    id="time"
                                    name="time"
                                    type="time"
                                    value={time}
                                    onChange={e => handleTimeChange(e.target.value)}
                                />
                                {timeValidationError && <div className="invalid-feedback">Time Required.</div>}
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <label className="text-start mb-2">Medicine Category <span className="text-danger">*</span></label>
                                <select
                                    className={`form-control ${medicineCategoryValidationError ? 'is-invalid' : ''}`}
                                    value={medicineCategory}
                                    onChange={(e) => handleMedicineCategoryChange(e.target.value)}
                                >
                                    <option value="">--Select Category--</option>
                                    {medicineCategoryData.map((data: any, idx: number) => (
                                        <option key={idx} value={data.categoryName}>
                                            {data.categoryName}
                                        </option>
                                    ))}
                                </select>
                                {medicineCategoryValidationError && <div className="invalid-feedback">Medicine Category Required.</div>}
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <label className="text-start mb-2">
                                    Medicine Name <span className="text-danger">*</span>
                                </label>
                                <select className={`form-control ${medicineNameValidationError ? 'is-invalid' : ''}`}
                                    value={medicineName}
                                    onChange={(e) => handleMedicineNameChange(e.target.value)}
                                    // disabled={!selectedCategory}
                                >
                                    <option value="">--Select Medicine Name--</option>
                                    {medicineStockData
                                        .filter((data: any) => data.category === medicineCategory)
                                        .map((filteredMedicine: any, idx: number) => (
                                            <option key={idx} value={filteredMedicine.name}>
                                                {filteredMedicine.name}
                                            </option>
                                        ))}
                                </select>
                                {medicineNameValidationError && <div className="invalid-feedback">Medicine Name Required.</div>}
                            </FormGroup>
                        </Col>

                        <Col md={6}>
                            <FormGroup>
                                <label className="text-start mb-2">
                                    Dosage <span className="text-danger">*</span>
                                </label>
                                <select className={`form-control ${dosageValidationError ? 'is-invalid' : ''}`}
                                    value={dosage}
                                    onChange={(e) => handleDosageChange(e.target.value)}
                                    // disabled={!selectedCategory || !medicineName}
                                >
                                    <option value="">--Select Dosage--</option>
                                    {medicineDosageData
                                        .filter((data: any) => data.medicineCategory === medicineCategory)
                                        .map((filteredData: any, idx: number) => (
                                            <option key={idx} value={filteredData.dose}>
                                                {filteredData.dose} {filteredData.unit}
                                            </option>
                                        ))}
                                </select>
                                {dosageValidationError && <div className="invalid-feedback">Dosage Required.</div>}
                            </FormGroup>
                        </Col>

                        <Col sm={12}>
                            <FormGroup>
                                <label className="text-start mb-2">Remarks</label>
                                <textarea
                                    className={`form-control`}
                                    id="remarks"
                                    name="remarks"
                                    value={remarks}
                                    onChange={e => setRemarks(e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Col className='text-end'>
                        <Button onClick={props.handleColse} color="primary">Save</Button>
                    </Col>
                </Form>
            </Row>
        </Container>
    </>
}
export default AddMedication