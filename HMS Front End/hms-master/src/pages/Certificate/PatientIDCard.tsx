import React, { useEffect, useRef, useState } from "react";
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
import FormHeader from "../../common/FormHeader/FormHeader";
import { useNavigate } from "react-router-dom";
import PatientApiService from "../../helpers/services/patient/patient-api-service";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import CertificateApiService from "../../helpers/services/certificate/certificate-api-service";
import ErrorHandler from "../../helpers/ErrorHandler";
import { toast } from "react-toastify";

const PatientIDCard = () => {
    const patientApiService: PatientApiService = new PatientApiService();
    const certificateApiService: CertificateApiService = new CertificateApiService();

    let navigate: any = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<[]>([]);
    const [patientId, setPatientId] = useState('');
    const typeaheadRef = useRef<any>(null);
    const [templateData, setTemplateData] = useState([]);
    const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
    const [selectedData, setSelectedData] = useState<any>('');
    const [templateId, setTemplateId] = useState<any>('');
    const [patientData, setPatientData] = useState([]);

    const onSelectedPatientId = (selectedItem: any) => {
        const patientId = selectedItem?.[0]?.['patientId'];
        setPatientId(patientId);
    }

    const handlePatientSearch = async (query: any) => {
        setIsLoading(true);
        try {
            let url = "getPatientData?searchTerm=" + query
            let result = await patientApiService.searchPatient(url);
            setOptions(result.data)
        } catch (error: any) {
            return ErrorHandler(error)
        } finally {
            setIsLoading(false);
        }
    }

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
            header: 'Patient Name',
            accessorKey: 'firstName',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue()}
                </div>
            )
        },

        {
            header: 'Gender',
            accessorKey: 'gender',
            enableColumnFilter: false,

        },
        {
            header: 'Phone',
            accessorKey: 'contactNumber',
            enableColumnFilter: false, cell: (info: any) => (
                <div className="text-primary">{info.getValue()}</div>
            ),

        },
        {
            header: 'Guardian Name',
            accessorFn: (row: any) =>
                row.emergencyContacts?.length > 0 ? row.emergencyContacts[0].contactName : 'N/A',
            enableColumnFilter: false,
        },
        {
            header: 'Address',
            accessorKey: 'address',
            enableColumnFilter: false,

        },
    ];

    const addCertificate = () => {
        navigate('/main/CreatePatientIdCard')
    }
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
        navigate('/main/generateIdCardTemplate', { state: { id: templateId, data: selectedData } })
    }

    const getAllCertificateTemplate = async () => {
        try {
            let result = await certificateApiService.getAllPatientIdTemplate();
            setTemplateData(result.ResponseBody);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const onSearch = async () => {
        try {
            let url = "individualPatient?page=0&size=10";

            if (patientId) {
                url = url + "&patientId=" + patientId;
            }
            let result = await patientApiService.getAllPatient(url);
            setPatientData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllCertificateTemplate();
    }, []);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Patient ID Card" pageTitle="Patient ID Card" />
                    <Row className="d-flex justify-content-center">
                        <Col xl={12} className="p-0">
                            <Card>
                                <CardHeader className=" d-flex justify-content-between align-items-center">
                                    <h4 className="card-title mb-0">Patient ID Card List</h4>
                                    <Button onClick={addCertificate}>  ID Card Template </Button>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col lg={6}>
                                            <div className="mb-3">
                                                <Label className="form-label" htmlFor="patient-input">
                                                    Patient
                                                </Label>
                                                <Col>
                                                    <AsyncTypeahead
                                                        ref={typeaheadRef}
                                                        filterBy={() => true}
                                                        id="patient-id-search-box"
                                                        isLoading={isLoading}
                                                        labelKey="name"
                                                        minLength={1}
                                                        options={options}
                                                        onSearch={handlePatientSearch}
                                                        onChange={onSelectedPatientId}
                                                        placeholder="Search by Patient Id Or Name"
                                                    />
                                                </Col>
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className="mb-3">
                                                <Label className="form-label" htmlFor="id-card-template-input">
                                                    ID Card Template
                                                </Label>
                                                <Input type="select" className="form-control"
                                                    id="id-card-template-input"
                                                    value={templateId}
                                                    onChange={(e: any) => setTemplateId(e.target.value)}>
                                                    <option>Select Template</option>
                                                    {templateData.map((item: any, idx: any) => (
                                                        <option key={idx} value={item.PatientIdCardTemplateId}>{item.PatientIdCardTitle}</option>
                                                    ))}
                                                </Input>
                                            </div>
                                        </Col>
                                        <Col>
                                            <Button onClick={onSearch}>Search</Button>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={12} className="px-0">
                                            <Card id="patientIdCardList">
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
                                                        data={patientData}
                                                        isGlobalFilter={false}
                                                        isCustomerFilter={false}
                                                        customPageSize={5}
                                                        tableClass="table table-bordered"
                                                        theadClass="thead-light"
                                                        divClass="table-responsive"
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

export default PatientIDCard;
