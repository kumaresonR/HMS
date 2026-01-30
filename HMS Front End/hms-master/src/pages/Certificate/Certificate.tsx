import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Input,
    Label,
    Row,
} from "reactstrap";
import TableContainer from "../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import FormHeader from "../../common/FormHeader/FormHeader";
import { Link, useNavigate } from "react-router-dom";
import CertificateApiService from "../../helpers/services/certificate/certificate-api-service";
import ErrorHandler from "../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import IPDApiService from "../../helpers/services/ipd/ipd-api-service";
import OPDApiService from "../../helpers/services/opd/opd-api-service";
import { el } from "@fullcalendar/core/internal-common";
import Paginator from "../../common/pagenator/pagenator";

const moduleData = [
    {
        name: "OPD"
    },
    {
        name: "IPD"
    }
]

const patientStatusData = [
    {
        name: "Not Discharged"
    },
    {
        name: "Discharged"
    }
]
const Certificate = () => {
    const certificateApiService: CertificateApiService = new CertificateApiService();
    const iPDApiService: IPDApiService = new IPDApiService();
    const opdApiService: OPDApiService = new OPDApiService();

    let navigate: any = useNavigate();

    const [moduleName, setModuleName] = useState('');
    const [patientStatus, setPatientStatus] = useState('');
    const [templateName, setTemplateName] = useState([]);
    const [selectedData, setSelectedData] = useState<any>('');
    const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
    const [templateId, setTemplateId] = useState<any>('');
    const [data, setData] = useState([]);

    //pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const handleNext = () => setCurrentPage((prev) => prev + 1);
    const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(event.target.value));
        setCurrentPage(0);
    };

    const patientColumns = [
        {
            header: 'Select',
            accessorKey: 'select',
            enableColumnFilter: false,
            cell: (info: any) => (
                <input
                    type="checkbox"
                    checked={!!selectedRows[info.row.id]}
                    onChange={(e) => handleCheckboxChange(info, e.target.checked)}
                />
            )
        },
        {
            header: 'OPD/IPD No',
            accessorKey: 'ipdId',
            enableColumnFilter: false,
            cell: (info: any) => {
                const row = info.row.original;
                const value = row.ipdId || row.opdId || 'N/A';
                return <div className="text-primary">{value}</div>;
            },
        },
        {
            header: 'Patient Name',
            accessorKey: 'patient.firstName',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">{info.getValue()}</div>
            ),
        },
        {
            header: 'Gender',
            accessorKey: 'patient.gender',
            enableColumnFilter: false,

        },
        {
            header: 'Mobile Number',
            accessorKey: 'patient.contactNumber',
            enableColumnFilter: false, cell: (info: any) => (
                <div className="text-primary">{info.getValue()}</div>
            ),
        },
    ];

    const handleCheckboxChange = (info: any, checked: boolean) => {
        const rowId = info.row.id;
        setSelectedRows((prev) => ({ ...prev, [rowId]: checked }));

        if (checked) {
            setSelectedData(info.row.original);
        } else {
            setSelectedData(null);
        }
    };

    const generateTemplate = () => {
        if (!templateId) {
            toast.warning('Please Select The Template', { containerId: 'TR' });
            return;
        }
        if (!selectedData) {
            toast.warning('Please Select Any Staff', { containerId: 'TR' });
            return;
        }
        navigate('/main/downloadCertificate', { state: { id: templateId, data: selectedData } })
    }

    const search = () => {
        if (!moduleName) {
            toast.warning('Please Select Any Module', { containerId: 'TR' });
            return;
        }
        if (!patientStatus) {
            toast.warning('Please Select Any Patient Status', { containerId: 'TR' });
            return;
        }
        if (moduleName === "OPD" && patientStatus === "Discharged") {
            getAllDischargeOPD(currentPage, pageSize)
        } else if (moduleName === "OPD" && patientStatus === "Not Discharged") {
            getAllOPD(currentPage, pageSize)
        } else if (moduleName === "IPD" && patientStatus === "Discharged") {
            getAllDischargeIpd(currentPage, pageSize)
        } else {
            getAllIpd(currentPage, pageSize)
        }
    }

    const getAllIpd = async (page: number, size: number) => {
        try {
            const url = `all?page=${page}&size=${size}`;
            let data = await iPDApiService.getAllIPD(url);
            setData(data);
            if (data && data.length) {
                const totalPatients = data.length;
                setTotalPages(Math.ceil(totalPatients / size));
            }
            return data || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const getAllDischargeIpd = async (page: number, size: number) => {
        try {
            const url = `discharge/all?page=${page}&size=${size}`;
            let data = await iPDApiService.getAllIPD(url);
            setData(data);
            if (data && data.length) {
                const totalPatients = data.length;
                setTotalPages(Math.ceil(totalPatients / size));
            }
            return data || [];
        } catch (error) {
            console.log(error);
            return [];
        }

    }

    const getAllDischargeOPD = async (page: number, size: number) => {
        try {
            const url = `discharge/all?page=${page}&size=${size}`;
            let data = await opdApiService.getAllOPD(url);
            setData(data);
            if (data && data.length) {
                const totalPatients = data.length;
                setTotalPages(Math.ceil(totalPatients / size));
            }
            return data || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const getAllOPD = async (page: number, size: number) => {
        try {
            const url = `all?page=${page}&size=${size}`;
            let data = await opdApiService.getAllOPD(url);
            setData(data);
            if (data && data.length) {
                const totalPatients = data.length;
                setTotalPages(Math.ceil(totalPatients / size));
            }
            return data || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const addCertificate = () => {
        navigate('/main/CertificateTemplateDataTable')
    }

    const getAllCertificateTemplate = async () => {
        try {
            let result = await certificateApiService.getAllCertificateTemplate();
            setTemplateName(result.ResponseBody);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllCertificateTemplate();
    }, []);

    useEffect(() => {
        if (moduleName && patientStatus) {
            if (currentPage !== null && pageSize !== null) {
                if (moduleName === "OPD" && patientStatus === "Discharged") {
                    getAllDischargeOPD(currentPage, pageSize);
                } else if (moduleName === "OPD" && patientStatus === "Not Discharged") {
                    getAllOPD(currentPage, pageSize);
                } else if (moduleName === "IPD" && patientStatus === "Discharged") {
                    getAllDischargeIpd(currentPage, pageSize);
                } else if (moduleName === "IPD") {
                    getAllIpd(currentPage, pageSize);
                }
            }
        }
    }, [currentPage, pageSize]);

    useEffect(() => {
        setCurrentPage(0);
    }, [moduleName, patientStatus]);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Certificate" pageTitle="Certificate" />
                    <Row className="d-flex justify-content-center">
                        <Col xl={12} className="p-0">
                            <Card>
                                <CardHeader className=" d-flex justify-content-between align-items-center">
                                    <h4 className="card-title mb-0">Patient List</h4>
                                    <Button onClick={addCertificate}>  Certificate Template </Button>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col lg={4}>
                                            <div className="mb-3">
                                                <Label className="form-label" htmlFor="module-input">
                                                    Module
                                                </Label>
                                                <Input type="select" value={moduleName}
                                                    onChange={(e) => setModuleName(e.target.value)}
                                                    className="form-control" id="module-input">
                                                    <option>Select Module</option>
                                                    {moduleData.map((item: any, idx: any) => (
                                                        <option key={idx} value={item.name}>{item.name}</option>
                                                    ))}
                                                </Input>
                                            </div>
                                        </Col>
                                        <Col lg={4}>
                                            <div className="mb-3">
                                                <Label className="form-label" htmlFor="patient-status-input">
                                                    Patient Status
                                                </Label>
                                                <Input type="select" value={patientStatus}
                                                    onChange={(e) => setPatientStatus(e.target.value)}
                                                    className="form-control"
                                                    id="patient-status-input">
                                                    <option>Select Status</option>
                                                    {patientStatusData.map((item: any, idx: any) => (
                                                        <option key={idx} value={item.name}>{item.name}</option>
                                                    ))}
                                                </Input>
                                            </div>
                                        </Col>
                                        <Col lg={4}>
                                            <div className="mb-3">
                                                <Label className="form-label" htmlFor="certificate-template-input">
                                                    Certificate Template
                                                </Label>
                                                <Input type="select" className="form-control"
                                                    value={templateId}
                                                    onChange={(e: any) => setTemplateId(e.target.value)}
                                                    id="certificate-template-input">
                                                    <option>Select Template</option>
                                                    {templateName.map((data: any, idx: any) => (
                                                        <option key={idx} value={data.CertificateTemplateId}>{data.CertificateTemplateName}</option>
                                                    ))}
                                                </Input>
                                            </div>
                                        </Col>
                                        <Col>
                                            <Button onClick={() => {
                                                setCurrentPage(0);
                                                search();
                                            }}>Search</Button>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col lg={12} className="px-0">
                                            <Card id="patientListReport">
                                                <CardHeader className="border-0">
                                                    <Row className="g-4 align-items-end justify-content-end">
                                                        <div className="col-sm-auto">
                                                            <Button color="success" onClick={generateTemplate}>Generate</Button>
                                                        </div>
                                                    </Row>
                                                </CardHeader>
                                                <div className="card-body pt-0">
                                                    <TableContainer
                                                        columns={patientColumns}
                                                        data={data}
                                                        isGlobalFilter={true}
                                                        isCustomerFilter={true}
                                                        customPageSize={5}
                                                        tableClass="table table-bordered"
                                                        theadClass="thead-light"
                                                        divClass="table-responsive"
                                                        hidePagination={true}
                                                    />
                                                    <Paginator
                                                        currentPage={currentPage}
                                                        totalPages={totalPages}
                                                        pageSize={pageSize}
                                                        handlePageSizeChange={handlePageSizeChange}
                                                        handlePrevious={handlePrevious}
                                                        handleNext={handleNext}
                                                        disableNext={data.length === 0}
                                                    />
                                                </div>
                                            </Card>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Certificate;
