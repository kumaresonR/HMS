import { useEffect, useState } from "react";
import { Button, Col, Container, Form, FormGroup, Input, Row } from "reactstrap";
import { medicineData } from "../../../../../common/data/IpdData";
import { toast } from "react-toastify";
import ErrorHandler from "../../../../../helpers/ErrorHandler";
import IPDApiService from "../../../../../helpers/services/ipd/ipd-api-service";
import OPDApiService from "../../../../../helpers/services/opd/opd-api-service";
import moment from "moment";
import PharmacyApiService from "../../../../../helpers/services/pharmacy/pharmacy-api-service";
import SetupApiService from "../../../../../helpers/services/setup/setup-api-service";

const EditMedication = (props: any) => {
    const opdApiService: OPDApiService = new OPDApiService();
    const iPDApiService: IPDApiService = new IPDApiService();
    const setupApiService: SetupApiService = new SetupApiService();
    const pharmacyApiService: PharmacyApiService = new PharmacyApiService();

    // const [data, setData] = useState(props.data);
    const [medicationId, setMedicationId] = useState('');
    const [dosageId, setDosageId] = useState('');
    const [ipdId, setIpdId] = useState('');
    const [opdId, setOpdId] = useState('');
    const [note, setNote] = useState('');
    const [time, setTime] = useState('');
    const [timeValidationError, setTimeValidationError] = useState(false);
    const [medicineCategory, setMedicineCategory] = useState('');
    const [medicineCategoryValidationError, setMedicineCategoryValidationError] = useState(false);
    const [medicineName, setMedicineName] = useState('');
    const [medicineNameValidationError, setMedicineNameValidationError] = useState(false);
    const [date, setDate] = useState('');
    const [dateValidationError, setDateValidationError] = useState(false);
    const [dosage, setDosage] = useState('');
    const [dosageValidationError, setDosageValidationError] = useState(false);
    const [remarks, setRemarks] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<any>(null)
    const [medicineDosageData, setMedicineDosageData] = useState([]);
    const [medicineCategoryData, setMedicineCategoryData] = useState([]);
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
        // const categoryData = medicineData.find(data => data.medicineCategory === value);
        // setSelectedCategory(categoryData || null);
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
            doEditMedication();
        }
    };

    const doEditMedication = async () => {
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
            };
            if (props.title === 'ipd') {
                payload.ipdId = props?.data?.admissions?.ipdId;
            } else {
                payload.opdId = props?.data?.admissions?.opdId;
            }

            if (props.title === 'ipd') {
                await iPDApiService.editMedication(medicationId, dosageId, payload);
            } else {
                await opdApiService.editMedication(medicationId, dosageId, payload);
            }
            toast.success('Medication Updated Successfully', { containerId: 'TR' });
            props.refresh();
            props.handleColse();
        } catch (error: any) {
            console.log("Medication Updated Failed", error);
            return ErrorHandler(error)
        }
    }

    const setMedicationData = (data: any) => {
        if (props.title === 'ipd') {
            setIpdId(data.admissions?.ipdId);
        } else {
            setOpdId(data.admissions?.opdId);
        }
        if (data.medicineCategory) {
            handleMedicineCategoryChange(data.medicineCategory);
        }
        setMedicineName(data.medicineName);
        setMedicineCategory(data.medicineCategory);
        setDosage(data?.dosage[0]?.dosage);
        setRemarks(data?.dosage[0]?.remarks);
        setMedicationId(data.medicationId);
        setDosageId(data?.dosage[0]?.dosageId);
        setDate(data.date);
        setTime(moment(data?.dosage[0]?.dosageTime, "HH:mm:ss").format("HH:mm"));
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
        setMedicationData(props.id)
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
                        <Button color="primary">Save</Button>
                    </Col>
                </Form>
            </Row>
        </Container>
    </>
}
export default EditMedication