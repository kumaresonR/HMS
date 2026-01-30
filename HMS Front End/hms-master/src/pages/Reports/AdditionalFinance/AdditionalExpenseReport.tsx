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
// import YearlyIncomeGraph from './YearlyIncomeGraph'
import ReportApiService from "../../../helpers/services/report/report-api-service";
import { toast } from "react-toastify";
import { timeDurationData } from "../../../common/data/FakeData";
import moment from "moment";

const AdditionalExpenseReport = () => {
    const reportApiService: ReportApiService = new ReportApiService();

    const [expenseReportData, setAdditionalExpenseReportData] = useState([]);
    const [timeDuration, setTimeDuration] = useState('');
    const [timeDurationValidationError, setTimeDurationValidationError] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const totalAmount = expenseReportData.reduce((sum: any, data: any) => sum + (data.amount || 0), 0);

    const expenseReportColumns = [
        {
            header: 'Name',
            accessorKey: 'name',
            enableColumnFilter: false,
        },
        {
            header: 'Invoice Number',
            accessorKey: 'invoiceNumber',
            enableColumnFilter: false,
        },
        {
            header: 'Date',
            accessorKey: 'date',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div>
                    <span>
                        {info.getValue() ? moment(info.getValue()).format('DD/MM/YYYY, h:mm A') : 'N/A'}
                    </span>
                </div>
            ),
        },
        {
            header: 'Description',
            accessorKey: 'description',
            enableColumnFilter: false,
        },
        {
            header: 'Expense Head',
            accessorKey: 'expenseHead',
            enableColumnFilter: false,
        },
        {
            header: 'Amount',
            accessorKey: 'amount',
            enableColumnFilter: false,
        },
        // {
        //     header: 'Income',
        //     accessorKey: 'totalAmount',
        //     enableColumnFilter: false,
        //     cell: (info: any) => (
        //         <div className=" ">
        //             <span className="text-primary">{info.getValue()}</span>
        //         </div>
        //     ),
        // },
    ]

    const getAllAdditionalExpenseData = async () => {
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

            const url = `search?${params.toString()}`;
            let result = await reportApiService.getAllAdditionalExpenseReport(url);
            setAdditionalExpenseReportData(result.data);
            return result.data || [];
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
            const result = await reportApiService.exportAdditionalExpenseReport(url); // should return a Blob

            // Create object URL from the blob
            const blob = new Blob([result], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const objectURL = URL.createObjectURL(blob);

            // Create a temporary <a> element and trigger download
            const link = document.createElement('a');
            link.href = objectURL;
            link.download = 'AdditionalExpenseReport.xlsx';
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
                <div>
                    <h5 className="card-title mb-4">Additional Expense Report</h5>
                </div>
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
                        <Card id="incomeReport">
                            <CardHeader className="border-0">
                                <Row className="g-4">
                                    <div className="col-sm">
                                        <div className="p-2 border ">
                                            <h5 className="text-danger">Total Summary</h5>
                                            <p><strong>Total Income:</strong> {totalAmount}</p>
                                        </div>
                                    </div>

                                    <div className="col-sm-auto">
                                        <div>
                                            <button type="button" onClick={getAllAdditionalExpenseData}
                                                className="btn btn-primary">
                                                Search
                                            </button>
                                        </div>
                                    </div>
                                </Row>
                            </CardHeader>

                            <div className="card-body pt-0">
                                {expenseReportData?.length > 0 && (
                                    <div className='text-end py-3'>
                                        <button type="button" className="btn btn-success" onClick={() => exportData()}>
                                            <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                            Export
                                        </button>
                                    </div>
                                )}
                                <div>
                                    <TableContainer
                                        columns={expenseReportColumns}
                                        data={expenseReportData}
                                        isGlobalFilter={false}
                                        isCustomerFilter={false}
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

export default AdditionalExpenseReport;
