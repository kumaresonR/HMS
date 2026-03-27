import React, { useState } from "react";
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
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import { toast } from "react-toastify";
import BloodBankApiService from "../../../helpers/services/bloodBank/BloodBankApiService";
import ReportApiService from "../../../helpers/services/report/report-api-service";
import { bloodGroupDetails, paymentModeData, timeDurationData } from "../../../common/data/FakeData";
import moment from "moment";

const ComponentIssueReport = () => {
    const reportApiService: ReportApiService = new ReportApiService();
    const bloodBankApiService: BloodBankApiService = new BloodBankApiService();

    const [componentIssueData, setComponentIssueData] = useState<any[]>([]);
    const [donorData, setDonorData] = useState<any[]>([]);
    const [bloodGroup, setBloodGroup] = useState('');
    const [bloodDonor, setBloodDonor] = useState('');
    const [timeDuration, setTimeDuration] = useState('');
    const [timeDurationValidationError, setTimeDurationValidationError] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [paymentMode, setPaymentMode] = useState('');
    const [isGSTAdded, setIsGSTAdded] = useState<any>(false);
    const [components, setComponents] = useState<any>(false);

    // total 
    const totalAmount = componentIssueData.reduce((sum: any, donor: any) => sum + (donor.netAmount || 0), 0);
    const totalPaidAmount = componentIssueData.reduce((sum: any, donor: any) => sum + (donor.paymentAmount || 0), 0);
    const totalBalanceAmount = totalAmount - totalPaidAmount;

    const componentIssueColumns = [
        {
            header: 'Bill No',
            accessorKey: 'issueComponentId',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary text-nowrap">
                    {info.getValue()}

                </div>
            ),
        },
        {
            header: 'Issue Date',
            accessorKey: 'issueDate',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div>
                    <span className="text-primary">
                        {info.getValue() ? moment(info.getValue()).format('DD/MM/YYYY') : 'N/A'}
                    </span>
                </div>
            ),
        },
        {
            header: 'OPD / IPD',
            accessorKey: 'ipdOrOpdId',
            enableColumnFilter: false,
        },
        // {
        //     header: 'Received To',
        //     accessorKey: 'receivedTo',
        //     enableColumnFilter: false,

        // },
        {
            header: 'Blood Group',
            accessorKey: 'bloodGroup',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-danger text-nowrap">
                    {info.getValue()}

                </div>
            ),
        },
        {
            header: 'Component',
            accessorKey: 'components',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-nowrap">
                    {info.getValue()}
                </div>
            ),
        },
        // {
        //     header: 'Gender',
        //     accessorKey: 'gender',
        //     enableColumnFilter: false,
        //     cell: (info: any) => (
        //         <div>
        //             {info.getValue()}
        //         </div>
        //     ),
        // },
        // {
        //     header: 'Donor Name',
        //     accessorKey: 'donorName', enableColumnFilter: false,
        //     cell: (info: any) => (
        //         <div className=" text-primary text-nowrap">
        //             {info.getValue()}

        //         </div>
        //     ),
        // },
        // {
        //     header: 'Bags',
        //     accessorKey: 'bags',
        //     enableColumnFilter: false,
        //     cell: (info: any) => (
        //         <div className=" text-primary text-nowrap">
        //             {info.getValue()}

        //         </div>
        //     ),
        // },
        {
            header: 'Technician',
            accessorKey: 'technician',
            enableColumnFilter: false,

        },
        {
            header: 'Charge Category',
            accessorKey: 'chargeCategory',
            enableColumnFilter: false,
        },
        {
            header: 'Charge Name',
            accessorKey: 'chargeName',
            enableColumnFilter: false,
        },
        {
            header: 'Standard Charge',
            accessorKey: 'standardCharge',
            enableColumnFilter: false,

        },
        {
            header: 'Amount',
            accessorKey: 'total',
            enableColumnFilter: false,

        },
        {
            header: 'Tax',
            accessorKey: 'tax',
            enableColumnFilter: false,

        },
        {
            header: 'Discount',
            accessorKey: 'discount',
            enableColumnFilter: false,

        },
        {
            header: 'NetAmount',
            accessorKey: 'netAmount',
            enableColumnFilter: false,
        },
        {
            header: 'Payment Amount',
            accessorKey: 'paymentAmount',
            enableColumnFilter: false,
        },
        {
            header: 'Payment Mode',
            accessorKey: 'paymentMode',
            enableColumnFilter: false,
        },
        {
            header: 'Balance',
            accessorKey: 'balanceAmount',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-danger text-nowrap">
                    {info.getValue()}

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

            if (paymentMode) params.append("paymentMode", paymentMode);
            if (bloodGroup) params.append("bloodGroup", bloodGroup);
            if (isGSTAdded) params.append("isGstAdded", isGSTAdded);
            if (components) params.append("components", components);
            if (timeDuration && timeDuration !== "Period") {
                params.append("timeDuration", timeDuration);
            }

            if (timeDuration === "Period") {
                params.append("startDate", startDate);
                params.append("endDate", endDate);
            }

            const url = `?${params.toString()}`;
            let result = await reportApiService.getAllComponentReport(url);
            setComponentIssueData(result.content);
            return result.content || [];
        } catch (error: any) {
            toast.error(error.message, { containerId: 'TR' });
            return [];
        }
    }

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

            if (paymentMode) params.append("paymentMode", paymentMode);
            if (bloodGroup) params.append("bloodGroup", bloodGroup);
            if (isGSTAdded) params.append("isGstAdded", isGSTAdded);
            if (components) params.append("components", components);
            if (timeDuration && timeDuration !== "Period") {
                params.append("timeDuration", timeDuration);
            }

            if (timeDuration === "Period") {
                params.append("startDate", startDate);
                params.append("endDate", endDate);
            }

            const url = `?${params.toString()}`;
            const result = await reportApiService.exportComponentReport(url);

            // Create object URL from the blob
            const blob = new Blob([result], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const objectURL = URL.createObjectURL(blob);

            // Create a temporary <a> element and trigger download
            const link = document.createElement('a');
            link.href = objectURL;
            link.download = 'ComponentIssue.xlsx';
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
                <h5 className="card-title mb-4">Component Issue Report</h5>
                <Row>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="blood-issue-duration-input">Time Duration <span className='text-danger'> * </span></Label>
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
                                htmlFor="blood-donor-blood-group"
                            >
                                Blood Group
                            </Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="blood-donor-blood-group"
                                value={bloodGroup}
                                onChange={(e) => { setBloodGroup(e.target.value) }}
                            >
                                <option value="">Select Blood Group</option>
                                {bloodGroupDetails.map((data, idx) => (
                                    <option key={idx} value={data.type}>{data.type}</option>
                                ))}
                            </Input>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="paymentMode-input">
                                Payment Mode
                            </Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="paymentMode-input"
                                value={paymentMode}
                                onChange={(e) => { setPaymentMode(e.target.value) }}
                            >
                                <option value=''>Select</option>
                                {paymentModeData?.map((data: any, idx: any) => (
                                    <option key={idx} value={data.type}>{data.type}</option>
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
                    {/* <Col lg={6}>
                        <div className="mb-3">
                            <Label
                                className="form-label"
                                htmlFor="blood-donor-name"
                            >
                                Blood Donor
                            </Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="blood-donor-name"
                                value={bloodDonor}
                                onChange={(e) => setBloodDonor(e.target.value)}
                            >
                                <option value="">Select Donor</option>
                                {donorData.map((data: any, idx: any) => (
                                    <option key={idx} value={data.donorId}>{data.donorName} ({data.bloodGroup})</option>
                                ))}
                            </Input>
                        </div>
                    </Col> */}
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
                        <Card id="componentIssueReport">
                            <CardHeader className="border-0">
                                <Row className="g-4 align-items-center">
                                    <div className="col-sm">
                                        <div className="p-2 border ">
                                            <h5 className="text-danger">Total Summary</h5>
                                            <p><strong>Total Amount:</strong> {totalAmount}</p>
                                            <p><strong>Total Paid Amount:</strong> {totalPaidAmount}</p>
                                            <p><strong>Total Balance Amount:</strong> {totalBalanceAmount}</p>
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
                                <div className="col-sm-auto">
                                    {componentIssueData?.length > 0 && (
                                        <div className='text-end py-3'>
                                            <button type="button" className="btn btn-success" onClick={() => exportData()}>
                                                <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                Export
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <TableContainer
                                        columns={componentIssueColumns}
                                        data={componentIssueData}
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

export default ComponentIssueReport;
