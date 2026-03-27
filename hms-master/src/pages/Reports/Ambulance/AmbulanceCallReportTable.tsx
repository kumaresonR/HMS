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
import PaidVsBalance from './PaidBalanceChart'
import PaidBalanceChart from "./PaidBalanceChart";
import { paymentModeData, timeDurationData } from "../../../common/data/FakeData";
import { toast } from "react-toastify";
import moment from "moment";
import AppointmentApiService from "../../../helpers/services/appointment/appointment-api-service";
import ReportApiService from "../../../helpers/services/report/report-api-service";

const AmbulanceCallReportTable = () => {
    const reportApiService: ReportApiService = new ReportApiService();
    const appointmentApiServic: AppointmentApiService = new AppointmentApiService();


    const [ambulanceReportData, setAmbulanceReportData] = useState([]);
    const [timeDuration, setTimeDuration] = useState('');
    const [timeDurationValidationError, setTimeDurationValidationError] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [paymentMode, setPaymentMode] = useState('');
    const [isGSTAdded, setIsGSTAdded] = useState<any>(false);

    const totalAmount = ambulanceReportData.reduce((sum: any, donor: any) => sum + (donor.netAmount || 0), 0);
    const totalPaidAmount = ambulanceReportData.reduce((sum: any, donor: any) => sum + (donor.paymentAmount || 0), 0);
    const totalBalanceAmount = totalAmount - totalPaidAmount;

    const ambulanceReportColumns = [
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
            header: 'Vehicle Number',
            accessorKey: 'vehicleNumber',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue() || 'N/A'}
                </div>
            ),
        },
        {
            header: 'Vehicle Model',
            accessorKey: 'vehicleModel',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue() || 'N/A'}
                </div>
            ),
        },
        {
            header: 'Driver Name',
            accessorKey: 'driverName',
            enableColumnFilter: false,
            cell: (info: any) => info.getValue() || 'N/A',
        },
        {
            header: 'Patient Name',
            accessorKey: 'patient',
            enableColumnFilter: false,
            cell: ({ row }: any) => {
                const patient = row.original.patient;
                if (patient) {
                    return `${patient.firstName} ${patient.lastName} (${patient.patientId})`;
                }
                return '-';
            },
        },

        {
            header: 'Payment Mode',
            accessorKey: 'paymentMode',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue() || 'N/A'}
                </div>
            ),
        },
        {
            header: 'Net Amount',
            accessorKey: 'netAmount',
            enableColumnFilter: false,
            cell: (info: any) => info.getValue() || 'N/A',
        },
        {
            header: 'Discount Amount',
            accessorKey: 'discountAmount',
            enableColumnFilter: false,
            cell: (info: any) => info.getValue() || 'N/A',
        },
        {
            header: 'Payment Amount',
            accessorKey: 'paymentAmount',
            enableColumnFilter: false,
            cell: (info: any) => info.getValue() || 'N/A',
        }
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


            // if (testName) params.append("testName", testName);
            if (paymentMode) params.append("paymentMode", paymentMode);
            if (timeDuration && timeDuration !== "Period") {
                params.append("timeDuration", timeDuration);
            }

            if (timeDuration === "Period") {
                params.append("startDate", startDate);
                params.append("endDate", endDate);
            }
            if (isGSTAdded) params.append("isGstAdded", isGSTAdded);
            const url = `payments?${params.toString()}`;
            let result = await reportApiService.getAllAmbulanceReport(url);
            setAmbulanceReportData(result.content);
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
            if (timeDuration && timeDuration !== "Period") {
                params.append("timeDuration", timeDuration);
            }
            if (timeDuration === "Period") {
                params.append("startDate", startDate);
                params.append("endDate", endDate);
            }

            const url = `?${params.toString()}`;
            const result = await reportApiService.exportAmbulanceReport(url); // should return a Blob

            // Create object URL from the blob
            const blob = new Blob([result], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const objectURL = URL.createObjectURL(blob);

            // Create a temporary <a> element and trigger download
            const link = document.createElement('a');
            link.href = objectURL;
            link.download = 'AmbulanceCallReport.xlsx';
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
                <Row className="p-0 align-items-center">

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
                        <Card id="ipdReportTable">
                            <CardHeader className="border-0">
                                <Row className="g-4">
                                    
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
                                    {ambulanceReportData?.length > 0 && (
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
                                    columns={ambulanceReportColumns}
                                    data={ambulanceReportData}
                                    isGlobalFilter={false}
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

export default AmbulanceCallReportTable;
