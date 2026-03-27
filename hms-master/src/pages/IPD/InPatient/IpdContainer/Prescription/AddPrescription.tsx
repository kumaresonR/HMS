import Select from "react-select"
import { Button, Card, CardBody, CardHeader, Col, Container, FormGroup, Input, Label, Row } from "reactstrap"
import { customStyles } from "../../../../../common/data/FakeData"
import { useEffect, useState } from "react";
import { faXmark, faCirclePlus, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import AppointmentApiService from "../../../../../helpers/services/appointment/appointment-api-service";
import IPDApiService from "../../../../../helpers/services/ipd/ipd-api-service";
import BillingApiService from "../../../../../helpers/services/billing/billing-api-service";
import ErrorHandler from "../../../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import OPDApiService from "../../../../../helpers/services/opd/opd-api-service";
import SetupApiService from "../../../../../helpers/services/setup/setup-api-service";
import PharmacyApiService from "../../../../../helpers/services/pharmacy/pharmacy-api-service";
import { useModal } from "../../../../../Components/Common/ModalContext";
import AiSuggestMedicines from "./AiSuggestMedicines";

const AddPrescription = (props: any) => {
    const appointmentApiServic: AppointmentApiService = new AppointmentApiService();
    const ipdApiService: IPDApiService = new IPDApiService();
    const billingApiService: BillingApiService = new BillingApiService();
    const opdApiService: OPDApiService = new OPDApiService();
    const setupApiService: SetupApiService = new SetupApiService();
    const pharmacyApiService: PharmacyApiService = new PharmacyApiService();

    const { showModal, hideModal } = useModal();

    // const [data, setData] = useState(props.data);
    const [prescribeBy, setPrescribeBy] = useState<any>('');
    const [pathologyData, setPathologyData] = useState<any>([]);
    const [pathologyId, setPathologyId] = useState([]);
    const [selectedPathology, setSelectedPathology] = useState<any>([]);
    const [radiologyData, setRadiologyData] = useState<any>([]);
    const [radiologyId, setRadiologyId] = useState([]);
    const [selectedRadiology, setSelectedRadiology] = useState<any>([]);
    const [headerNote, setHeaderNote] = useState('');
    const [footerNote, setFooterNote] = useState('');
    const [findingCategory, setFindingCategory] = useState<any>('');
    const [finding, setFinding] = useState<any>('');
    const [findingDescription, setFindingDescription] = useState('');
    const [medicines, setMedicines] = useState<any[]>([]);
    const [prescribeByValidationError, setPrescribeByValidationError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<[]>([]);
    const [documentFile, setDocument] = useState<any>();
    const [datePrescribed, setDatePrescribed] = useState<any>('');
    const [datePrescribedValidationError, setDatePrescribedValidationError] = useState(false);
    const [medicineCategoryData, setMedicineCategoryData] = useState([]);
    const [medicineDosageData, setMedicineDosageData] = useState([]);
    const [medicineStockData, setMedicineStockData] = useState<any>([]);
    const [doseDurationData, setDoseDurationData] = useState([]);
    const [intervelData, setIntervelData] = useState([]);
    const [medicineData, setMedicineData] = useState([]);
    const [isMedicineLoading, setIsMedicineLoading] = useState(false);
    const [aiSuggestMedicineDatas, setAiSuggestMedicinesDatas] = useState([]);

    const onSearch = async (query: any) => {
        setIsLoading(true);
        try {
            let url = "role=DOCTOR&department=&searchTerm=" + query
            let result = await appointmentApiServic.searchAllEmployee(url);
            setOptions(result)
        } catch (error) {
            console.log("Doctor search Error");
        } finally {
            setIsLoading(false);
        }
    }

    const onSelectedDoctorId = (selectedItem: any) => {
        const doctorId = selectedItem?.[0]?.['employeeId'];
        setPrescribeBy(doctorId);
        setPrescribeByValidationError(false);
    }

    const addMedicine = () => {
        if (props.title === 'ipd') {
            setMedicines([...medicines,
            { ipdId: props?.data.admissions?.ipdId, medicineCategory: '', medicineName: '', dosage: '', dosageInterval: '', dosageDuration: '', instruction: '' }]);
        } else {
            setMedicines([...medicines,
            { opdId: props?.data.opdId || props?.data?.admissions?.opdId, medicineCategory: '', medicineName: '', dosage: '', dosageInterval: '', dosageDuration: '', instruction: '' }]);
        }
    };

    const handleInputChange = (index: number, field: string, value: string) => {
        const newMedicine = [...medicines];
        newMedicine[index] = {
            ...newMedicine[index],
            [field]: value,
        };
        setMedicines(newMedicine);
    };

    const removeMedicine = (index: any) => {
        const newMedicine = [...medicines];
        newMedicine.splice(index, 1);
        setMedicines(newMedicine);
    };

    const aiSuggestMedicines = async (value: any) => {
        try {
            let payload: any = {
                composition: value
            };
            const response = await pharmacyApiService.aiSuggestMedicines(payload);
            console.log(response.data);
            setAiSuggestMedicinesDatas(response?.data?.similar_medicines)
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const handlePathologyChange = (item: any) => {
        setSelectedPathology(item)
        const selectedIds = item ? item.map((item: any) => item.value) : [];
        setPathologyId(selectedIds);
    }

    const handleRadiologyChange = (item: any) => {
        setSelectedRadiology(item)
        const selectedIds = item ? item.map((item: any) => item.value) : [];
        setRadiologyId(selectedIds);
    }

    const onFileUploadListener = (event: any) => {
        const file = event.target.files[0];
        setDocument(file);
    }

    const handleDateChange = (value: any) => {
        setDatePrescribed(value);
        setDatePrescribedValidationError(false);
    }

    const getAllPathology = async () => {
        try {
            let url = "all"
            let result = await billingApiService.getPathologyTest(url);
            setPathologyData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllRadiology = async () => {
        try {
            let url = "all"
            let result = await billingApiService.getRadiologyTest(url);
            setRadiologyData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllMedicineCategory = async () => {
        try {
            let data = await setupApiService.getAllMedicineCategory();
            setMedicineCategoryData(data);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllMedicineName = async (url: any) => {
        setIsMedicineLoading(true);
        try {
            let data = await pharmacyApiService.searchMedinceName(url);
            setMedicineData(data);
        } catch (error: any) {
            return ErrorHandler(error)
        } finally {
            setIsMedicineLoading(false);
        }
    }

    const getAllMedicineDosage = async () => {
        try {
            let data = await setupApiService.getAllMedicineDosage();
            setMedicineDosageData(data);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllDoseDuration = async () => {
        try {
            let data = await setupApiService.getAllDoseDuration();
            setDoseDurationData(data);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllDoseIntervel = async () => {
        try {
            let data = await setupApiService.getAllDoseIntervel();
            setIntervelData(data);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllMedicineStock = async () => {
        try {
            let url = "all"
            let result = await pharmacyApiService.getAllMedicineStock(url);
            setMedicineStockData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!prescribeBy) {
            setPrescribeByValidationError(true);
            isFormValid = false;
        }

        if (!datePrescribed) {
            setDatePrescribedValidationError(true);
            isFormValid = false;
        }

        return isFormValid;

    }

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }
        try {
            let formData: FormData = new FormData();
            const payload: any = {
                patientId: props?.data?.admissions?.patientId || props?.data?.patientId,
                doctorId: prescribeBy,
                pathologyId: pathologyId,
                radiologyId: radiologyId,
                findingCategory: findingCategory || 'NA',
                finding: finding || 'NA',
                findingDescription: findingDescription || 'NA',
                prescriptionDetails: medicines,
                headerNote: headerNote || 'NA',
                footerNote: footerNote || 'NA',
                datePrescribed: datePrescribed
            };
            if (props.title === 'ipd') {
                payload.ipdId = props?.data?.admissions?.ipdId;
            } else {
                payload.opdId = props?.data?.opdId || props?.data?.admissions?.opdId;
            }
            // Convert JSON payload to Blob with application/json type
            const jsonBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            console.log("prescriptionDTO", payload)
            formData.append('prescriptionDTO', jsonBlob);
            formData.append('file', documentFile);
            if (props.title === 'ipd') {
                await ipdApiService.createPrescription(formData);
            } else {
                await opdApiService.createPrescription(formData);
            }
            toast.success('Prescription Saved Successfully', { containerId: 'TR' });
            props.handleClose();
            if (props.refresh) {
                props.refresh();
            }
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        addMedicine();
        getAllPathology();
        getAllRadiology();
        getAllMedicineCategory();
        getAllMedicineStock();
        getAllDoseDuration();
        getAllDoseIntervel();
        getAllMedicineDosage();
    }, []);

    return <>
        <Container fluid>
            <Row>
                <Col md={9}>
                    {/* <Col className="mb-3">
                        <Label>Header Note</Label>
                        <ReactQuill theme="snow" value={headerNote} onChange={setHeaderNote} className="custom-editor" />
                    </Col> */}
                    <Row>
                        <Col md={6}>
                            <div className="mb-3">
                                <Label htmlFor="Finding-Category" className="form-label ">Finding Category </Label>
                                <textarea className={`form-control`}
                                    id="Finding-Category"
                                    name="Finding-Category"
                                    rows={6}
                                    value={findingCategory}
                                    onChange={e => setFindingCategory(e.target.value)}
                                />
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="mb-3">
                                <Label htmlFor="Finding" className="form-label ">Findings</Label>
                                <textarea className={`form-control`}
                                    id="Finding"
                                    name="Finding"
                                    rows={6}
                                    value={finding}
                                    onChange={e => setFinding(e.target.value)}
                                />
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="mb-3">
                                <Label htmlFor="Finding-description" className="form-label ">Finding Description</Label>
                                <textarea
                                    id="Finding-description"
                                    name="Finding-description"
                                    rows={6}
                                    value={findingDescription}
                                    className={`form-control`}
                                    onChange={e => setFindingDescription(e.target.value)}
                                />
                            </div>
                        </Col>
                        {/* {aiSuggestMedicineDatas?.length > 0 && (
                            <Col md={6}>
                                <Card className="bg-info-subtle">
                                    <CardBody>
                                        <h6>Ai Suggesions</h6>
                                        <ul>

                                            {aiSuggestMedicineDatas.map((data: any, idx: any) => (
                                                <li key={idx}> {data.name} ( {data.composition} )</li>
                                            ))}
                                        </ul>
                                    </CardBody>
                                </Card>
                            </Col>
                        )} */}

                        {/* <Col md={2} className="mb-3">
                            <div className="form-check" >
                                <Input className="form-check-input" defaultChecked
                                    type="checkbox" id="visible" />
                                <Label className="form-check-label">Finding Print</Label>
                            </div>
                        </Col> */}
                    </Row>
                </Col>
                <Col md={3}>
                    <Col>
                        <div className="mb-3">
                            <Label htmlFor="symptoms-type" className="form-label ">Prescribe By<span className="text-danger">*</span></Label>
                            <AsyncTypeahead
                                filterBy={() => true}
                                id="patient-id-search-box"
                                className={` ${prescribeByValidationError ? 'is-invalid' : ''}`}
                                isLoading={isLoading}
                                labelKey="fullName"
                                minLength={1}
                                options={options}
                                onSearch={onSearch}
                                onChange={onSelectedDoctorId}
                                placeholder="Search by Doctor Name or Id"
                            />
                            {prescribeByValidationError && <div className="invalid-feedback">Prescribe By Required.</div>}
                        </div>
                    </Col>
                    <Col>
                        <div className="mb-3">
                            <Label htmlFor="Pathology" className="form-label ">Pathology</Label>
                            <Select
                                id="Pathology"
                                value={selectedPathology}
                                isMulti={true}
                                onChange={handlePathologyChange}
                                options={pathologyData.map((item: any) => ({
                                    label: item.testName,
                                    value: item.pathologyTestId,
                                }))}
                                styles={customStyles}
                            />
                        </div>
                    </Col>
                    <Col>
                        <div className="mb-3">
                            <Label htmlFor="Radiology" className="form-label ">Radiology</Label>
                            <Select
                                id="Radiology"
                                value={selectedRadiology}
                                isMulti={true}
                                onChange={handleRadiologyChange}
                                options={radiologyData.map((item: any) => ({
                                    label: item.testName,
                                    value: item.radiologyTestId,
                                }))}
                                styles={customStyles}
                            />
                        </div>
                    </Col>
                    <Col>
                        <FormGroup>
                            <label className="text-start mb-2">Date</label>
                            <Input
                                id="date"
                                name="date"
                                type="date"
                                value={datePrescribed}
                                onChange={(e) =>
                                    handleDateChange(e.target.value)
                                }
                                invalid={!!datePrescribedValidationError}
                            />
                            {datePrescribedValidationError && <div className="invalid-feedback">Date Required.</div>}
                        </FormGroup>
                    </Col>
                    {/* <Col>
                        <Label>Notification To </Label>
                        <Col>
                            {roleData.map((item: any, idx: any) => (
                                <div className="form-check mb-1" key={idx}>
                                    <Input className="form-check-input"
                                        type="checkbox" id="visible" />
                                    <Label className="form-check-label ms-2">{item.name}</Label>
                                </div>
                            ))}
                        </Col>
                    </Col> */}
                </Col>
            </Row>
            <Row>
                <CardHeader className="d-flex justify-content-between mb-2 py-2">
                    <h4 className="card-title mb-0">Add Medicine </h4> {/* Update title */}
                    <Button onClick={addMedicine} color="success">
                        <FontAwesomeIcon icon={faCirclePlus} />
                        &nbsp;Add New
                    </Button>
                </CardHeader>
                <Col md={12} className="mx-auto ">
                    {medicines.map((medicine: any, index: number) => {
                        // Find the selected medicine category in medicineData
                        // const selectedCategory = medicineStockData.find(
                        //     (name: any) => name.category === medicine.medicineCategory
                        // );
                        // console.log("selectedCategory", selectedCategory)
                        return (
                            <Row key={index} className="align-items-center mb-2">
                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Medicine</label>
                                        <AsyncTypeahead
                                            filterBy={() => true}
                                            id="medicine"
                                            isLoading={isMedicineLoading}
                                            labelKey="name"
                                            minLength={1}
                                            options={medicineData}
                                            onSearch={getAllMedicineName}
                                            placeholder="Search by Medicine Name"
                                            onChange={(selected: any) => {
                                                const selectedMedicine = selected[0];

                                                if (selectedMedicine) {
                                                    const newMedicine = [...medicines];
                                                    newMedicine[index] = {
                                                        ...newMedicine[index],
                                                        medicineName: selectedMedicine.name,
                                                        medicineCategory: selectedMedicine.category,
                                                    };
                                                    setMedicines(newMedicine);
                                                    // aiSuggestMedicines(selectedMedicine.name);
                                                } 
                                                // else {
                                                //     setAiSuggestMedicinesDatas([])
                                                // }
                                            }}
                                            renderMenuItemChildren={(option: any) => (
                                                <>
                                                    {option.name?.trim()} <span className="text-muted">({option.category})</span>
                                                </>
                                            )}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Medicine Category</label>
                                        <select
                                            className={`form-control`}
                                            value={medicine.medicineCategory}
                                            onChange={(e) =>
                                                handleInputChange(index, "medicineCategory", e.target.value)
                                            }
                                        >
                                            <option value="">--Select Medicine Category--</option>
                                            {medicineCategoryData.map((data: any, idx: number) => (
                                                <option key={idx} value={data.categoryName}>
                                                    {data.categoryName}
                                                </option>
                                            ))}
                                        </select>
                                    </FormGroup>
                                </Col>
                                {/* <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Medicine</label>
                                        <select
                                            className={`form-control`}
                                            value={medicine.medicineName}
                                            onChange={(e) =>
                                                handleInputChange(index, "medicineName", e.target.value)
                                            }
                                        >
                                            <option value="">--Select Medicine--</option>
                                            {medicineStockData
                                                .filter((data: any) => data.category === medicine.medicineCategory)
                                                .map((filteredMedicine: any, idx: number) => (
                                                    <option key={idx} value={filteredMedicine.name}>
                                                        {filteredMedicine.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </FormGroup>
                                </Col> */}
                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Dosage</label>
                                        <Input
                                            id="dosage"
                                            name="dosage"
                                            type="text"
                                            value={medicine.dosage}
                                            onChange={(e) =>
                                                handleInputChange(index, "dosage", e.target.value)
                                            }
                                        />
                                    </FormGroup>
                                    {/* <FormGroup>
                                        <label className="text-start mb-2">Dosage</label>
                                        <select
                                            className={`form-control`}
                                            value={medicine.dosage}
                                            onChange={(e) =>
                                                handleInputChange(index, "dosage", e.target.value)
                                            }
                                        >
                                            <option value="">--Select Dosage--</option>
                                            {medicineDosageData
                                                .filter((data: any) => data.medicineCategory === medicine.medicineCategory)
                                                .map((filteredData: any, idx: number) => (
                                                    <option key={idx} value={filteredData.dose}>
                                                        {filteredData.dose} {filteredData.unit}
                                                    </option>
                                                ))}
                                        </select>
                                    </FormGroup> */}
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Dose Interval </label>
                                        <select
                                            className={`form-control`}
                                            value={medicine.dosageInterval}
                                            onChange={(e) =>
                                                handleInputChange(index, "dosageInterval", e.target.value)
                                            }
                                        >
                                            <option value="">--Select Dose Interval--</option>
                                            {intervelData.map((data: any, idx: number) => (
                                                <option key={idx} value={data.interval}>
                                                    {data.interval}
                                                </option>
                                            ))}
                                        </select>
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Dose Duration </label>
                                        <select
                                            className={`form-control`}
                                            value={medicine.dosageDuration}
                                            onChange={(e) =>
                                                handleInputChange(index, "dosageDuration", e.target.value)
                                            }
                                        >
                                            <option value="">--Select Dose Duration--</option>
                                            {doseDurationData.map((data: any, idx: number) => (
                                                <option key={idx} value={data.duration}>
                                                    {data.duration}
                                                </option>
                                            ))}
                                        </select>
                                    </FormGroup>
                                </Col>
                                <Col sm={12} md>
                                    <FormGroup>
                                        <label className="text-start mb-2">Instruction</label>
                                        <Input
                                            id="Instruction"
                                            name="Instruction"
                                            type="text"
                                            value={medicine.instruction}
                                            onChange={(e) =>
                                                handleInputChange(index, "instruction", e.target.value)
                                            }
                                        />
                                    </FormGroup>
                                </Col>

                                <Col xs="auto">
                                    {index !== 0 && (
                                        <button onClick={() => removeMedicine(index)} className="btn btn-soft-danger waves-effect waves-light material-shadow-none" color="danger">
                                            <FontAwesomeIcon className="mx-1" icon={faXmark} />
                                        </button>
                                    )}
                                </Col>

                            </Row>

                        );
                    })}
                </Col>

                <Col sm={4}>
                    <FormGroup>
                        <label className="text-start mb-2">Attachment</label>
                        <Input
                            type="file"
                            className="form-control"
                            id="attachment"
                            onChange={onFileUploadListener}
                        />
                    </FormGroup>
                </Col>
                {/* <Col>
                    <Label>Footer Note</Label>
                    <ReactQuill theme="snow" value={footerNote} onChange={setFooterNote} />
                </Col> */}
            </Row>
            <Col className="text-end mt-3">
                {/* <Button className="mx-2 " color="primary" >Save & Print</Button> */}
                <Button className="mx-2" color="primary" onClick={handleSubmit}>Save </Button>
            </Col>
        </Container>
    </>
}
export default AddPrescription