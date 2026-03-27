import React, { useState } from "react";
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
import PaidBalanceChart from './PaidBalanceChart'
import { timeDurationData } from "../../../common/data/FakeData";
import { genderData } from "../../../common/data/IpdData";
import ReportApiService from "../../../helpers/services/report/report-api-service";
import { toast } from "react-toastify";

const IPDBalanceReport = () => {
    const reportApiService: ReportApiService = new ReportApiService();
    // const appointmentApiServic: AppointmentApiService = new AppointmentApiService();
    // const billingApiService: BillingApiService = new BillingApiService();

    const [ipdBalanceData, setIpdBalanceData] = useState<any>([]);
    const [ipdPatientData, setIpdPatientData] = useState<any[]>([]);
    const [employeData, setEmployeData] = useState([]);

    const [categoryName, setCategoryName] = useState('');
    const [testName, setTestName] = useState('');
    const [sampleCollected, setSampleCollected] = useState('');
    const [timeDuration, setTimeDuration] = useState('');
    const [timeDurationValidationError, setTimeDurationValidationError] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const totalAmount = ipdBalanceData.reduce((sum: any, data: any) => sum + (data.amount || 0), 0);

    const ipdBalanceColumns = [
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
            header: 'Age',
            accessorKey: 'age',
            enableColumnFilter: false,

        },
        {
            header: 'Gender',
            accessorKey: 'gender',
            enableColumnFilter: false,

        },
        {
            header: 'Antenatal',
            accessorKey: 'antenatal',
            enableColumnFilter: false,

        },
        {
            header: 'Mobile Number',
            accessorKey: 'phone',
            enableColumnFilter: false,

        },
        {
            header: 'Guardian Name',
            accessorKey: 'guardianName',
            enableColumnFilter: false,

        },
        {
            header: 'Discharged Status',
            accessorKey: 'discharged',
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
            header: 'Patient Active',
            accessorKey: 'patientActive',
            enableColumnFilter: false,

        },
        {
            header: 'Net Amount',
            accessorKey: 'netAmount',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary">
                    {info.getValue()}

                </div>
            ),
        },
        {
            header: 'Paid Amount',
            accessorKey: 'paidAmount',
            enableColumnFilter: false,

        },
        {
            header: 'Balance Amount',
            accessorKey: 'balanceAmount',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-danger ">{info.getValue()}
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

            if (categoryName) params.append("categoryName", categoryName);
            if (testName) params.append("testName", testName);
            if (sampleCollected) params.append("sampleCollected", sampleCollected);
            if (timeDuration && timeDuration !== "Period") {
                params.append("timeDuration", timeDuration);
            }

            if (timeDuration === "Period") {
                params.append("startDate", startDate);
                params.append("endDate", endDate);
            }

            const url = `search?${params.toString()}`;
            let result = await reportApiService.getAllIpdBalanceReport(url);
            setIpdPatientData(result);
            return result || [];
        } catch (error: any) {
            toast.error(error.message, { containerId: 'TR' });
            return [];
        }
    }

    // const getEmployeData = async () => {
    //     try {
    //         const url = "role=PATHOLOGIST";
    //         let result = await appointmentApiServic.searchAllEmployee(url);
    //         setEmployeData(result);
    //     } catch (error: any) {
    //         return ErrorHandler(error)
    //     }
    // }

    // const getAllPathologyTest = async () => {
    //     try {
    //         let url = "all"
    //         let result = await billingApiService.getPathologyTest(url);
    //         setPathologyTestData(result);
    //     } catch (error: any) {
    //         console.log(error);
    //     }
    // }

    // useEffect(() => {
    //     getEmployeData();
    //     getAllPathologyTest();
    // }, []);

    return (
        <React.Fragment>
            <div>
                <h5 className="card-title mb-4">IPD Balance Report</h5>
                <Row>
                    <Col lg>

                        <Row>
                            <Col lg={6}>
                                <div className="mb-3">
                                    <Label
                                        className="form-label"
                                        htmlFor="pathology-duration-input"
                                    >
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
                            <Col lg={6}>
                                <div className="mb-3">
                                    <Label className="form-label" htmlFor="status-input">Patient Status</Label>
                                    <Input type="select" className="form-control" id="status-input">
                                        <option>Select Status</option>
                                        <option>Active</option>
                                        <option>Inactive</option>
                                    </Input>
                                </div>
                            </Col>
                            {/* <Col lg={6}>
                                <div className="mb-3">
                                    <Label className="form-label" htmlFor="from-age-input">From Age</Label>
                                    <Input type="select" className="form-control" id="from-age-input">
                                        <option>Select Age</option>
                                        <option>20</option>
                                        <option>30</option>
                                        <option>40</option>
                                    </Input>
                                </div>
                            </Col>

                            <Col lg={6}>
                                <div className="mb-3">
                                    <Label className="form-label" htmlFor="to-age-input">To Age</Label>
                                    <Input type="select" className="form-control" id="to-age-input">
                                        <option>Select Age</option>
                                        <option>40</option>
                                        <option>50</option>
                                        <option>60</option>
                                    </Input>
                                </div>
                            </Col> */}
                            <Col lg={6}>
                                <div className="mb-3">
                                    <Label className="form-label" htmlFor="gender-input">Gender</Label>
                                    <Input type="select" className="form-control" id="gender-input">
                                        <option value=''>Select Gender</option>
                                        {genderData.map((data: any, idx: any) => (
                                            <option key={idx} value={data.name}>{data.name}</option>
                                        ))}
                                    </Input>
                                </div>
                            </Col>
                            <Col lg={6}>
                                <div className="mb-3">
                                    <Label className="form-label" htmlFor="miscellaneous-input">Miscellaneous</Label>
                                    <Input type="select" className="form-control" id="miscellaneous-input">
                                        <option>Select Option</option>
                                        <option>Option 1</option>
                                        <option>Option 2</option>
                                    </Input>
                                </div>
                            </Col>
                            {timeDuration === 'Period' && (
                                <>
                                    <Col lg={6}>
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
                                    <Col lg={6}>
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
                        </Row>
                    </Col>
                    {/* <Col lg={5}>
                        <PaidBalanceChart />
                    </Col> */}
                </Row>

                <Row>
                    <Col lg={12} className="px-0">
                        <Card id="ipdBalanceReport">
                            <CardHeader className="border-0">
                                <Row className="g-4 align-items-center">
                                    <div className="col-sm">
                                        <div className="p-2 border ">
                                            <h5 className="text-danger">Total Summary</h5>
                                            <p><strong>Total Amount:</strong> {totalAmount}</p>
                                        </div>
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
                                <div>
                                    <TableContainer
                                        columns={ipdBalanceColumns}
                                        data={ipdBalanceData}
                                        isGlobalFilter={true}
                                        isCustomerFilter={true}
                                        customPageSize={5}
                                        tableClass="table table-bordered"
                                        theadClass="thead-light"
                                        divClass="table-responsive"
                                    />
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </React.Fragment>
    );
};

export default IPDBalanceReport;
