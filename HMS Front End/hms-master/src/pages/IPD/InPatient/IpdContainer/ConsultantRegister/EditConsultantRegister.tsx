import { useEffect, useState } from "react";
import { Button, Col, Container, Form, FormGroup, Input, Row } from "reactstrap";
import AppointmentApiService from "../../../../../helpers/services/appointment/appointment-api-service";
import IPDApiService from "../../../../../helpers/services/ipd/ipd-api-service";
import ErrorHandler from "../../../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import { AsyncTypeahead } from "react-bootstrap-typeahead";

const EditConsultantRegister = (props: any) => {
    const appointmentApiServic: AppointmentApiService = new AppointmentApiService();
    const ipdApiService: IPDApiService = new IPDApiService();

    const [appliedDate, setAppliedDate] = useState('');
    const [appliedDateValidationError, setAppliedDateValidationError] = useState(false);
    const [consultantDate, setConsultantDate] = useState('');
    const [consultantDateValidationError, setConsultantDateValidationError] = useState(false);
    const [consultantDoctor, setConsultantDoctor] = useState('');
    const [consultantDoctorValidationError, setConsultantDoctorValidationError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<any[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<any[]>([]);
    const [instruction, setInstruction] = useState('');
    const [ipdNo, setIpdNo] = useState('');

    const handleAppliedDate = (value: any) => {
        setAppliedDate(value);
        setAppliedDateValidationError(false);
    }

    const handleConsultantDateChange = (value: any) => {
        setConsultantDate(value);
        setConsultantDateValidationError(false);
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

        if (!appliedDate) {
            setAppliedDateValidationError(true);
            isFormValid = false;
        }

        if (!consultantDate) {
            setConsultantDateValidationError(true);
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
            doUpdateConsultantRegister();
        }
    }

    const doUpdateConsultantRegister = async () => {
        try {
            let payload: any = {
                ipdId: props?.data?.admissions?.ipdId,
                doctorId: consultantDoctor,
                appliedDate: appliedDate,
                instruction: instruction,
                consultantDate: consultantDate
            }
            await ipdApiService.editConsultantRegister(props.id, payload);
            toast.success('Consultant Register Updated Successfully', { containerId: 'TR' });
            props.handleClose();
            props.refresh();
        } catch (error: any) {
            console.log("ConsultantRegister Failed", error);
            return ErrorHandler(error)
        }
    }

    const getConsultantRegisterById = async () => {
        try {
            let data = await ipdApiService.getConsultantRegisterById(props.id);
            setConsultantData(data);
            console.log('ConsultantRegister data', data);
        } catch (error) {
            console.log(error);
        }
    }

    const setConsultantData = (data: any) => {
        setIpdNo(data.ipdId);
        setAppliedDate(data.appliedDate);
        setInstruction(data.instruction);
        setConsultantDate(data.consultantDate);
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
        getConsultantRegisterById();
    }, []);

    return <>
        <Container fluid>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={4}>
                        <FormGroup>
                            <label className="text-start mb-2">Applied Date<span className="text-danger">*</span> </label>
                            <Input
                                id="AppliedDate"
                                name="AppliedDate"
                                type="date"
                                className={` ${appliedDateValidationError ? 'is-invalid' : ''}`}
                                value={appliedDate}
                                onChange={e => handleAppliedDate(e.target.value)}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <label className="text-start mb-2">Consultant Date<span className="text-danger">*</span></label>
                            <Input
                                id="ConsultantDate"
                                name="ConsultantDate"
                                type="date"
                                className={` ${consultantDateValidationError ? 'is-invalid' : ''}`}
                                value={consultantDate}
                                onChange={e => handleConsultantDateChange(e.target.value)}
                            />
                            {consultantDateValidationError && <div className="invalid-feedback">Consultant Date Required.</div>}
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <label className="text-start mb-2">Consultant Doctor<span className="text-danger">*</span></label>
                        <AsyncTypeahead
                            filterBy={() => true}
                            id="doctor-id-search-box"
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

                    <Col md={12}>
                        <FormGroup>
                            <label className="text-start mb-2">Instruction </label>
                            <textarea className="form-control"
                                id="Instruction"
                                name="Instruction"
                                value={instruction}
                                onChange={e => setInstruction(e.target.value)}
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
export default EditConsultantRegister