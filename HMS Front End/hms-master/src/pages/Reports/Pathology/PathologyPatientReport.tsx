import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    Col,
    FormGroup,
    Input,
    Label,
    Row,
} from "reactstrap";
import TableContainer from "../../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import ReportApiService from "../../../helpers/services/report/report-api-service";
import { toast } from "react-toastify";
import AppointmentApiService from "../../../helpers/services/appointment/appointment-api-service";
import ErrorHandler from "../../../helpers/ErrorHandler";
import { categoryNameData, timeDurationData } from "../../../common/data/FakeData";
import BillingApiService from "../../../helpers/services/billing/billing-api-service";
import moment from "moment";
import SetupApiService from "../../../helpers/services/setup/setup-api-service";

const PathologyPatientReport = () => {
    const reportApiService: ReportApiService = new ReportApiService();
    const appointmentApiServic: AppointmentApiService = new AppointmentApiService();
    const billingApiService: BillingApiService = new BillingApiService();
    const setupApiService: SetupApiService = new SetupApiService();

    const [pathologyTestData, setPathologyTestData] = useState<any>([]);
    const [pathologyPatientData, setPathologyPatientData] = useState<any[]>([]);
    const [employeData, setEmployeData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [isGSTAdded, setIsGSTAdded] = useState<any>(false);

    const [categoryName, setCategoryName] = useState('');
    const [testName, setTestName] = useState('');
    const [sampleCollected, setSampleCollected] = useState('');
    const [timeDuration, setTimeDuration] = useState('');
    const [timeDurationValidationError, setTimeDurationValidationError] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const totalAmount = pathologyPatientData.reduce((sum: any, data: any) => sum + (data.amount || 0), 0);

    const pathologyPatientColumns = [
        {
            header: 'Bill No',
            accessorKey: 'billNo',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue() ? info.getValue() : 'N/A'}
                </div>
            ),
        },
        {
            header: 'Date',
            accessorKey: 'date',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div>
                    <span className="text-primary">
                        {info.getValue()
                            ? moment(info.getValue()).format('DD/MM/YYYY, h:mm A')
                            : 'N/A'}
                    </span>
                </div>
            ),
        },
        {
            header: 'Patient Name',
            accessorKey: 'patientName',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-nowrap">
                    {info.getValue() ? info.getValue() : 'N/A'}
                </div>
            ),
        },
        {
            header: 'Category Name',
            accessorKey: 'categoryName',
            enableColumnFilter: false,
            cell: (info: any) => info.getValue() || 'N/A',
        },
        {
            header: 'Test Name',
            accessorKey: 'testName',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-nowrap text-primary">
                    {info.getValue() ? info.getValue() : 'N/A'}
                </div>
            ),
        },
        {
            header: 'Consultant Doctor',
            accessorKey: 'consultantDoctor',
            enableColumnFilter: false,
            cell: (info: any) => info.getValue() || 'N/A',
        },
        {
            header: 'Sample Collected By',
            accessorKey: 'sampleCollected',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue() ? info.getValue() : 'N/A'}
                </div>
            ),
        },
        {
            header: 'Previous Report Value',
            accessorKey: 'previousReportValue',
            enableColumnFilter: false,
            cell: (info: any) => info.getValue() || 'N/A',
        },
        {
            header: 'Amount',
            accessorKey: 'amount',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary text-nowrap">
                    {info.getValue() ? info.getValue() : 'N/A'}
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
            if (isGSTAdded) params.append("isGstAdded", isGSTAdded);
            const url = `search?${params.toString()}`;
            let result = await reportApiService.getAllPathologyReport(url);
            setPathologyPatientData(result);
            return result || [];
        } catch (error: any) {
            toast.error(error.message, { containerId: 'TR' });
            return [];
        }
    }

    const getEmployeData = async () => {
        try {
            const url = "role=PATHOLOGIST";
            let result = await appointmentApiServic.searchAllEmployee(url);
            setEmployeData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllPathologyTest = async () => {
        try {
            let url = "all"
            let result = await billingApiService.getPathologyTest(url);
            setPathologyTestData(result);
        } catch (error: any) {
            console.log(error);
        }
    }

    const getAllPathologyCategory = async () => {
        try {
            let result = await setupApiService.getAllPathologyCategoryMaster();
            setCategoryData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getEmployeData();
        getAllPathologyTest();
        getAllPathologyCategory();
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
            const result = await reportApiService.exportPathologyReport(url); // should return a Blob

            // Create object URL from the blob
            const blob = new Blob([result], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const objectURL = URL.createObjectURL(blob);

            // Create a temporary <a> element and trigger download
            const link = document.createElement('a');
            link.href = objectURL;
            link.download = 'PathologyReport.xlsx';
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
                <h5 className="card-title mb-4">Pathology Patient Report</h5>
                <Row className="p-0 align-items-center">
                    <Col lg={4}>
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
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label
                                className="form-label"
                                htmlFor="sample-collected-by-input"
                            >
                                Sample Collected By
                            </Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="sample-collected-by-input"
                                value={sampleCollected}
                                onChange={(e) => { setSampleCollected(e.target.value) }}
                            >
                                <option value=''>Select Person</option>
                                {employeData?.map((data: any, idx: any) => (
                                    <option key={idx} value={data.fullName}>{data.fullName}</option>
                                ))}
                            </Input>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label
                                className="form-label"
                                htmlFor="category-name-input"
                            >
                                Category Name
                            </Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="category-name-input"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                            >
                                <option value=''>Select Category</option>
                                {/* {categoryNameData.map((data, idx) => (
                                    <option key={idx} value={data.category}>{data.category}</option>
                                ))} */}
                                {categoryData.map((data: any, idx: any) => (
                                    <option key={idx} value={data.categoryName}>{data.categoryName}</option>
                                ))}
                            </Input>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label
                                className="form-label"
                                htmlFor="test-name-input"
                            >
                                Test Name
                            </Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="test-name-input"
                                value={testName}
                                onChange={(e) => setTestName(e.target.value)}
                            >
                                <option value=''>Select Test</option>
                                {pathologyTestData.map((data: any, idx: any) => (
                                    <option key={idx} value={data.testName}>{data.testName}</option>
                                ))}
                            </Input>
                        </div>
                    </Col>
                    <Col>
                        <FormGroup switch className="fs-4">
                            <Input
                                type="switch"
                                role="switch"
                                checked={isGSTAdded}
                                onChange={() => setIsGSTAdded(!isGSTAdded)}
                            />
                            <Label check>GST</Label>
                        </FormGroup>
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

                </Row>

                <Row>
                    <Col lg={12} className="px-0">
                        <Card id="pathologyPatientReport">
                            <CardHeader className="border-0">
                                <Row className="g-4">
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
                                    {/* <div className="col-sm-auto">

                                        <div className="input-group">

                                            <Input
                                                type="text"
                                                className="form-control"
                                                id="Search"
                                                placeholder="Search..."
                                            />
                                            <span className="input-group-text searchBtn">
                                                <i className="ri-search-2-line label-icon align-middle fs-16 ms-2"></i>
                                            </span>
                                        </div>


                                    </div> */}
                                </Row>
                            </CardHeader>
                            <div className="card-body pt-0">
                                <div className="col-sm-auto">
                                    {pathologyPatientData?.length > 0 && (
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
                                <div>
                                    <TableContainer
                                        columns={pathologyPatientColumns}
                                        data={pathologyPatientData}
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

export default PathologyPatientReport;
