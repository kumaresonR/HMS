import React, { useEffect, useState } from "react"
import IPDApiService from "../../../helpers/services/ipd/ipd-api-service";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, Col, Container, Row, Table } from "reactstrap";
import FormHeader from "../../../common/FormHeader/FormHeader";
import moment from "moment";
import { IoArrowBack } from "react-icons/io5";
import Paginator from "../../../common/pagenator/pagenator";
import { minimizePage } from "../../../slices/pageResizer/uiSlice";
import { useDispatch } from "react-redux";
import { useModal } from "../../../Components/Common/ModalContext";
import DownloadDischargeSummary from "./DownloadDischargeSummary";

const IPDDischargedPatientList = () => {
    const iPDApiService: IPDApiService = new IPDApiService();
    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { showModal } = useModal();

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState(data);

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

    // search 
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
    };

    const viewIpdOverview = (data: any) => {
        navigate('/main/ipd-overview', { state: { data: data } })
    }

    const onSearch = async (value: any) => {
        try {
            if (!value || value.trim() === "") {
                getAllIpd(currentPage, pageSize);
            } else {
                let url = "searchTerm=" + value;
                let result = await iPDApiService.searchIPDDischargeBySearchTearm(url);
                setData(result);
            }
        } catch (error: any) {
            setData([]);
        }
    };

    const getAllIpd = async (page: number, size: number) => {
        try {
            const url = `discharge/all?page=${page}&size=${size}`;
            let data = await iPDApiService.getAllIPD(url);
            // const filteredData = data.filter((item: any) => item.dischargeDate !== null);
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

    useEffect(() => {
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
                <FormHeader title="IPD Discharged Patient" pageTitle="IPD - In Patient"
                    onMinimize={() => dispatch(minimizePage({
                        route: location.pathname,
                        pageName: "IPD Discharged Patient",
                    }))} />
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardHeader className="border-0 align-items-center d-flex justify-content-between">
                                <h4 className="card-title mb-0">View IPD Discharged Patient</h4>
                                <div className="ms-auto">
                                    <Link to="/main/inPatient-datatable" className="text-end">
                                        <Button color="light" className="bg-gradient backBtn">
                                            <IoArrowBack />
                                        </Button>
                                    </Link>
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
                                <div className="table-responsive">
                                    <Table hover className="table-centered table-bordered align-middle table-nowrap mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Name </th>
                                                <th>IPD ID</th>
                                                {/* <th>Case ID</th> */}
                                                <th>Gender </th>
                                                <th>Phone </th>
                                                <th>Consultant Doctor</th>
                                                <th>Admission Date</th>
                                                <th>Discharged Date </th>
                                                <th>Discharge Summary</th>
                                                {/* <th>Tax(₹)</th>
                                                <th>Net Total(₹)</th>
                                                <th>Amount(₹)</th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredData && filteredData.length > 0 ? (
                                                filteredData?.map((data: any, idx: any) => (<tr key={idx}>
                                                    <td className="text-primary text-nowrap">
                                                        <a href="#" onClick={(event) => {
                                                            event.preventDefault();
                                                            viewIpdOverview(data.ipdId);
                                                        }}>
                                                            {data.patient?.firstName} {data.patient?.lastName} ({data.patient?.patientId})
                                                        </a>
                                                    </td>
                                                    <td className="text-primary">{data.ipdId}</td>
                                                    {/* <td>{data.caseId}</td> */}
                                                    <td>{data.patient?.gender || 'NA'} </td>
                                                    <td>{data.patient?.contactNumber || 'NA'} </td>
                                                    <td className="text-primary text-nowrap">{data.doctor?.firstName} {data.doctor?.lastName} ({data.doctor?.staffId})</td>
                                                    <td className="text-nowrap">{moment(data.admissionDate).format('DD/MM/YYYY, hh:mm A')}</td>
                                                    <td className="text-nowrap">{moment(data.dischargeDate).format('DD/MM/YYYY, hh:mm A')}</td>
                                                    <td className="text-nowrap">
                                                        <li className="list-inline-item" title="View">
                                                            <Link onClick={(e) => {
                                                                e.preventDefault();
                                                                showModal({
                                                                    content: (
                                                                        <DownloadDischargeSummary data={data.ipdId} />
                                                                    ),
                                                                    title: "Discharge Summary",
                                                                    size: "xl",
                                                                })
                                                            }}
                                                                className="view-item-btn"
                                                                to="#"
                                                            >
                                                                <i className="ri-eye-fill align-bottom text-pink"></i>
                                                            </Link>
                                                        </li>
                                                    </td>
                                                    {/* <td>{data.tax}(₹)</td>
                                                    <td>{data.netTotal}(₹)</td>
                                                    <td>{data.amount}(₹)</td> */}
                                                </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={8} className="text-center">No records available</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                                <Paginator
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    pageSize={pageSize}
                                    handlePageSizeChange={handlePageSizeChange}
                                    handlePrevious={handlePrevious}
                                    handleNext={handleNext}
                                    disableNext={data.length === 0}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}
export default IPDDischargedPatientList