import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    Button,
} from "reactstrap";
import TableContainer from "../../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

import FormHeader from "../../../common/FormHeader/FormHeader";
import PatientApiService from "../../../helpers/services/patient/patient-api-service";
import { toast } from "react-toastify";
import { minimizePage } from "../../../slices/pageResizer/uiSlice";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

const PatientList = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const patientApiService: PatientApiService = new PatientApiService();
    const [patientData, setPatientData] = useState<any>([]);

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    const patientColumns = [
        {
            header: 'Patient Id',
            accessorKey: 'patientId',
            enableColumnFilter: false,
        },
        {
            header: 'First Name',
            accessorKey: 'firstName',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary">
                    {info.getValue()}

                </div>
            ),
        },
        {
            header: 'Last Name',
            accessorKey: 'lastName',
            enableColumnFilter: false,
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
            header: 'Phone',
            accessorKey: 'contactNumber',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary">
                    {info.getValue()}

                </div>
            ),
        },
        {
            header: 'Blood Group',
            accessorKey: 'bloodType',
            enableColumnFilter: false,
        },
        {
            header: 'Address',
            accessorKey: 'address',
            enableColumnFilter: false,
        },
    ];

    const getAllPatientData = async () => {
        try {
            let url = "all";
            let result = await patientApiService.getAllPatient(url);
            setPatientData(result);
        } catch (error: any) {
            toast.error(error.message, { containerId: 'TR' });
        }
    }

    useEffect(() => {
        getAllPatientData();
    }, []);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Patient"
                        pageTitle="Setup"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Patient",
                        }))} />
                    <Row className="d-flex justify-content-center">
                        <Col xl={12} className="p-0">
                            <Card>
                                <ExportCSVModal
                                    show={isExportCSV}
                                    onCloseClick={() => setIsExportCSV(false)}
                                    data={patientData}
                                />

                                <Row>
                                    <Col lg={12}>
                                        <Card id="patientList">
                                            <CardHeader className="border-0">
                                                <Row className="g-4 align-items-center">
                                                    <div className="col-sm">
                                                        <div>
                                                            <h5 className="card-title mb-0">Patient List</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-auto">
                                                        <div>
                                                            {/* <Link to='/main/addPatientSetup'>

                                                                <Button
                                                                    size="sm"
                                                                    color="primary"
                                                                    className="btn btn-primary add-btn me-3"

                                                                >
                                                                    <i className="ri-add-fill me-1 align-bottom"></i> Add New Patient
                                                                </Button>
                                                            </Link> */}
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                className="btn btn-secondary"
                                                                onClick={() => setIsExportCSV(true)}
                                                            >
                                                                <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                                Export
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Row>
                                            </CardHeader>

                                            <div className="card-body pt-0">
                                                <div>
                                                    <TableContainer
                                                        columns={patientColumns}
                                                        data={patientData}
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

                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};


export default PatientList;
