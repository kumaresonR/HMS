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
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import { toast } from "react-toastify";
import ReportApiService from "../../../helpers/services/report/report-api-service";
import { timeDurationData } from "../../../common/data/FakeData";
import moment from "moment";

const DeathReport = () => {
    const reportApiService: ReportApiService = new ReportApiService();

    const [deathReportData, setDeathReportData] = useState([]);
    const [timeDuration, setTimeDuration] = useState('');
    const [timeDurationValidationError, setTimeDurationValidationError] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const deathReportColumns = [
        {
            header: 'Reference No',
            accessorKey: 'deathId',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary text-nowrap">
                    {info.getValue()}

                </div>
            ),
        },
        {
            header: 'OPD/IPD ID',
            accessorKey: 'ipdOrOpdId',
            enableColumnFilter: false,
            cell: (info: any) => info.getValue() ? info.getValue() : 'NA',
        },
        {
            header: 'Patient Name',
            accessorKey: 'patientName',
            enableColumnFilter: false,
        },
        {
            header: 'Guardian Name',
            accessorKey: 'guardianName',
            enableColumnFilter: false,

        },
        {
            header: 'Death Date',
            accessorKey: 'dateOfDeath',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div>
                    <span>
                        {info.getValue() ? moment(info.getValue()).format('DD/MM/YYYY, h:mm A') : 'N/A'}
                    </span>
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

            if (timeDuration && timeDuration !== "Period") {
                params.append("timeDuration", timeDuration);
            }

            if (timeDuration === "Period") {
                params.append("startDate", startDate);
                params.append("endDate", endDate);
            }

            const url = `?${params.toString()}`;
            let result = await reportApiService.getDeathReport(url);
            setDeathReportData(result);
            return result || [];
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
            const result = await reportApiService.exportDeathReport(url); // should return a Blob

            // Create object URL from the blob
            const blob = new Blob([result], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const objectURL = URL.createObjectURL(blob);

            // Create a temporary <a> element and trigger download
            const link = document.createElement('a');
            link.href = objectURL;
            link.download = 'DeathReport.xlsx';
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
                <h5 className="card-title mb-4">Death Report</h5>
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
                        <Card id="inventoryIssueReport">
                            <CardHeader className="border-0">
                                <Row className="g-4 align-items-center">
                                    <div className="col-sm text-end">
                                        <div className="col-sm-auto">
                                            <div>
                                                <button type="button" onClick={getAllPatientData}
                                                    className="btn btn-primary">
                                                    Search
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Row>
                            </CardHeader>
                            <div className="card-body pt-0">
                                <div className="col-sm-auto">
                                    {deathReportData?.length > 0 && (
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
                                        columns={deathReportColumns}
                                        data={deathReportData}
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

export default DeathReport;
