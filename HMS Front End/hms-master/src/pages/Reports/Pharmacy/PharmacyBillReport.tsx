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
import AppointmentApiService from "../../../helpers/services/appointment/appointment-api-service";
import ReportApiService from "../../../helpers/services/report/report-api-service";
import ErrorHandler from "../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import { paymentModeData, timeDurationData } from "../../../common/data/FakeData";
import moment from "moment";

const PharmacyBillReport = () => {
    const reportApiService: ReportApiService = new ReportApiService();
    const appointmentApiServic: AppointmentApiService = new AppointmentApiService();

    const [pharmacyBillData, setPharmacyBillData] = useState<any>([]);
    const [employeData, setEmployeData] = useState([]);
    const [isGSTAdded, setIsGSTAdded] = useState<any>(false);
    const [doctorName, setDoctorName] = useState('');
    const [paymentMode, setPaymentMode] = useState('');
    const [timeDuration, setTimeDuration] = useState('');
    const [timeDurationValidationError, setTimeDurationValidationError] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // total 
    const totalAmount = pharmacyBillData.reduce((sum: any, data: any) => sum + (data.netAmount || 0), 0);
    const totalPaidAmount = pharmacyBillData.reduce((sum: any, data: any) => sum + (data.paidAmount || 0), 0);
    const totalBalanceAmount = pharmacyBillData.reduce((sum: any, data: any) => sum + (data.balanceAmount || 0), 0);

    const pharmacyBillColumns = [
        // {
        //     header: 'Bill No',
        //     accessorKey: 'billNo',
        //     enableColumnFilter: false,
        //     cell: (info: any) => (
        //         <div className=" text-primary">
        //             {info.getValue()}
        //         </div>
        //     ),
        // },
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
            header: 'Prescription No',
            accessorKey: 'prescriptionNo',
            enableColumnFilter: false,

        },
        {
            header: 'Doctor Name',
            accessorKey: 'doctorName',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary">
                    {info.getValue()}

                </div>
            ),
        },
        // {
        //     header: 'Collected By',
        //     accessorKey: 'collectedBy',
        //     enableColumnFilter: false,

        // },
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
        // {
        //     header: 'Refund Amount',
        //     accessorKey: 'refundAmount',
        //     enableColumnFilter: false,

        // },
        {
            header: 'Balance Amount',
            accessorKey: 'balanceAmount',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-danger">
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

            if (doctorName) params.append("doctorName", doctorName);
            if (paymentMode) params.append("paymentMode", paymentMode);
            if (timeDuration && timeDuration !== "Period") {
                params.append("timeDuration", timeDuration);
            }

            if (timeDuration === "Period") {
                params.append("startDate", startDate);
                params.append("endDate", endDate);
            }
            if (isGSTAdded) params.append("isGstAdded", isGSTAdded);
            const url = `search?${params.toString()}`;
            let result = await reportApiService.getAllPharmacyReport(url);
            setPharmacyBillData(result);
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
            const result = await reportApiService.exportPharmacyReport(url); // should return a Blob

            // Create object URL from the blob
            const blob = new Blob([result], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const objectURL = URL.createObjectURL(blob);

            // Create a temporary <a> element and trigger download
            const link = document.createElement('a');
            link.href = objectURL;
            link.download = 'PharmacyReport.xlsx';
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
                <h5 className="card-title mb-4">Pharmacy Bill Report</h5>
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
                    {/* <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="collected-by-input">
                                Collected By
                            </Label>
                            <Input type="select" className="form-control" id="collected-by-input">
                                <option>Select Collected By</option>
                                <option>Staff A</option>
                                <option>Staff B</option>
                                <option>Staff C</option>
                            </Input>
                        </div>
                    </Col> */}
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="doctor-input">
                                Doctor
                            </Label>
                            <Input type="select"
                                className="form-control"
                                id="doctor-input"
                                value={doctorName}
                                onChange={(e) => { setDoctorName(e.target.value) }}
                            >
                                <option value=''>Select Doctor</option>
                                {employeData?.map((data: any, idx: any) => (
                                    <option key={idx} value={data.fullName}>{data.fullName}</option>
                                ))}
                            </Input>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="payment-mode-input">
                                Payment Mode
                            </Label>
                            <Input type="select"
                                className="form-control"
                                id="payment-mode-input"
                                value={paymentMode}
                                onChange={e => setPaymentMode(e.target.value)}
                            >
                                <option value=''>Select Payment Mode</option>
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
                        <Card id="pharmacyBillReport">
                            <CardHeader className="border-0">
                                <Row className="g-4 ">
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
                                    {pharmacyBillData?.length > 0 && (
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
                                        columns={pharmacyBillColumns}
                                        data={pharmacyBillData}
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

export default PharmacyBillReport;
