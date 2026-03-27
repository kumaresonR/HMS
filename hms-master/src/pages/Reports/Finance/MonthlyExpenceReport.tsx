import React, { useState } from 'react'
import TableContainer from '../../../Components/Common/TableContainer';
import moment from 'moment';
import { toast } from 'react-toastify';
import { Row, Col, Label, Input, Card, CardHeader } from 'reactstrap';
import ReportApiService from '../../../helpers/services/report/report-api-service';

const timeDurationData = [
    { code: '01', duration: 'January' },
    { code: '02', duration: 'February' },
    { code: '03', duration: 'March' },
    { code: '04', duration: 'April' },
    { code: '05', duration: 'May' },
    { code: '06', duration: 'June' },
    { code: '07', duration: 'July' },
    { code: '08', duration: 'August' },
    { code: '09', duration: 'September' },
    { code: '10', duration: 'October' },
    { code: '11', duration: 'November' },
    { code: '12', duration: 'December' }
];

const MonthlyExpenceReport = () => {
    const reportApiService: ReportApiService = new ReportApiService();

    const [expenceReportData, setExpenceReportData] = useState([]);
    const [timeDuration, setTimeDuration] = useState('');
    const [timeDurationValidationError, setTimeDurationValidationError] = useState(false);
    const [year, setYear] = useState();

    const currentYear = new Date().getFullYear();
    const last20Years = Array.from({ length: 20 }, (_, i) => currentYear - i);

    const totalAmount = expenceReportData.reduce((sum: any, data: any) => sum + (data.totalAmount || 0), 0);

    const incomeReportColumns = [
        {
            header: 'Module Name',
            accessorKey: 'moduleName',
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
            header: 'Expense',
            accessorKey: 'totalAmount',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" ">
                    <span className="text-primary">{info.getValue()}</span>
                </div>
            ),
        },
    ]


    const getAllPatientData = async () => {
        try {
            if (!year) {
                setTimeDurationValidationError(true);
                return [];
            } else {
                setTimeDurationValidationError(false);
            }

            const params = new URLSearchParams();

            if (timeDuration) {
                params.append("month", timeDuration);
            }

            if (year) {
                params.append("year", year);
            }

            const url = `search?${params.toString()}`;
            let result = await reportApiService.getAllMonthlyExpenceReport(url);
            setExpenceReportData(result.data);
            return result.data || [];
        } catch (error: any) {
            toast.error(error.message, { containerId: 'TR' });
            return [];
        }
    }

    const exportData = async () => {
        try {
            if (!year) {
                setTimeDurationValidationError(true);
                return [];
            } else {
                setTimeDurationValidationError(false);
            }

            const params = new URLSearchParams();

            if (timeDuration) {
                params.append("month", timeDuration);
            }

            if (year) {
                params.append("year", year);
            }

            const url = `search?${params.toString()}`;
            const result = await reportApiService.exportMonthlyExpenceReport(url); // should return a Blob

            // Create object URL from the blob
            const blob = new Blob([result], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const objectURL = URL.createObjectURL(blob);

            // Create a temporary <a> element and trigger download
            const link = document.createElement('a');
            link.href = objectURL;
            link.download = 'ExpenceReport.xlsx';
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
                    <h5 className="card-title mb-4">Expense Report</h5>
                </div>
                <Row>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="time-duration-input">
                                Month <span className='text-danger'> * </span>
                            </Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="pathology-duration-input"
                                value={timeDuration}
                                onChange={e => setTimeDuration(e.target.value)}
                            >
                                <option value=''>Select Duration</option>
                                {timeDurationData.map((data, idx) => (
                                    <option key={idx} value={data.code}>
                                        {data.duration}
                                    </option>
                                ))}
                            </Input>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="YearSelect">
                                Year
                            </Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="YearSelect"
                                value={year}
                                onChange={(e: any) => setYear(e.target.value)}
                                invalid={!!timeDurationValidationError}
                            >
                                <option value="">Select Year</option>
                                {last20Years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </Input>
                            {timeDurationValidationError && (
                                <div className="invalid-feedback">Year Required.</div>
                            )}
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col lg={12} className="px-0">
                        <Card id="incomeReport">
                            <CardHeader className="border-0">
                                <Row className="g-4">
                                    <div className="col-sm">
                                        <div className="p-2 border ">
                                            <h5 className="text-danger">Total Summary</h5>
                                            <p><strong>Total Expense:</strong> {totalAmount}</p>
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
                                {expenceReportData?.length > 0 && (
                                    <div className='text-end py-3'>
                                        <button type="button" className="btn btn-success" onClick={() => exportData()}>
                                            <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                            Export
                                        </button>
                                    </div>
                                )}
                                <div>
                                    <TableContainer
                                        columns={incomeReportColumns}
                                        data={expenceReportData}
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

export default MonthlyExpenceReport