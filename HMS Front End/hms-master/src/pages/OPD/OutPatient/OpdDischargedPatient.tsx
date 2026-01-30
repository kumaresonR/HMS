import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { IoIosShareAlt } from 'react-icons/io';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, Spinner, Table, Modal, ModalHeader, ModalBody } from 'reactstrap';
import Paginator from '../../../common/pagenator/pagenator';
import OPDApiService from '../../../helpers/services/opd/opd-api-service';
import EditIpdPatient from '../../IPD/InPatient/EditIpdPatient';

const OpdDischargedPatient = () => {
    const opdApiService: OPDApiService = new OPDApiService();
    let navigate: any = useNavigate();

    const [data, setData] = useState([]);
    const [previewData, setPreviewData] = useState('');
    // const [ipdData, setIpdData] = useState<any>([1]);
    const [moveToIpdClose, setMoveToIpdClose] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);

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

    const [filteredData, setFilteredData] = useState(data);

    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
    };

    const viewIpdOverview = (data: any) => {
        navigate('/main/OPD-overview', { state: { data: data } })
    }

    const moveToIpd = (data: any) => {
        setPreviewData(data);
        handleCloseMoveToIpd();
    }

    const handleCloseMoveToIpd = () => {
        setMoveToIpdClose(!moveToIpdClose)
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
    };
    

    const getAllOPD = async (page: number, size: number) => {
        setLoading(true);
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
        } finally {
            setLoading(false);
        }

    }

    const resetOPD = () => {
        localStorage.removeItem("opdId");
        localStorage.removeItem("activeTab");
    }

    useEffect(() => {
        resetOPD();
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
                                <div className="table-responsive">
                                    <Table hover className="table-centered table-bordered align-middle table-nowrap mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>OPD No </th>
                                                <th>Patient Name</th>
                                                {/* <th>Case ID</th> */}
                                                <th>Appointment Date </th>
                                                <th>Consultant </th>
                                                {/* <th>Reference</th>
                                                <th>Symptoms</th> */}
                                                <th>Is Antenatal </th>
                                                <th>Previous Medical Issue </th>
                                                <th>Closing Date</th>
                                                <th>Move To IPD  </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredData && filteredData?.length > 0 ? (
                                                filteredData?.map((data: any, idx: any) => (
                                                    <tr key={idx}>
                                                        <td>
                                                            <a href="#" onClick={(event) => {
                                                                event.preventDefault();
                                                                viewIpdOverview(data.opdId);
                                                            }}>
                                                                {data.opdId}
                                                            </a>
                                                        </td>
                                                        <td className="text-primary">{data.patient?.firstName}</td>
                                                        {/* <td>{data.caseId}</td> */}
                                                        <td>{moment(data.appointmentDate).format('DD/MM/YYYY hh:mm A')}</td>
                                                        <td className="text-primary">{data.doctor?.firstName} {data.doctor?.lastName} ({data.doctor?.staffId}) </td>

                                                        <td>{data.antenatal ? "Yes" : "No"}</td>
                                                        <td className="text-primary">{data.previousMedicalIssue || 'NA'} </td>
                                                        <td>{data.dischargeDate ? moment(data.dischargeDate).format('DD/MM/YYYY hh:mm A') : 'NA'}</td>
                                                        <td>
                                                            <ul className="list-inline hstack gap-2 mb-0">
                                                                {data.dischargeDate && (
                                                                    <li className="list-inline-item" title="Move In IPD">
                                                                        <Link
                                                                            className="view-item-btn"
                                                                            to="#"
                                                                            data-bs-toggle="modal"
                                                                            onClick={() => moveToIpd(data)}
                                                                        >
                                                                            <IoIosShareAlt className="text-purple" />
                                                                        </Link>
                                                                    </li>
                                                                )}
                                                            </ul>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={9} className="text-center">No records available</td>
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

            <Modal isOpen={moveToIpdClose} toggle={handleCloseMoveToIpd}
                backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable
            >
                <ModalHeader toggle={handleCloseMoveToIpd} className="p-3 bg-info-subtle modal-title">
                    Move To IPD
                </ModalHeader>
                <ModalBody>
                    <EditIpdPatient title="moveToIPD" data={previewData} handleClose={handleCloseMoveToIpd} />
                </ModalBody>
            </Modal>
        </React.Fragment>
    )
}
export default OpdDischargedPatient