import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { Button, Col, Container, Form, FormGroup, Input, Row } from 'reactstrap';
import ErrorHandler from '../../helpers/ErrorHandler';
import PharmacyApiService from '../../helpers/services/pharmacy/pharmacy-api-service';
import SetupApiService from '../../helpers/services/setup/setup-api-service';

const EditMedicine = (props: any) => {
    const pharmacyApiService: PharmacyApiService = new PharmacyApiService();
    const setupApiService: SetupApiService = new SetupApiService();

    const [medicineName, setMedicineName] = useState('');
    const [medicineNameValidationError, setMedicineNameValidationError] = useState(false);
    const [medicineCategoryValidationError, setMedicineCategoryValidationError] = useState(false);
    const [medicineCategory, setMedicineCategory] = useState('');
    const [medicineCompanyValidationError, setMedicineCompanyValidationError] = useState(false);
    const [medicineCompany, setMedicineCompany] = useState('');
    const [medicineCompositionValidationError, setMedicineCompositionValidationError] = useState(false);
    const [medicineComposition, setMedicineComposition] = useState('');
    const [medicineGroup, setMedicineGroup] = useState('');
    const [medicineGroupValidationError, setMedicineGroupValidationError] = useState(false);
    const [unitValidationError, setUnitValidationError] = useState(false);
    const [unit, setUnit] = useState('');
    const [minLevel, setMinLevel] = useState('');
    const [reOrderLevel, setReOrderLevel] = useState('');
    const [tax, setTax] = useState('');
    const [boxOrPackingValidationError, setBoxOrPackingValidationError] = useState(false);
    const [boxOrPacking, setBoxOrPacking] = useState('');
    const [vatTax, setVatTax] = useState('');
    const [rackNumber, setRackNumber] = useState('');
    const [note, setNote] = useState('');
    const [medicineCategoryData, setMedicineCategoryData] = useState([]);
    const [medicineCompanyData, setMedicineCompanyData] = useState([]);
    const [medicineGroupData, setMedicineGroupData] = useState([]);
    const [medicineUnitData, setMedicineUnitData] = useState([]);

    const [selectedFile, setSelectedFile] = useState<any>();

    const validateForm = () => {
        let isFormValid = true;

        if (!medicineName) {
            setMedicineNameValidationError(true);
            isFormValid = false;
        }

        if (!medicineCategory) {
            setMedicineCategoryValidationError(true);
            isFormValid = false;
        }
        if (!medicineCompany) {
            setMedicineCompanyValidationError(true);
            isFormValid = false;
        }
        if (!medicineComposition) {
            setMedicineCompositionValidationError(true);
            isFormValid = false;
        }
        if (!medicineGroup) {
            setMedicineGroupValidationError(true);
            isFormValid = false;
        }
        if (!unit) {
            setUnitValidationError(true);
            isFormValid = false;
        }
        if (!boxOrPacking) {
            setBoxOrPackingValidationError(true);
            isFormValid = false;
        }

        return isFormValid;
    };

    const handleFileUpload = (event: any) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleNote = (value: any) => {
        setNote(value);
    }

    const handleRackNumber = (value: any) => {
        setRackNumber(value);
    }

    const handleVatTax = (value: any) => {
        setVatTax(value);
    }

    const handleboxOrPackingChange = (value: any) => {
        setBoxOrPacking(value);
        setBoxOrPackingValidationError(false);
    }

    const handleTax = (value: any) => {
        setTax(value);
    }

    const handleReOrderLevel = (value: any) => {
        setReOrderLevel(value);
    }

    const handleMinLevel = (value: any) => {
        setMinLevel(value);
    }

    const handleMedicineUnitChange = (value: any) => {
        setUnit(value);
        setUnitValidationError(false);
    }

    const handleMedicineGroupChange = (value: any) => {
        setMedicineGroup(value);
        setMedicineGroupValidationError(false);
    }

    const handleMedicineCompositionChange = (value: any) => {
        setMedicineComposition(value);
        setMedicineCompositionValidationError(false);
    }

    const handleMedicineCompanyChange = (value: any) => {
        setMedicineCompany(value);
        setMedicineCompanyValidationError(false);
    }

    const handleMedicineCategoryChange = (value: any) => {
        setMedicineCategory(value);
        setMedicineCategoryValidationError(false);
    }


    const handleMedicineNameChange = (value: any) => {
        setMedicineName(value);
        setMedicineNameValidationError(false);
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            addMedicineDetails();
        }
    }

    const addMedicineDetails = async () => {
        try {
            let formData: FormData = new FormData();
            const payload = {
                name: medicineName,
                category: medicineCategory,
                company: medicineCompany,
                composition: medicineComposition,
                groupName: medicineGroup,
                unit: unit,
                minLevel: minLevel,
                reorderLevel: reOrderLevel,
                rackNumber: rackNumber,
                tax: tax,
                boxPacking: boxOrPacking,
                vatAccount: vatTax,
                note: note,
            };

            // Convert JSON payload to Blob with application/json type
            const jsonBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            formData.append('medicineData', jsonBlob);
            formData.append('photo', selectedFile);
            await pharmacyApiService.editMedicineStock(props.id,formData);
            toast.success('Medicine Details Saved Successfully', { containerId: 'TR' });
            props.handleClose()
        } catch (error: any) {
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

    const getAllMedicineCompany = async () => {
        try {
            let data = await setupApiService.getAllMedicineCompany();
            setMedicineCompanyData(data);
        } catch (error) {
            console.log(error);
        }
    }

    const getAllMedicineGroup = async () => {
        try {
            let data = await setupApiService.getAllMedicineGroup();
            setMedicineGroupData(data);
        } catch (error) {
            console.log(error);
        }
    }

    const getAllMedicineUnit = async () => {
        try {
            let data = await setupApiService.getAllUnit();
            setMedicineUnitData(data);
        } catch (error) {
            console.log(error);
        }
    }

    const getMedicineStockById = async () => {
        try {
            let data = await pharmacyApiService.getAllMedicineStock(props.id);
            setData(data);
            console.log('getMedicineStockById data', data);
        } catch (error) {
            console.log(error);
        }

    }

    const setData = (data: any) => {
        setMedicineName(data.name);
        setMedicineCategory(data.category);
        setMedicineCompany(data.company);
        setMedicineComposition(data.composition);
        setMedicineGroup(data.groupName);
        setUnit(data.unit);
        setMinLevel(data.minLevel);
        setReOrderLevel(data.reorderLevel);
        setRackNumber(data.rackNumber);
        setTax(data.tax);
        setBoxOrPacking(data.boxPacking);
        setVatTax(data.vatAccount);
        setNote(data.note);
    }

    useEffect(() => {
        getAllMedicineCompany();
        getAllMedicineCategory();
        getAllMedicineGroup();
        getAllMedicineUnit();
        getMedicineStockById();
    }, []);

    return (
        <React.Fragment>
            <Container fluid>
                <Row>
                    <Col>
                        <Form onSubmit={handleSubmit}>
                            <Row className="justify-content-around">
                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Medicine Name <span className="text-danger">*</span></label>
                                        <Input
                                            id="medicineName"
                                            name="medicineName"
                                            type="text"
                                            value={medicineName}
                                            className={`${medicineNameValidationError ? 'is-invalid' : ''}`}
                                            onChange={e => handleMedicineNameChange(e.target.value)}
                                        />
                                        {medicineNameValidationError && <div className="invalid-feedback">Medicine Name Required.</div>}
                                    </FormGroup>
                                </Col>

                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Medicine Category <span className="text-danger">*</span></label>
                                        <select
                                            className={`form-control ${medicineCategoryValidationError ? 'is-invalid' : ''}`}
                                            value={medicineCategory}
                                            onChange={(e) => handleMedicineCategoryChange(e.target.value)}
                                        >
                                            <option value="">--Select Category--</option>
                                            {medicineCategoryData.map((data: any, idx: any) => (
                                                <option key={idx} value={data.categoryName}>{data.categoryName}</option>
                                            ))}
                                        </select>
                                        {medicineCategoryValidationError && <div className="invalid-feedback">Medicine Category Required.</div>}
                                    </FormGroup>
                                </Col>

                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Medicine Company <span className="text-danger">*</span></label>
                                        <select
                                            className={`form-control ${medicineCompanyValidationError ? 'is-invalid' : ''}`}
                                            value={medicineCompany}
                                            onChange={(e) => handleMedicineCompanyChange(e.target.value)}
                                        >
                                            <option value="">--Select Company--</option>
                                            {medicineCompanyData.map((data: any, idx: any) => (
                                                <option key={idx} value={data.companyName}>{data.companyName}</option>
                                            ))}
                                        </select>
                                        {medicineCompanyValidationError && <div className="invalid-feedback">Medicine Company Required.</div>}
                                    </FormGroup>
                                </Col>

                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Medicine Composition <span className="text-danger">*</span></label>
                                        <Input
                                            id="medicineComposition"
                                            name="medicineComposition"
                                            type="text"
                                            value={medicineComposition}
                                            className={`${medicineCompositionValidationError ? 'is-invalid' : ''}`}
                                            onChange={e => handleMedicineCompositionChange(e.target.value)}
                                        />
                                        {medicineCompositionValidationError && <div className="invalid-feedback">Medicine Composition Required.</div>}
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Medicine Group <span className="text-danger">*</span></label>
                                        <select
                                            className={`${medicineGroupValidationError ? 'is-invalid' : ''} form-control`}
                                            value={medicineGroup}
                                            onChange={(e) => handleMedicineGroupChange(e.target.value)}
                                        >
                                            <option value="">--Select Group--</option>
                                            {medicineGroupData.map((data: any, idx: any) => (
                                                <option key={idx} value={data.medicineGroupName}>{data.medicineGroupName}</option>
                                            ))}
                                        </select>
                                        {medicineGroupValidationError && <div className="invalid-feedback">Medicine Group Required.</div>}
                                    </FormGroup>
                                </Col>

                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Unit <span className="text-danger">*</span></label>
                                        <select
                                            className={`form-control ${unitValidationError ? 'is-invalid' : ''}`}
                                            value={unit}
                                            onChange={(e) => handleMedicineUnitChange(e.target.value)}
                                        >
                                            <option value="">--Select Unit--</option>
                                            {medicineUnitData.map((data: any, idx: any) => (
                                                <option key={idx} value={data.unitName}>{data.unitName}</option>
                                            ))}
                                        </select>
                                        {unitValidationError && <div className="invalid-feedback">Unit Required.</div>}
                                    </FormGroup>
                                </Col>

                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Min Level</label>
                                        <Input
                                            id="minLevel"
                                            name="minLevel"
                                            type="text"
                                            value={minLevel}
                                            onChange={e => handleMinLevel(e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>

                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Re-Order Level </label>
                                        <Input
                                            id="reOrderLevel"
                                            name="reOrderLevel"
                                            type="text"
                                            value={reOrderLevel}
                                            onChange={e => handleReOrderLevel(e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Tax </label>
                                        <Input
                                            id="tax"
                                            name="tax"
                                            type="text"
                                            value={tax}
                                            onChange={e => handleTax(e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>

                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Box/Packing <span className="text-danger">*</span></label>
                                        <Input
                                            id="boxOrPacking"
                                            name="boxOrPacking"
                                            type="text"
                                            value={boxOrPacking}
                                            className={`${boxOrPackingValidationError ? 'is-invalid' : ''}`}
                                            onChange={e => handleboxOrPackingChange(e.target.value)}
                                        />
                                        {boxOrPackingValidationError && <div className="invalid-feedback">Box/Packing Required.</div>}
                                    </FormGroup>
                                </Col>

                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">VAT A/C</label>
                                        <Input
                                            id="vatTax"
                                            name="vatTax"
                                            type="text"
                                            value={vatTax}
                                            onChange={e => handleVatTax(e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>

                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Rack Number</label>
                                        <Input
                                            id="rackNumber"
                                            name="rackNumber"
                                            type="text"
                                            value={rackNumber}
                                            onChange={e => handleRackNumber(e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Note</label>
                                        <Input
                                            id="note"
                                            name="note"
                                            type="text"
                                            value={note}
                                            onChange={e => handleNote(e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>

                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Medicine Photo ( JPG | JPEG | PNG )</label>
                                        <div
                                            style={{
                                                border: '2px dashed #ddd',
                                                padding: '6px',
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                                borderRadius: '5px',
                                            }}
                                            onClick={() => document.getElementById('fileInput')?.click()}
                                        >
                                            {selectedFile ? selectedFile.name : "Drop a file here or click"}
                                        </div>
                                        <Input
                                            id="fileInput"
                                            name="medicinePhoto"
                                            type="file"
                                            accept=".jpg, .jpeg, .png"
                                            style={{ display: 'none' }}
                                            onChange={handleFileUpload}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <hr />

                            <Row>
                                <Col className="text-end">
                                    <Button type="submit">Save</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    );
};
export default EditMedicine