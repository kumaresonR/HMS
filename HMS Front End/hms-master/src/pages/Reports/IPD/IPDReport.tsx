import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    Col,
    Input,
    Label,
    Row,
} from "reactstrap";
import TableContainer from "../../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import ReportApiService from "../../../helpers/services/report/report-api-service";
import AppointmentApiService from "../../../helpers/services/appointment/appointment-api-service";
import { timeDurationData } from "../../../common/data/FakeData";
import ErrorHandler from "../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import moment from "moment";

const IPDReport = () => {
    const reportApiService: ReportApiService = new ReportApiService();
    const appointmentApiServic: AppointmentApiService = new AppointmentApiService();

    const [employeData, setEmployeData] = useState([]);
    const [ipdReportData, setIpdReportData] = useState([]);

    const [doctorId, setDoctorId] = useState('');
    const [timeDuration, setTimeDuration] = useState('');
    const [timeDurationValidationError, setTimeDurationValidationError] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // const totalAmount = ipdReportData.reduce((sum: any, data: any) => sum + (data.amount || 0), 0);

    const ipdReportColumns = [
        {
            header: 'Date',
            accessorKey: 'date',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div>
                    <span className="text-primary">
                        {info.getValue() ? moment(info.getValue()).format('DD/MM/YYYY, h:mm A') : 'N/A'}
                    </span>
                </div>
            ),
        },
        {
            header: 'IPD No',
            accessorKey: 'ipdNo',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue() || 'N/A'}
                </div>
            ),
        },
        {
            header: 'Patient Name',
            accessorKey: 'patientName',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue() || 'N/A'}
                </div>
            ),
        },
        {
            header: 'Age',
            accessorKey: 'age',
            enableColumnFilter: false,
            cell: (info: any) => info.getValue() || 'N/A',
        },
        {
            header: 'Gender',
            accessorKey: 'gender',
            enableColumnFilter: false,
            cell: (info: any) => info.getValue() || 'N/A',
        },
        {
            header: 'Mobile Number',
            accessorKey: 'mobileNumber',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue() || 'N/A'}
                </div>
            ),
        },
        {
            header: 'Guardian Name',
            accessorKey: 'guardianName',
            enableColumnFilter: false,
            cell: (info: any) => info.getValue() || 'N/A',
        },
        {
            header: 'Doctor Name',
            accessorKey: 'doctorName',
            enableColumnFilter: false,
            cell: (info: any) => info.getValue() || 'N/A',
        },
        {
            header: 'Symptoms',
            accessorKey: 'symptoms',
            enableColumnFilter: false,
            cell: (info: any) => info.getValue() || 'N/A',
        },
        {
            header: 'Antenatal',
            accessorKey: 'antenatal',
            enableColumnFilter: false,
            cell: ({ getValue }: any) => getValue() === true ? 'Yes' : getValue() === false ? 'No' : 'N/A',
        },
        {
            header: 'Previous Medical Issue',
            accessorKey: 'previousMedicalIssue',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue() || 'N/A'}
                </div>
            ),
        },
    ];

    const getAllPatientData = async () => {
        try {
            if (!timeDuration) {
                setTimeDurationValidationError(true);
                return [];
            } else {
                setTimeDurationValidationError(false);
            }
            if (timeDuration === "Period" && (!startDate || !endDate)) {
                toast.warning("Start Date and End Date are required for Period", { containerId: 'TR' });
                return [];
            }
            const params = new URLSearchParams();

            if (doctorId) params.append("doctorId", doctorId);
            // if (testName) params.append("testName", testName);
            // if (sampleCollected) params.append("sampleCollected", sampleCollected);
            if (timeDuration && timeDuration !== "Period") {
                params.append("timeDuration", timeDuration);
            }

            if (timeDuration === "Period") {
                params.append("startDate", startDate);
                params.append("endDate", endDate);
            }

            const url = `ipd-reports?${params.toString()}`;
            let result = await reportApiService.getAllIpdReport(url);
            setIpdReportData(result);
            return result || [];
        } catch (error: any) {
            toast.error(error.message, { containerId: 'TR' });
            return [];
        }
    }

    const getEmployeData = async () => {
        try {
            const url = "role=DOCTOR";
            let result = await appointmentApiServic.searchAllEmployee(url);
            setEmployeData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getEmployeData();
    }, []);

    const exportData = async () => {
        try {
            if (!timeDuration) {
                setTimeDurationValidationError(true);
                return [];
            } else {
                setTimeDurationValidationError(false);
            }

            if (timeDuration === "Period" && (!startDate || !endDate)) {
                toast.warning("Start Date and End Date are required for Period", { containerId: 'TR' });
                return [];
            }

            const params = new URLSearchParams();
            if (timeDuration && timeDuration !== "Period") {
                params.append("timeDuration", timeDuration);
            }
            if (timeDuration === "Period") {
                params.append("startDate", startDate);
                params.append("endDate", endDate);
            }

            const url = `?${params.toString()}`;
            const result = await reportApiService.exportIPDReport(url); // should return a Blob

            // Create object URL from the blob
            const blob = new Blob([result], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const objectURL = URL.createObjectURL(blob);

            // Create a temporary <a> element and trigger download
            const link = document.createElement('a');
            link.href = objectURL;
            link.download = 'IPDReport.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Revoke the object URL to free up memory
            URL.revokeObjectURL(objectURL);

            return result;
        } catch (error: any) {
            toast.error(error.message, { containerId: 'TR' });
            return [];
        }
    };


    return (
        <React.Fragment>
            <div>
                <h5 className="card-title mb-4">IPD Report</h5>
                <Row>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="time-duration-input">
                                Time Duration <span className='text-danger'> * </span>
                            </Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="pathology-duration-input"
                                value={timeDuration}
                                onChange={e => setTimeDuration(e.target.value)}
                                invalid={!!timeDurationValidationError}
                            >
                                <option value=''>Select Duration</option>
                                {timeDurationData.map((data, idx) => (
                                    <option key={idx} value={data.code}>{data.duration}</option>
                                ))}
                            </Input>
                            {timeDurationValidationError && <div className="invalid-feedback">Time Duration Required.</div>}
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="doctor-input">
                                Doctor
                            </Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="doctor-input"
                                value={doctorId}
                                onChange={(e) => { setDoctorId(e.target.value) }}
                            >
                                <option value=''>Select Doctor</option>
                                {employeData?.map((data: any, idx: any) => (
                                    <option key={idx} value={data.employeeId}>{data.fullName}</option>
                                ))}
                            </Input>
                        </div>
                    </Col>
                    {timeDuration === 'Period' && (
                        <>
                            <Col lg={4}>
                                <div className="mb-3">
                                    <Label
                                        className="form-label"
                                        htmlFor="DateFrom"
                                    >
                                        Date From
                                    </Label>
                                    <Input
                                        type="date"
                                        className="form-control"
                                        id="DateFrom"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className="mb-3">
                                    <Label
                                        className="form-label"
                                        htmlFor="DateTo"
                                    >
                                        Date To
                                    </Label>
                                    <Input
                                        type="date"
                                        className="form-control"
                                        id="DateTo"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </Col>
                        </>
                    )}
                    {/* <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="from-age-input">
                                From Age
                            </Label>
                            <Input type="select" className="form-control" id="from-age-input">
                                <option>Select Age</option>
                                <option>20</option>
                                <option>30</option>
                                <option>40</option>
                            </Input>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="to-age-input">
                                To Age
                            </Label>
                            <Input type="select" className="form-control" id="to-age-input">
                                <option>Select Age</option>
                                <option>30</option>
                                <option>40</option>
                                <option>50</option>
                            </Input>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="gender-input">
                                Gender
                            </Label>
                            <Input type="select" className="form-control" id="gender-input">
                                <option>Select Gender</option>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </Input>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="symptoms-input">
                                Symptoms
                            </Label>
                            <Input type="select" className="form-control" id="symptoms-input">
                                <option>Select Symptoms</option>
                                <option>Fever</option>
                                <option>Cough</option>
                                <option>Headache</option>
                            </Input>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="findings-input">
                                Findings
                            </Label>
                            <Input type="select" className="form-control" id="findings-input">
                                <option>Select Findings</option>
                                <option>Infection</option>
                                <option>Cold</option>
                                <option>Migraine</option>
                            </Input>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="miscellaneous-input">
                                Miscellaneous
                            </Label>
                            <Input type="select" className="form-control" id="miscellaneous-input">
                                <option>Select Miscellaneous</option>
                                <option>None</option>
                                <option>Diabetes</option>
                                <option>Asthma</option>
                            </Input>
                        </div>
                    </Col> */}
                </Row>

                <Row>
                    <Col lg={12} className="px-0">
                        <Card id="ipdReportTable">
                            <CardHeader className="border-0">
                                <Row className="g-4">
                                    <div className="col-sm">
                                        {/* <div className="p-2 border ">
                                            <h5 className="text-danger">Total Summary</h5>
                                            <p><strong>Total Amount:</strong> {totalAmount}</p>
                                        </div> */}
                                    </div>

                                    <div className="col-sm-auto">
                                        <div>
                                            <button type="button" onClick={getAllPatientData}
                                                className="btn btn-primary">
                                                Search
                                            </button>
                                        </div>
                                    </div>
                                </Row>
                            </CardHeader>
                            <div className="card-body pt-0">
                                <div className="col-sm-auto">
                                    {ipdReportData?.length > 0 && (
                                        <div className='text-end py-3'>
                                            <button type="button" className="btn btn-success" onClick={() => exportData()}>
                                                <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                Export
                                            </button>
                                        </div>
                                    )}
                            </div>
                            </div>
                            <div className="card-body pt-0">
                                <TableContainer
                                    columns={ipdReportColumns}
                                    data={ipdReportData}
                                    isGlobalFilter={true}
                                    isCustomerFilter={true}
                                    customPageSize={5}
                                    tableClass="table table-bordered"
                                    theadClass="thead-light"
                                    divClass="table-responsive"
                                />
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </React.Fragment>
    );
};

export default IPDReport;
