import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { Button, Col, Container, Form, FormGroup, Input, InputGroup, InputGroupText, Label, Row, Spinner, Table } from 'reactstrap';
import ErrorHandler from '../../helpers/ErrorHandler';
import AppointmentApiService from '../../helpers/services/appointment/appointment-api-service';
import BillingApiService from '../../helpers/services/billing/billing-api-service';

const AddPathologyLabReport = (props: any) => {
    const billingApiService: BillingApiService = new BillingApiService();
    const appointmentApiServic: AppointmentApiService = new AppointmentApiService();

    console.log("props", props.data)
    const data = props.data;
    const [personName, setPersonName] = useState('');
    const [personNameValidationError, setPersonNameValidationError] = useState(false);
    const [result, setResult] = useState('');
    const [collectedDateValidationError, setCollectedDateValidationError] = useState(false);
    const [collectedDate, setCollectedDate] = useState('');
    const [employeData, setEmployeData] = useState([]);
    const [documentFile, setDocument] = useState<any>();
    const [reportValueErrors, setReportValueErrors] = useState<any>({});
    const [pathologydata, setPathologydata] = useState([]);
    const [testParameterData, setTestParameterData] = useState([]);
    const [loading, setLoading] = useState(false);

    const handlePersonNameChange = (value: any) => {
        setPersonName(value);
        setPersonNameValidationError(false);
    }

    const handleCollectedDateChange = (value: any) => {
        setCollectedDate(value);
        setCollectedDateValidationError(false);
    }

    const onFileUploadListener = (event: any) => {
        const file = event.target.files[0];
        setDocument(file);
    }

    const handleReportValueChange = (value: any, idx: any) => {
        console.log(`Updating index ${idx} with value:`, value);

        setTestParameterData(prevData => {
            const updatedData: any = [...prevData];
            updatedData[idx] = { ...updatedData[idx], reportValue: value };
            return updatedData;
        });
    };


    const getEmployeData = async () => {
        try {
            let url = "role=PATHOLOGIST"
            let result = await appointmentApiServic.searchAllEmployee(url);
            setEmployeData(result);
        } catch (error: any) {
            console.log("getEmployeData error");
            return ErrorHandler(error)
        }
    }

    const getPathologyByTestId = async () => {
        try {
            let url = props.data.testId;
            let result = await billingApiService.getPathologyByTestId(url);
            setPathologydata(result.pathologyItems);
            if (result.pathologyItems && result.pathologyItems.length > 0) {
                // Pass the first item of pathologyItems to setData
                setData(result.pathologyItems[0]);
            }
            const testParameters = result.pathologyItems
                .flatMap((item: any) => item.pathologyTestDetails?.testParameters || []);
            setTestParameterData(testParameters);

            console.log(testParameters);
        } catch (error: any) {
            console.error("Error in getPathologyByTestId:", error);
            return ErrorHandler(error);
        }
    };

    const setData = (data: any) => {
        setPersonName(data.approvedBy);
        setCollectedDate(data.approvedDate);
        setResult(data.result);
        const testParameters = data.pathologyTestDetails?.testParameters || [];
        setTestParameterData(testParameters);
        console.log("Initial test parameter data:", testParameters);
    }

    const validateForm = () => {
        let isFormValid = true;
        let errors: any = {};

        if (!personName) {
            setPersonNameValidationError(true);
            isFormValid = false;
        }

        if (!collectedDate) {
            setCollectedDateValidationError(true);
            isFormValid = false;
        }

        setReportValueErrors(errors);
        return isFormValid;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            doCreateLabReport();
        }
    };

    const doCreateLabReport = async () => {
        try {
            setLoading(true);
            let formData: FormData = new FormData();
            let payload: any = {
                approvedBy: personName,
                approvedDate: collectedDate,
                result: result || 'NA',
                parameters: testParameterData
            }
            console.log("paylod", payload)
            const jsonBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            formData.append('testData', jsonBlob);
            formData.append('uploadReport', documentFile);
            await billingApiService.approvePathologyReport(props.data.testId, formData);
            toast.success('Approved Successfully', { containerId: 'TR' });
            props.handleClose();
            props.close();
        } catch (error: any) {
            console.log("Sample Collected Failed", error);
            return ErrorHandler(error)
        } finally {
            setLoading(false); 
        }
    }

    useEffect(() => {
        getEmployeData();
        getPathologyByTestId();
    }, [])

    return (
        <React.Fragment>
            <Container fluid>
                <Row>
                    <Col>
                        <Row>
                            <Col><Label>Test Name</Label></Col>
                            <Col><Label>{data.pathologyDetails?.testName || 'NA'}</Label></Col>
                        </Row>
                        <Row>
                            <Col><Label>Approve Date</Label></Col>
                            <Col><Label>{data.approvedDate || 'NA'}</Label></Col>
                        </Row>
                        <Row>
                            <Col><Label>Collection By</Label></Col>
                            <Col><Label>{data.sampleCollected || 'NA'}</Label></Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <Col><Label>Expected Date</Label></Col>
                            <Col><Label>{data.approvedDate || 'NA'}</Label></Col>
                        </Row>
                        <Row>
                            <Col><Label>Date Of Collection</Label></Col>
                            <Col><Label>{data.collectedDate || 'NA'}</Label></Col>
                        </Row>
                        <Row>
                            <Col><Label>Pathology Center</Label></Col>
                            <Col><Label>{data.pathologyCenter || 'NA'}</Label></Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <label className="text-start mb-2">Approved By  <span className="text-danger">*</span></label>
                                    <select
                                        className={`${personNameValidationError ? 'is-invalid' : ''} form-control`}
                                        value={personName}
                                        onChange={(e) => { handlePersonNameChange(e.target.value) }}
                                    >
                                        <option value="">--Select--</option>
                                        {employeData.map((data: any, idx: any) => (
                                            <option key={idx} value={data.fullName}>{data.fullName}</option>
                                        ))}
                                    </select>
                                    {personNameValidationError && <div className="invalid-feedback">Approved By Required.</div>}
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <label className="text-start mb-2">Approve Date <span className="text-danger">*</span></label>
                                    <Input className={`${collectedDateValidationError ? 'is-invalid' : ''}`}
                                        id="collectedDate"
                                        name="collectedDate"
                                        type="date"
                                        value={collectedDate}
                                        onChange={e => handleCollectedDateChange(e.target.value)}
                                    />
                                    {collectedDateValidationError && <div className="invalid-feedback">Approve Date Required.</div>}
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <label className="text-start mb-2">Attach Document</label>
                                    <Input
                                        type="file"
                                        className="form-control"
                                        id="attachment"
                                        accept="application/pdf"
                                        onChange={onFileUploadListener}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={12}>
                                <div className="mb-3">
                                    <Label htmlFor="Result" className="form-label ">Result</Label>
                                    <textarea
                                        id="Result"
                                        name="Result"
                                        rows={3}
                                        value={result}
                                        className={`form-control`}
                                        onChange={e => setResult(e.target.value)}
                                    />
                                </div>
                            </Col>
                        </Row>

                        <div className="table-responsive">
                            <Table hover className="table-centered table-bordered align-middle table-nowrap mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>#</th>
                                        <th>Test Parameter Name</th>
                                        <th>Report Value <span className='text-danger'>*</span></th>
                                        <th>Reference Range</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {testParameterData?.map((data: any, idx: any) => (
                                        <tr key={idx}>
                                            <td>{idx + 1}</td>
                                            <td>
                                                <span>
                                                    <h6>{data.parameterName || "NA"}</h6>
                                                    {/* <span className='text-muted' style={{ fontSize: '0.6rem' }}>
                                                        Description: Magnetic resonance imaging (MRI) is a medical imaging technique used in radiology to form pictures of the anatomy and the physiological processes of the body. MRI scanners use strong magnetic fields, magnetic field gradients, and radio waves to generate images of the organs in the body.
                                                    </span> */}
                                                </span>
                                            </td>
                                            <td>
                                                <span>
                                                    <InputGroup>
                                                        <Input id="ReportValue"
                                                            className={`${reportValueErrors[idx] ? 'is-invalid' : ''}`}
                                                            value={data.reportValue || ""}
                                                            onChange={e => handleReportValueChange(e.target.value, idx)}
                                                        />
                                                        <InputGroupText>
                                                            {data.unit || "NA"}
                                                        </InputGroupText>
                                                        {reportValueErrors[idx] && (
                                                            <div className="invalid-feedback">Report Value is required.</div>
                                                        )}
                                                    </InputGroup>
                                                </span>
                                            </td>
                                            <td>{data.normalRange || 'NA'}</td>
                                        </tr>
                                    ))}

                                </tbody>
                            </Table>
                        </div>

                        <Col className="text-end my-2">
                            <Button disabled={loading}
                                color="primary"
                                className="btn btn-primary ms-3" >
                                {loading ? <Spinner size="sm" /> : 'Save'}
                            </Button>
                        </Col>
                    </Form>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default AddPathologyLabReport