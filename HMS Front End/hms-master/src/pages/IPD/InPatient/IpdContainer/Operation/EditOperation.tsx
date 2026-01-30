import { useEffect, useState } from "react";
import { Button, Col, Container, Form, FormGroup, Input, Row } from "reactstrap";
import ErrorHandler from "../../../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import IPDApiService from "../../../../../helpers/services/ipd/ipd-api-service";
import AppointmentApiService from "../../../../../helpers/services/appointment/appointment-api-service";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import OPDApiService from "../../../../../helpers/services/opd/opd-api-service";

const EditOperation = (props: any) => {
    const appointmentApiServic: AppointmentApiService = new AppointmentApiService();
    const ipdApiService: IPDApiService = new IPDApiService();
    const opdApiService: OPDApiService = new OPDApiService();

    const [ipdId, setIpdId] = useState('');
    const [opdId, setOpdId] = useState('');
    const [patientId, setPatientId] = useState('');
    const [operationCategory, setOperationCategory] = useState('');
    const [operationCategoryValidationError, setOperationCategoryValidationError] = useState(false);
    const [operationName, setOperationName] = useState('');
    const [consultantDoctorValidationError, setConsultantDoctorValidationError] = useState(false);
    const [operationDate, setOperationDate] = useState('');
    const [operationNameValidationError, setOperationNameValidationError] = useState(false);
    const [consultantDoctor, setConsultantDoctor] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState<any[]>([]);
    const [operationDateValidationError, setOperationDateValidationError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<any[]>([]);
    const [assistantConsultantOne, setAssistantConsultantOne] = useState('');
    const [assistantConsultantTwo, setAssistantConsultantTwo] = useState('');
    const [anesthetist, setAnesthetist] = useState('');
    const [anesthesiaType, setAnesthesiaType] = useState('');
    const [OTTechnician, setOTTechnician] = useState('');
    const [OTAssistant, setOTAssistant] = useState('');
    const [remark, setRemark] = useState('');
    const [result, setResult] = useState('');
    const [operationId,setOperationId] = useState('');

    const handleOperationCategoryChange = (value: any) => {
        setOperationCategory(value);
        setOperationCategoryValidationError(false);
    }

    const handleOperationNameChange = (value: any) => {
        setOperationName(value);
        setOperationNameValidationError(false);
    }

    const handleOperationDateChange = (value: any) => {
        setOperationDate(value);
        setOperationDateValidationError(false);
    }

    const onSearch = async (query: any) => {
        setIsLoading(true);
        try {
            let url = "role=DOCTOR&department=&searchTerm=" + query
            let result = await appointmentApiServic.searchAllEmployee(url);
            console.log("search result", result);
            setOptions(result)
        } catch (error) {
            console.log("Patient search Error");
        } finally {
            setIsLoading(false);
        }
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!operationCategory) {
            setOperationCategoryValidationError(true);
            isFormValid = false;
        }

        if (!operationName) {
            setOperationNameValidationError(true);
            isFormValid = false;
        }

        if (!operationDate) {
            setOperationDateValidationError(true);
            isFormValid = false;
        }

        if (!consultantDoctor) {
            setConsultantDoctorValidationError(true);
            isFormValid = false;
        }

        return isFormValid;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            doCreateOperation();
        }
    }

    const doCreateOperation = async () => {
        try {
            let payload: any = {
                patientId: patientId,
                doctorId: consultantDoctor,
                operationCategory: operationCategory,
                operationName: operationName,
                operationDate: operationDate,
                assistantConsultant1: assistantConsultantOne || 'NA',
                assistantConsultant2: assistantConsultantTwo || 'NA',
                anesthetist: anesthetist || 'NA',
                anesthesiaType: anesthesiaType || 'NA',
                otTechnician: OTTechnician || 'NA',
                otAssistant: OTAssistant || 'NA',
                remark: remark || 'NA',
                result: result || 'NA'
            }
            if (props.title === 'ipd') {
                payload.ipdId = ipdId;
            } else {
                payload.opdId = opdId;
            }
            if (props.title === 'ipd') {
                await ipdApiService.editOperation(operationId, payload);
            } else {
                await opdApiService.editOperation(operationId, payload);
            }
            toast.success('Operation Updated Successfully', { containerId: 'TR' });
            props.handleClose();
            props.refresh();
        } catch (error: any) {
            console.log("Operation Failed", error);
            return ErrorHandler(error)
        }
    }

    const setOperationData = (data: any) => {
        if (props.title === 'ipd') {
            setIpdId(props?.data?.admissions?.ipdId);
        } else {
            setOpdId(props?.data?.admissions?.opdId);
        }
        setOperationId(data.operationId);
        setPatientId(data.patientId);
        setOperationCategory(data.operationCategory);
        setOperationName(data.operationName);
        setOperationDate(data.operationDate);
        setAssistantConsultantOne(data.assistantConsultant1);
        setAssistantConsultantTwo(data.assistantConsultant2);
        setAnesthetist(data.anesthetist);
        setAnesthesiaType(data.anesthesiaType);
        setOTTechnician(data.otTechnician);
        setOTAssistant(data.otAssistant);
        setRemark(data.remark);
        setResult(data.result);
        if (data.doctor) {
            const doctor = {
                employeeId: data.doctorId,
                fullName: `${data.doctor.firstName} ${data.doctor.lastName}`,
            };
            setOptions([doctor]);
            setSelectedDoctor([doctor]);
            setConsultantDoctor(data.doctorId);
        } else {
            setSelectedDoctor([]);
            setConsultantDoctor('');
        }
    }

    useEffect(() => {
        setOperationData(props.id);
    }, []);

    return <>
        <Container fluid>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <label className="text-start mb-2">Operation Category <span className="text-danger">*</span></label>
                            <Input className={` ${operationCategoryValidationError ? 'is-invalid' : ''}`}
                                id="OperationCategory"
                                name="Operation Category"
                                type="text"
                                value={operationCategory}
                                onChange={e => handleOperationCategoryChange(e.target.value)}
                            />
                            {operationCategoryValidationError && <div className="invalid-feedback">Operation Category Required.</div>}
                        </FormGroup>
                    </Col>

                    <Col md={6}>
                        <FormGroup>
                            <label className="text-start mb-2">Operation Name <span className="text-danger">*</span></label>
                            <Input className={` ${operationNameValidationError ? 'is-invalid' : ''}`}
                                id="operationName"
                                name="operationName"
                                type="text"
                                value={operationName}
                                onChange={e => handleOperationNameChange(e.target.value)}
                            />
                            {operationNameValidationError && <div className="invalid-feedback">Operation Name Required.</div>}
                        </FormGroup>
                    </Col>

                    <Col md={6}>
                        <FormGroup>
                            <label className="text-start mb-2">Operation Date <span className="text-danger">*</span></label>
                            <Input className={` ${operationDateValidationError ? 'is-invalid' : ''}`}
                                id="OperationDate"
                                name="Operation Date"
                                type="datetime-local"
                                value={operationDate}
                                onChange={e => handleOperationDateChange(e.target.value)}
                            />
                            {operationDateValidationError && <div className="invalid-feedback">Operation Date Required.</div>}
                        </FormGroup>
                    </Col>

                    <Col md={6}>
                        <label className="text-start mb-2">Consultant Doctor<span className="text-danger">*</span></label>
                        <AsyncTypeahead
                            filterBy={() => true}
                            id="patient-id-search-box"
                            className={` ${consultantDoctorValidationError ? 'is-invalid' : ''}`}
                            isLoading={isLoading}
                            labelKey="fullName"
                            minLength={1}
                            options={options}
                            onSearch={onSearch}
                            onChange={(selectedItem: any) => {
                                if (selectedItem.length > 0) {
                                    const doctorId = selectedItem[0].employeeId;
                                    setConsultantDoctor(doctorId);
                                    setSelectedDoctor(selectedItem);
                                    setConsultantDoctorValidationError(false);
                                } else {
                                    setConsultantDoctor('');
                                    setSelectedDoctor([]);
                                    setConsultantDoctorValidationError(true);
                                }
                            }}
                            placeholder="Search by Doctor Name or Id"
                            selected={selectedDoctor}
                        />
                        {consultantDoctorValidationError && <div className="invalid-feedback">Consultant Doctor Required.</div>}
                    </Col>

                    <Col md={6}>
                        <FormGroup>
                            <label className="text-start mb-2">Assistant Consultant 1 </label>
                            <Input
                                id="AssistantConsultant-1"
                                name="Assistant Consultant 1"
                                type="text"
                                value={assistantConsultantOne}
                                onChange={e => setAssistantConsultantOne(e.target.value)}
                            />
                        </FormGroup>
                    </Col>

                    <Col md={6}>
                        <FormGroup>
                            <label className="text-start mb-2">Assistant Consultant 2 </label>
                            <Input
                                id="AssistantConsultant-1"
                                name="AssistantConsultant-1"
                                type="text"
                                value={assistantConsultantTwo}
                                onChange={e => setAssistantConsultantTwo(e.target.value)}
                            />
                        </FormGroup>
                    </Col>

                    <Col md={6}>
                        <FormGroup>
                            <label className="text-start mb-2">Anesthetist</label>
                            <Input
                                id="Anesthetist"
                                name="Anesthetist"
                                type="text"
                                value={anesthetist}
                                onChange={e => setAnesthetist(e.target.value)}
                            />
                        </FormGroup>
                    </Col>

                    <Col md={6}>
                        <FormGroup>
                            <label className="text-start mb-2">Anesthesia Type</label>
                            <Input
                                id="Anesthesia Type"
                                name="Anesthesia Type"
                                type="text"
                                value={anesthesiaType}
                                onChange={e => setAnesthesiaType(e.target.value)}
                            />
                        </FormGroup>
                    </Col>

                    <Col md={6}>
                        <FormGroup>
                            <label className="text-start mb-2">OT Technician</label>
                            <Input
                                id="OT-Technician"
                                name="OT Technician"
                                type="text"
                                value={OTTechnician}
                                onChange={e => setOTTechnician(e.target.value)}
                            />
                        </FormGroup>
                    </Col>

                    <Col md={6}>
                        <FormGroup>
                            <label className="text-start mb-2">OT Assistant</label>
                            <Input
                                id="OTAssistant"
                                name="OTAssistant"
                                type="text"
                                value={OTAssistant}
                                onChange={e => setOTAssistant(e.target.value)}
                            />
                        </FormGroup>
                    </Col>

                    <Col md={6}>
                        <FormGroup>
                            <label className="text-start mb-2">Remark</label>
                            <textarea className="form-control"
                                id="Remark"
                                name="Remark"
                                value={remark}
                                onChange={e => setRemark(e.target.value)}
                            />
                        </FormGroup>
                    </Col>

                    <Col md={6}>
                        <FormGroup>
                            <label className="text-start mb-2">Result</label>
                            <textarea className="form-control"
                                id="Result"
                                name="Result"
                                value={result}
                                onChange={e => setResult(e.target.value)}
                            />
                        </FormGroup>
                    </Col>

                    <Col className="text-end">
                        <Button color="primary">Save</Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    </>
}
export default EditOperation