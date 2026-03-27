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
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import ReportApiService from "../../../helpers/services/report/report-api-service";
import AppointmentApiService from "../../../helpers/services/appointment/appointment-api-service";
import { toast } from "react-toastify";
import ErrorHandler from "../../../helpers/ErrorHandler";
import { timeDurationData } from "../../../common/data/FakeData";

const IPDDischargedPatient = () => {
    const reportApiService: ReportApiService = new ReportApiService();
    const appointmentApiServic: AppointmentApiService = new AppointmentApiService();

    const [employeData, setEmployeData] = useState([]);
    const [ipdDischargedPatientData, setIpdDischargedPatientData] = useState([]);

    const [doctorId, setDoctorId] = useState('');
    const [timeDuration, setTimeDuration] = useState('');
    const [timeDurationValidationError, setTimeDurationValidationError] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [dischargeStatus, setDischargeStatus] = useState('');
    const [miscellaneous, setMiscellaneous] = useState('');

    const ipdDischargedPatientColumns = [
        {
            header: 'Patient Name',
            accessorKey: 'patientName',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary">
                    {info.getValue()}

                </div>
            ),
        },
        {
            header: 'IPD No',
            accessorKey: 'ipdNo',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary">
                    {info.getValue()}

                </div>
            ),
        },
       
        {
            header: 'Gender',
            accessorKey: 'gender',
            enableColumnFilter: false,

        },
        {
            header: 'Phone',
            accessorKey: 'phone',
            enableColumnFilter: false,

        },
        {
            header: 'Antenatal',
            accessorKey: 'antenatal',
            enableColumnFilter: false,

        },
        {
            header: 'Consultant Doctor',
            accessorKey: 'consultant',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary">
                    {info.getValue()}

                </div>
            ),
        },
        {
            header: 'Bed',
            accessorKey: 'bed',
            enableColumnFilter: false,

        },
        {
            header: 'Admission Date',
            accessorKey: 'admissionDate',
            enableColumnFilter: false,

        },
        {
            header: 'Discharged Date',
            accessorKey: 'dischargedDate',
            enableColumnFilter: false,

        },
        {
            header: 'Discharge Status',
            accessorKey: 'dischargeStatus',
            enableColumnFilter: false,
            cell: (info: any) => {
                const value = info.getValue();
                let badgeClass = "badge bg-secondary-subtle text-secondary";
                let displayText = "Not Specified";

                if (value === "Discharged") {
                    badgeClass = "badge bg-success-subtle text-success";
                    displayText = "Discharged";
                } else if (value === "Not Discharged") {
                    badgeClass = "badge bg-danger-subtle text-danger";
                    displayText = "Not Discharged";
                } else if (value === "Pending") {
                    badgeClass = "badge bg-warning-subtle text-warning";
                    displayText = "Pending";
                }

                return (
                    <div className="text-center">
                        <span className={badgeClass}>
                            {displayText}
                        </span>
                    </div>
                );
            },
        },
        {
            header: 'Total Admit Days',
            accessorKey: 'admitDays',
            enableColumnFilter: false,

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

            const url = `search?${params.toString()}`;
            let result = await reportApiService.getAllIpdDischargeReport(url);
            setIpdDischargedPatientData(result);
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

    return (
        <React.Fragment>
            <div>
                <h5 className="card-title mb-4">IPD Discharged Patient</h5>
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
                                    <option key={idx} value={data.staffId}>{data.fullName}</option>
                                ))}
                            </Input>
                        </div>
                    </Col>
                    {/* <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="from-age-input">
                                From Age
                            </Label>
                            <Input type="select" className="form-control" id="from-age-input">
                                <option>Select Age</option>
                                <option>0-10</option>
                                <option>11-20</option>
                                <option>21-30</option>
                            </Input>
                        </div>
                    </Col> */}

                    {/* <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="to-age-input">
                                To Age
                            </Label>
                            <Input type="select" className="form-control" id="to-age-input">
                                <option>Select Age</option>
                                <option>10-20</option>
                                <option>21-30</option>
                                <option>31-40</option>
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
                    </Col> */}
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="discharge-status-input">
                                Discharge Status
                            </Label>
                            <Input type="select" className="form-control" id="discharge-status-input">
                                <option>Select Status</option>
                                <option>Discharged</option>
                                <option>Not Discharged</option>
                            </Input>
                        </div>
                    </Col>
                    {/* <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="miscellaneous-input">
                                Miscellaneous
                            </Label>
                            <Input type="select" className="form-control" id="miscellaneous-input">
                                <option>Select Option</option>
                                <option>Option 1</option>
                                <option>Option 2</option>
                                <option>Option 3</option>
                            </Input>
                        </div>
                    </Col> */}
                </Row>

                <Row>
                    <Col lg={12} className="px-0">
                        <Card id="ipdDischargedPatientReport">
                            <CardHeader className="border-0">
                                <Row className="g-4 align-items-center">
                                    <div className="col-sm">

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
                                <TableContainer
                                    columns={ipdDischargedPatientColumns}
                                    data={ipdDischargedPatientData}
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

export default IPDDischargedPatient;
