import React, { useEffect, useState } from "react"
import { Button, Card, CardBody, CardHeader, Col, Container, Row, Table } from "reactstrap"
import FormHeader from "../../../common/FormHeader/FormHeader"
import { useLocation, useNavigate } from "react-router-dom";
import IPDApiService from "../../../helpers/services/ipd/ipd-api-service";
import Paginator from "../../../common/pagenator/pagenator";
import RoleBasedComponent from "../../../common/RolePermission/RoleBasedComponent";
import { minimizePage } from "../../../slices/pageResizer/uiSlice";
import { useDispatch } from "react-redux";
import ErrorHandler from "../../../helpers/ErrorHandler";
import moment from "moment";

const InPatientDataTable = () => {
    const iPDApiService: IPDApiService = new IPDApiService();
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState(data);
    const dispatch = useDispatch();
    const location = useLocation();
    let navigate: any = useNavigate();
    // const [ipdData, setIpdData] = useState<any>([1]);
    const [selectedSearchTerm, setSelectedSearchTerm] = useState("");

    // search 
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
    };

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

    const createPatient = () => {
        navigate('/main/add-patient')
    }

    const viewDischaredList = () => {
        navigate('/main/ipd-discharged-patient-list');
    }

    const addNewCommission = () => {
        navigate('/main/ipd-commission')
    }

    const viewIpdOverview = (data: any) => {
        navigate('/main/ipd-overview', { state: { data: data } })
    }

    const onSearch = async (value: any) => {
        try {
            if (!value || value.trim() === "") {
                getAllIpd(currentPage, pageSize);
            } else {
                let url = "searchTerm=" + value;
                let result = await iPDApiService.searchIPDBySearchTearm(url);
                setData(result);
            }
        } catch (error: any) {
            setData([]);
        }
    }

    const reset = () => {
        setSelectedSearchTerm("");
        getAllIpd(currentPage, pageSize);
    }

    const getAllIpd = async (page: number, size: number) => {
        try {
            const url = `all?page=${page}&size=${size}`;
            let data = await iPDApiService.getAllIPD(url);
            // const filteredData = data.filter((item: any) => item.dischargeDate === null);
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

    const resetIPD = () => {
        localStorage.removeItem("ipdId");
        localStorage.removeItem("activeTab");
    }

    useEffect(() => {
        resetIPD();
        const loadPages = async () => {
            const currentPageData = await getAllIpd(currentPage, pageSize);
            setData(currentPageData);
        };

        loadPages();
    }, [currentPage, pageSize]);

    useEffect(() => {
        if (!searchTerm) {
            setFilteredData(data);
            return;
        }

        const filteredResults = data.filter((item: any) =>
            item.ipdId.toString().toLowerCase().includes(searchTerm) ||
            `${item.patient?.firstName} ${item.patient?.lastName}`.toLowerCase().includes(searchTerm) ||
            `${item.doctor?.firstName} ${item.doctor?.lastName}`.toLowerCase().includes(searchTerm)
        );

        setFilteredData(filteredResults);
    }, [searchTerm, data]);

    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader title="In Patient" pageTitle="IPD - In Patient"
                    onMinimize={() => dispatch(minimizePage({
                        route: location.pathname,
                        pageName: "IPD",
                    }))} />
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardHeader className="border-0 align-items-center d-flex flex-wrap justify-content-between">
                                <h4 className="card-title mb-0">View In Patient</h4>
                                <div>
                                    <RoleBasedComponent allowedRoles={["SUPERADMIN","RECEPTIONIST", "DOCTOR"]}>
                                        <Button onClick={() => createPatient()} color="primary">
                                            <i className="ri-add-circle-line" />  Add Admission
                                        </Button>
                                    </RoleBasedComponent>
                                    <Button color="primary" className="btn btn-primary add-btn ms-3" onClick={() => viewDischaredList()}>
                                        Discharged Patient
                                    </Button>
                                    {/* <Button color="primary" className="btn btn-primary add-btn ms-3" onClick={() => addNewCommission()}>
                                        IPD Commission
                                    </Button> */}
                                </div>

                            </CardHeader>
                            <CardBody>
                                <Row className="align-items-center mb-2">
                                    <Col>
                                        <input
                                            type="search"
                                            placeholder="Search by IPD No, Patient Name, or Patient Id"
                                            onChange={(e: any) => onSearch(e.target.value)}
                                            className="form-control"
                                        />
                                    </Col>
                                </Row>
                                {/* <input
                                    type="text"
                                    placeholder="Search by IPD No, Name, or Doctor"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="form-control mb-3"
                                /> */}
                                <div className="table-responsive">
                                    <Table hover className="table-centered table-bordered align-middle table-nowrap mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>IPD No </th>
                                                {/* <th>Case ID</th> */}
                                                <th>Name</th>
                                                <th>Appointment Date </th>
                                                <th>Gender </th>
                                                <th>Phone </th>
                                                <th>Consultant Doctor</th>
                                                {/* <th>Bed</th> */}
                                                <th>Antenatal</th>
                                                <th>Previous Medical Issue </th>
                                                <th>Credit Limit (₹)</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {filteredData && filteredData.length > 0 ? (
                                                filteredData?.map((data: any, idx: any) => (
                                                    <tr key={idx}>
                                                        <td>
                                                            <a href="#" onClick={(event) => {
                                                                event.preventDefault();
                                                                viewIpdOverview(data.ipdId);
                                                            }}>
                                                                {data.ipdId}
                                                            </a>
                                                        </td>
                                                        {/* <td className="text-primary">{data.caseId}</td> */}
                                                        <td>{data.patient?.firstName} {data.patient?.lastName} ({data.patient?.patientId})</td>
                                                        <td>{moment(data.admissionDate).format('DD/MM/YYYY hh:mm A')}</td>
                                                        <td>{data.patient?.gender || 'NA'} </td>
                                                        <td className="text-primary">{data.patient?.contactNumber || 'NA'} </td>
                                                        <td>{data.doctor?.firstName} {data.doctor?.lastName} ({data.doctor?.staffId})</td>
                                                        {/* <td>{data.room?.roomNumber || 'NA'}</td> */}
                                                        <td>{data.antenatal ? "Yes" : "No"}</td>
                                                        <td className="text-primary">{data.previousMedicalIssue || 'NA'} </td>
                                                        <td>{data.creditLimit || ''} </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={9} className="text-center">No records available</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>

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
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default InPatientDataTable