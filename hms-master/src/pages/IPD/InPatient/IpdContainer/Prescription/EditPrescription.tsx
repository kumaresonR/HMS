import { Button, Card, CardBody, CardHeader, Col, Container, FormGroup, Input, Label, Row } from "reactstrap";
import { customStyles, } from "../../../../../common/data/FakeData";
import Select from "react-select";
import { faXmark, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import BillingApiService from "../../../../../helpers/services/billing/billing-api-service";
import IPDApiService from "../../../../../helpers/services/ipd/ipd-api-service";
import AppointmentApiService from "../../../../../helpers/services/appointment/appointment-api-service";
import ErrorHandler from "../../../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import PharmacyApiService from "../../../../../helpers/services/pharmacy/pharmacy-api-service";
import SetupApiService from "../../../../../helpers/services/setup/setup-api-service";
import OPDApiService from "../../../../../helpers/services/opd/opd-api-service";

const EditPresciption = (props: any) => {
    const appointmentApiServic: AppointmentApiService = new AppointmentApiService();
    const ipdApiService: IPDApiService = new IPDApiService();
    const billingApiService: BillingApiService = new BillingApiService();
    const setupApiService: SetupApiService = new SetupApiService();
    const pharmacyApiService: PharmacyApiService = new PharmacyApiService();
    const opdApiService: OPDApiService = new OPDApiService();

    const [ipdId, setIpdId] = useState<any>('');
    const [opdId, setOpdId] = useState<any>('');
    const [patientId, setPatientId] = useState<any>('');
    const [prescribeBy, setPrescribeBy] = useState<any>('');
    const [selectedDoctor, setSelectedDoctor] = useState<any[]>([]);
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
    const [options, setOptions] = useState<any[]>([]);
    const [documentFile, setDocument] = useState<any>();
    const [datePrescribed, setDatePrescribed] = useState<any>('');
    const [datePrescribedValidationError, setDatePrescribedValidationError] = useState(false);
    const [medicineCategoryData, setMedicineCategoryData] = useState([]);
    const [medicineStockData, setMedicineStockData] = useState<any>([]);
    const [doseDurationData, setDoseDurationData] = useState([]);
    const [intervelData, setIntervelData] = useState([]);
    const [medicineDosageData, setMedicineDosageData] = useState([]);
    const [medicineData, setMedicineData] = useState([]);
    const [isMedicineLoading, setIsMedicineLoading] = useState(false);
    const [aiSuggestMedicineDatas, setAiSuggestMedicinesDatas] = useState([]);

    const onSearch = async (query: any) => {
        setIsLoading(true);
        try {
            let url = "role=DOCTOR&department=&searchTerm=" + query
            let result = await appointmentApiServic.searchAllEmployee(url);
            console.log("search result", result);
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

    // const addMedicine = () => {
    //     setMedicines([...medicines,
    //     { ipdId: '', medicineCategory: '', medicineName: '', dosage: '', dosageInterval: '', dosageDuration: '', instruction: '' }]);
    // };

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

    const addMedicine = () => {
        if (props.title === 'ipd') {
            setMedicines([...medicines,
            { ipdId: ipdId, medicineCategory: '', medicineName: '', dosage: '', dosageInterval: '', dosageDuration: '', instruction: '' }]);
        } else {
            setMedicines([...medicines,
            { opdId: opdId, medicineCategory: '', medicineName: '', dosage: '', dosageInterval: '', dosageDuration: '', instruction: '' }]);
        }
    };

    const handleInputChange = (index: number, field: string, value: string) => {
        const newMedicine = [...medicines];
        newMedicine[index] = {
            ...newMedicine[index],
            [field]: value,
        };
        console.log(newMedicine);
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
        console.log(selectedPathology)
        const selectedIds = item ? item.map((item: any) => item.value) : [];
        console.log(selectedIds);
        setPathologyId(selectedIds);
    }

    const handleRadiologyChange = (item: any) => {
        setSelectedRadiology(item)
        console.log(selectedRadiology)
        const selectedIds = item ? item.map((item: any) => item.value) : [];
        console.log(selectedIds);
        setRadiologyId(selectedIds);
    }

    const handleDateChange = (value: any) => {
        setDatePrescribed(value);
        setDatePrescribedValidationError(false);
    }

    const onFileUploadListener = (event: any) => {
        const file = event.target.files[0];
        setDocument(file);
    }

    const getAllPathology = async () => {
        try {
            let url = "all"
            let result = await billingApiService.getPathologyTest(url);
            setPathologyData(result);
        } catch (error: any) {
            console.log(error);
        }
    }

    const getAllRadiology = async () => {
        try {
            let url = "all"
            let result = await billingApiService.getRadiologyTest(url);
            console.log("getAllRadiology", result);
            setRadiologyData(result);
        } catch (error: any) {
            console.log("getAllRadiology Error");
            console.log(error);
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

    const getAllDoseDuration = async () => {
        try {
            let data = await setupApiService.getAllDoseDuration();
            setDoseDurationData(data);
        } catch (error) {
            console.log(error);
        }
    }

    const getAllDoseIntervel = async () => {
        try {
            let data = await setupApiService.getAllDoseIntervel();
            setIntervelData(data);
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

    const getPrescriptionById = async () => {
        try {
            if (props.title === 'ipd') {
                let result = await ipdApiService.getPrescriptionById(props.id);
                setPrescriptionData(result);
            } else {
                let result = await opdApiService.getPrescriptionById(props.id);
                setPrescriptionData(result);
            }
        } catch (error: any) {
            console.log("getPrescriptionById Error");
            console.log(error);
        }
    }

    const setPrescriptionData = (data: any) => {
        setIpdId(data.ipdId || '');
        setOpdId(data.opdId || '');
        setPatientId(data.patientId);
        if (data.doctor) {
            const doctor = {
                employeeId: data.doctorId,
                fullName: `${data.doctor.firstName} ${data.doctor.lastName}`,
            };
            setOptions([doctor]);
            setSelectedDoctor([doctor]);
            setPrescribeBy(data.doctorId);
        } else {
            setSelectedDoctor([]);
            setPrescribeBy('');
        }
        // setPrescribeBy(data.doctorId);
        setPathologyId(data.pathologyId);
        setRadiologyId(data.radiologyId);
        setFindingCategory(data.findingCategory);
        setFinding(data.finding);
        setFindingDescription(data.findingDescription);
        setDocument(data.attachment);
        setMedicines(data.prescriptionDetails);
        setDatePrescribed(data.datePrescribed);
        setHeaderNote(data.headerNote);
        setFooterNote(data.footerNote)
        const updatedMedicines = data.prescriptionDetails.map((medicine: any) => ({
            ...medicine,
            medicineName: medicine.medicineName || "", // Ensure it has a default value
        }));

        setMedicines(updatedMedicines);
        // Set selectedPathology with names
        const defaultPathology = data.pathologyId.map((id: string) => {
            const matchedItem = pathologyData.find((item: any) => item.pathologyTestId === id);
            return matchedItem ? { label: matchedItem.testName, value: id } : null;
        }).filter(Boolean); // Remove null values

        setSelectedPathology(defaultPathology);

        // Set selectedRadiology with names
        const defaultRadiology = data.radiologyId.map((id: string) => {
            const matchedItem = radiologyData.find((item: any) => item.radiologyTestId === id);
            return matchedItem ? { label: matchedItem.testName, value: id } : null;
        }).filter(Boolean);

        setSelectedRadiology(defaultRadiology);
    };

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
                // ipdId: ipdId,
                patientId: patientId,
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
                payload.ipdId = ipdId;
            } else {
                payload.opdId = opdId;
            }
            console.log(JSON.stringify(payload))
            // Convert JSON payload to Blob with application/json type
            const jsonBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            formData.append('prescriptionDTO', jsonBlob);
            formData.append('file', documentFile);
            if (props.title === 'ipd') {
                await ipdApiService.editPrescription(props.id, formData);
            } else {
                await opdApiService.editPrescription(props.id, formData);
            }
            toast.success('Prescription Updated Successfully', { containerId: 'TR' });
            props.handleClose();
            props.refresh();
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await getAllPathology();
            await getAllRadiology();
            await getPrescriptionById();
            await getAllMedicineCategory();
            await getAllMedicineStock();
            await getAllDoseDuration();
            await getAllDoseIntervel();
            await getAllMedicineDosage();
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (pathologyData.length > 0 && radiologyData.length > 0) {
            getPrescriptionById();
        }
    }, [pathologyData, radiologyData]);


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
                                <Input
                                    id="Finding-Category"
                                    name="Finding-Category"
                                    type="textarea"
                                    rows={6}
                                    value={findingCategory}
                                    onChange={e => setFindingCategory(e.target.value)}
                                />
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="mb-3">
                                <Label htmlFor="Finding" className="form-label ">Findings</Label>
                                <Input
                                    id="Finding"
                                    name="Finding"
                                    type="textarea"
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
                        {aiSuggestMedicineDatas?.length > 0 && (
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
                        )}
                        {/* <Col md={2}>
                            <div className="form-check" >
                                <Input className="form-check-input" defaultChecked
                                    type="checkbox" id="visible" />
                                <Label className="form-check-label">Finding Print</Label>
                            </div>
                        </Col> */}
                    </Row>

                    {/* <Col>
                        <Label>Footer Note</Label>
                        <ReactQuill theme="snow" value={footerNote} onChange={setFooterNote} />
                    </Col> */}
                </Col>
                <Col md={3}>
                    <Col>
                        <div className="mb-3">
                            <Label htmlFor="symptoms-type" className="form-label ">Prescribe By<span className="text-danger">*</span></Label>
                            <AsyncTypeahead
                                filterBy={() => true}
                                id="doctor-id-search-box"
                                className={` ${prescribeByValidationError ? 'is-invalid' : ''}`}
                                isLoading={isLoading}
                                labelKey="fullName"
                                minLength={1}
                                options={options}
                                onSearch={onSearch}
                                onChange={(selectedItem: any) => {
                                    if (selectedItem.length > 0) {
                                        const doctorId = selectedItem[0].employeeId;
                                        setPrescribeBy(doctorId);
                                        setSelectedDoctor(selectedItem);
                                        setPrescribeByValidationError(false);
                                    } else {
                                        setPrescribeBy('');
                                        setSelectedDoctor([]);
                                        setPrescribeByValidationError(true);
                                    }
                                }}
                                placeholder="Search by Doctor Name or Id"
                                selected={selectedDoctor}
                            />
                            {prescribeByValidationError && <div className="invalid-feedback">Prescribe By Required.</div>}
                        </div>
                    </Col>
                    <Col>
                        <div className="mb-3">
                            <Label htmlFor="Pathology" className="form-label">Pathology</Label>
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
                            <Label htmlFor="Radiology" className="form-label">Radiology</Label>
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
                    {/* <Col>
                        <Label>Notification To </Label>
                        <Col>
                            {roleData.map((item: any, idx: any) => (
                                <div className="form-check" key={idx}>
                                    <Input className="form-check-input"
                                        type="checkbox" id="visible" />
                                    <Label className="form-check-label">{item.name}</Label>
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
                <Col md={12} className="mx-auto">
                    {medicines.map((medicine: any, index: number) => {
                        // Find the selected medicine category in medicineData
                        // const selectedCategory = medicineStockData.find(
                        //     (name: any) => name.category === medicine.medicineCategory
                        // );

                        return (
                            <Row key={index} className="align-items-center">
                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Medicine</label>
                                        <AsyncTypeahead
                                            id="medicine"
                                            filterBy={() => true}
                                            isLoading={isMedicineLoading}
                                            labelKey="name"
                                            minLength={1}
                                            options={medicineData}
                                            onSearch={getAllMedicineName}
                                            placeholder="Search by Medicine Name"
                                            selected={
                                                medicine.medicineName
                                                    ? [{ name: medicine.medicineName }] // must be array of selected items
                                                    : []
                                            }
                                            onChange={(selected: any[]) => {
                                                const newMedicine = [...medicines];
                                                if (selected.length > 0) {
                                                  const selectedItem = selected[0];
                                            
                                                  newMedicine[index] = {
                                                    ...newMedicine[index],
                                                    medicineName: selectedItem.name || selectedItem, // handles if it's a string
                                                    medicineCategory: selectedItem.category || "", // set category too
                                                  };
                                                //   aiSuggestMedicines(selectedItem.name);
                                                } else {
                                                  newMedicine[index] = {
                                                    ...newMedicine[index],
                                                    medicineName: "",
                                                    medicineCategory: "",
                                                  };
                                                //   setAiSuggestMedicinesDatas([])
                                                }
                                                setMedicines(newMedicine);
                                              }}
                                             
                                            renderMenuItemChildren={(option: any) => (
                                                <>
                                                    {option.name?.trim()}{" "}
                                                    <span className="text-muted">({option.category})</span>
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
                                    {/* <FormGroup>
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
                                    </FormGroup> */}
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
                                        <Button onClick={() => removeMedicine(index)} color="danger">
                                            <FontAwesomeIcon className="mx-1" icon={faXmark} />
                                        </Button>
                                    )}
                                </Col>
                            </Row>
                        );
                    })}
                </Col>

                <Col>
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
            </Row>
            <Col className="text-end">
                {/* <Button className="mx-2">Save & Print</Button> */}
                <Button className="mx-2" color="primary" onClick={handleSubmit}>Save </Button>
            </Col>
        </Container>
    </>
}

export default EditPresciption