import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ErrorHandler from "../../../helpers/ErrorHandler";
import { Button, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import EmployeeApiService from "../../../helpers/services/employee/EmployeeApiService";

const EditStaffTimeLine = (props: any) => {
    const employeeApiService: EmployeeApiService = new EmployeeApiService();

    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [titleValidationError, setTitleValidationError] = useState(false);
    const [date, setDate] = useState('');
    const [dateValidationError, setDateValidationError] = useState(false);
    const [documentFile, setDocument] = useState<any>();
    const [employeeId, setEmployeeId] = useState('');

    const getTimeLine = async () => {
        try {
            let data = await employeeApiService.getAllTimeline(props.id);
            setTimeLineData(data);
        } catch (error) {
            console.log(error);
        }
    }

    const setTimeLineData = (data: any) => {
        setDescription(data.description);
        setTitle(data.title);
        setDate(data.date)
        setDocument(data.document);
        setEmployeeId(data.employeeId)
    }

    const handleTitleChange = (value: any) => {
        setTitle(value);
        setTitleValidationError(false);
    }

    const handleDateChange = (value: any) => {
        setDate(value);
        setDateValidationError(false);
    }

    const onProductUploadListener = (event: any) => {
        const file = event.target.files[0];
        setDocument(file);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!title) {
            setTitleValidationError(true);
            isFormValid = false;
        }

        if (!date) {
            setDateValidationError(true);
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
                date: date,
                description: description,
                title: title,
                employeeId : employeeId,
            };
            const jsonBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            console.log(jsonBlob)
            formData.append('timelineData', jsonBlob);
            formData.append('document', documentFile);
            await employeeApiService.editTimeline(props.id, formData);
            toast.success('Timeline Updated Successfully', { containerId: 'TR' });
            props.handleColse();
            props.refresh();
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getTimeLine();
    }, []);
    
    return <>
        <Container fluid>
            <Row>
                <Form>
                    <Row>
                        <Col md={12}>
                            <FormGroup>
                                <label className="text-start mb-2">Title  <span className="text-danger">*</span></label>
                                <Input
                                    id="Title"
                                    name="Title"
                                    type="text"
                                    value={title}
                                    className={`${titleValidationError ? 'is-invalid' : ''}`}
                                    onChange={e => handleTitleChange(e.target.value)}
                                />
                                {titleValidationError && <div className="invalid-feedback">Title Required.</div>}
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <label className="text-start mb-2">Date <span className="text-danger">*</span></label>
                                <Input
                                    id="date"
                                    name="date"
                                    type="date"
                                    className={`${dateValidationError ? 'is-invalid' : ''}`}
                                    onChange={e => handleDateChange(e.target.value)}
                                    value={date}
                                />
                                {dateValidationError && <div className="invalid-feedback">Date Required.</div>}
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <label className="text-start mb-2">Description</label>
                                <textarea
                                    className={`form-control`}
                                    id="Description"
                                    name="Description"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <Label>Attach Document</Label>
                            <Input
                                type="file"
                                className="form-control"
                                id="attachment"
                                onChange={onProductUploadListener}
                            />
                        </Col>
                    </Row>
                    {/* <Row>
                        <Col>
                            <div className="form-check form-check-right">
                                <Input className="form-check-input" defaultChecked
                                    type="checkbox" id="visible" />
                                <Label className="form-check-label">Visible to this person</Label>
                            </div>
                        </Col>
                    </Row> */}
                    <Col className='text-end'>
                        <Button onClick={handleSubmit} color="primary">Update</Button>
                    </Col>
                </Form>
            </Row>
        </Container>
    </>
}
export default EditStaffTimeLine