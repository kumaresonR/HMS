import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardBody, Col, Container, Row, Table } from "reactstrap";
import OPDApiService from "../../../helpers/services/opd/opd-api-service";
import moment from "moment";
import Paginator from "../../../common/pagenator/pagenator";

const PatientViewDataTable = (props: any) => {
    const opdApiService: OPDApiService = new OPDApiService();

    let navigate: any = useNavigate();
    const [name, setName] = useState<any>(props?.title);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState(data);
    const [selectedSearchTerm, setSelectedSearchTerm] = useState("");

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

    const viewIpdOverview = (data: any) => {
        if (name) {
            navigate('/main/patient-profile', { state: { data: data } })
        } else {
            navigate('/main/OPD-patient-overview', { state: { data: data } })
        }
    }

    const getAllOPD = async (page: number, size: number) => {
        try {
            const url = `all?page=${page}&size=${size}`;
            let data = await opdApiService.getAllOPD(url);
            setData(data);
            console.log('getAllOPD data', data);
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

    const onSearch = async (value: any) => {
        try {
            if (!value || value.trim() === "") {
                getAllOPD(currentPage, pageSize);
            } else {
                let url = "searchTerm=" + value;
                let result = await opdApiService.searchOPDBySearchTearm(url);
                setData(result);
            }
        } catch (error: any) {
            setData([]);
        }
    }

    const reset = () => {
        setSelectedSearchTerm("");
        getAllOPD(currentPage, pageSize);
    }

    useEffect(() => {
        const loadPages = async () => {
            const currentPageData = await getAllOPD(currentPage, pageSize);
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
            item.opdId.toString().toLowerCase().includes(searchTerm) ||
            `${item.patient?.firstName} ${item.patient?.lastName}`.toLowerCase().includes(searchTerm) ||
            `${item.doctor?.firstName} ${item.doctor?.lastName}`.toLowerCase().includes(searchTerm)
        );

        setFilteredData(filteredResults);
    }, [searchTerm, data]);

    return (
        <React.Fragment>
            <Container fluid>
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardBody>
                                <Row className="align-items-center mb-2">
                                    <Col>
                                        <input
                                            type="search"
                                            placeholder="Search by OPD No, Patient Name, or Patient Id"
                                            onChange={(e: any) => onSearch(e.target.value)}
                                            className="form-control"
                                        />
                                    </Col>
                                </Row>
                                {/* <input
                                    type="text"
                                    placeholder="Search by OPD No, Name, or Doctor"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="form-control mb-3"
                                /> */}
                                <div className="table-responsive">
                                    <Table hover className="table-centered table-bordered align-middle table-nowrap mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Patient Name</th>
                                                <th>Patient ID</th>
                                                <th>Guardian Name</th>
                                                <th>Gender </th>
                                                <th>Phone</th>
                                                <th>Consultant</th>
                                                <th>Last Visit</th>
                                                <th>Is Antenatal</th>
                                                <th>No Of Visits</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredData && filteredData.length > 0 ? (
                                                filteredData?.map((data: any, idx: any) => (
                                                    <tr key={idx}>
                                                        <td className="text-primary">
                                                            <a href="#" onClick={(event) => {
                                                                event.preventDefault();
                                                                viewIpdOverview(data.opdId);
                                                            }}>
                                                                {data.patient?.firstName}
                                                            </a>
                                                        </td>
                                                        <td className="text-primary">{data.patientId}</td>
                                                        <td>{data?.patient?.emergencyContacts[0]?.contactName || 'NA'}</td>
                                                        <td>{data?.patient?.gender || 'NA'}</td>
                                                        <td className="text-primary">{data?.patient?.contactNumber || 'NA'} </td>
                                                        <td className="text-nowrap">{data.doctor?.firstName} {data.doctor?.lastName} ({data.doctor?.staffId})</td>
                                                        <td>{moment(data?.patient?.lastVisit).format('DD/MM/YYYY, hh:mm A') || 'NA'}</td>
                                                        <td className={data.antenatal ? "text-success" : "text-danger"}>
                                                            {data.antenatal ? "Yes" : "No"}
                                                        </td>

                                                        <td className="text-primary">{data?.patient?.totalReCheckup || 'NA'} </td>
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
export default PatientViewDataTable