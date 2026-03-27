import { Link, useLocation, useNavigate } from "react-router-dom";
import PharmacyApiService from "../../helpers/services/pharmacy/pharmacy-api-service";
import { useEffect, useRef, useState } from "react";
import React from "react";
import FormHeader from "../../common/FormHeader/FormHeader";
import { Button, Card, CardBody, CardHeader, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row, Table, UncontrolledDropdown } from "reactstrap";
import AddPharmacyBill from "./AddPharmacyBill";
import PharmacyDataTable from "./PharmacyDataTable";
import { IoArrowBack } from "react-icons/io5";
import { faFilter, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RoleBasedComponent from "../../common/RolePermission/RoleBasedComponent";
import Paginator from "../../common/pagenator/pagenator";
import { minimizePage } from "../../slices/pageResizer/uiSlice";
import { useDispatch } from "react-redux";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { options } from "@fullcalendar/core/preact";
import PatientApiService from "../../helpers/services/patient/patient-api-service";

const Pharmacy = () => {
    const patientApiService: PatientApiService = new PatientApiService();
    const pharmacyApiService: PharmacyApiService = new PharmacyApiService();
    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [pharmacyData, setPharmacyData] = useState<any>([]);
    const [createPharmacyBillModal, setCreatePharmacyBillModal] = useState<boolean>(false);
    const [selectedFilter, setSelectedFilter] = useState("Patient Id");
    const [selectedSearchTerm, setSelectedSearchTerm] = useState("");
    const typeaheadRef = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<[]>([]);
    const [patientId, setPatientId] = useState("");
    const [ipdOrOpdId, setIpdOrOpdId] = useState("");

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

    const createPharmacyBill = () => {
        handleColse()
    }
    function handleColse() {
        setCreatePharmacyBillModal(!createPharmacyBillModal);
        getAllPharmacyBill(currentPage, pageSize)
    }

    const refresh = () => {
        getAllPharmacyBill(currentPage, pageSize);
    }

    const handleFilterSelect = (filterType: any) => {
        setSelectedFilter(filterType);
        setSelectedSearchTerm('')
    };

    const handlePatientSearch = async (query: any) => {
        setIsLoading(true);
        try {
            let url = "getPatientData?searchTerm=" + query
            let result = await patientApiService.searchPatient(url);
            setOptions(result.data)
        } catch (error) {
            console.log("Patient search Error");
        } finally {
            setIsLoading(false);
        }
    }

    const onSelectedPatientId = (selectedItem: any) => {
        const patientId = selectedItem?.[0]?.['patientId'];
        setPatientId(patientId);
    }

    const onSearch = async () => {
        try {
            const params = new URLSearchParams();
            if (ipdOrOpdId) params.append('ipdOrOpdId', ipdOrOpdId);
            if (patientId) params.append('patientId', patientId);
            const queryString = params.toString();
            let result = await pharmacyApiService.searchPharmacyBySearchTearm(queryString);
            setPharmacyData(result);
        } catch (error: any) {
            setPharmacyData([]);
        }
    }

    const reset = () => {
        setIpdOrOpdId("");
        setPatientId("");
        if (typeaheadRef.current) {
            typeaheadRef.current.clear();
        }
        setOptions([]);
        getAllPharmacyBill(currentPage, pageSize);
    }

    const getAllPharmacyBill = async (page: number, size: number) => {
        try {
            let url = `?page=${page}&size=${size}`;
            let result = await pharmacyApiService.getAllPharmacyBill(url);
            setPharmacyData(result);
            if (result && result.length) {
                const totalPatients = result.length;
                setTotalPages(Math.ceil(totalPatients / size));
            }
            return result || [];
        } catch (error: any) {
            console.log(error);
            return [];
        }
    }

    const GetMedicines = () => {
        navigate('/main/medicine-stock')
    }

    useEffect(() => {
        const loadPages = async () => {
            const currentPageData = await getAllPharmacyBill(currentPage, pageSize);
            setPharmacyData(currentPageData);
        };

        loadPages();
    }, [currentPage, pageSize]);

    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader title="Pharmacy Bill"
                    onMinimize={() => dispatch(minimizePage({
                        route: location.pathname,
                        pageName: "Pharmacy Bill",
                    }))} />
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardHeader className="border-0 align-items-center d-flex justify-content-between">
                                <div className="ms-auto">
                                    <RoleBasedComponent allowedRoles={["SUPERADMIN","PHARMACIST"]}>
                                        <Button
                                            color="primary"
                                            className="btn btn-primary "
                                            onClick={() => createPharmacyBill()}>
                                            <FontAwesomeIcon icon={faPlus} className='me-2' /> Generate Bill
                                        </Button>
                                    </RoleBasedComponent>
                                    <Button
                                        color="primary"
                                        className="btn btn-primary mx-2" onClick={() => GetMedicines()}>
                                        <FontAwesomeIcon icon={faPlus} className='me-2' /> Medicines
                                    </Button>
                                    <Link to="/main/Pharmacy-dashboard" className="ms-3">
                                        <Button color="light" className="bg-gradient backBtn">
                                            <IoArrowBack />
                                        </Button>
                                    </Link>
                                </div>

                            </CardHeader>
                            <CardBody>
                                <Row className="align-items-center mb-2">
                                    <Col xs="auto">
                                        <UncontrolledDropdown className="card-header-dropdown pb-4">
                                            <DropdownToggle tag="a" className="text-reset dropdown-btn" role="button">
                                                <span className="text-muted">
                                                    <FontAwesomeIcon icon={faFilter} /> Filter By: {selectedFilter} <i className="mdi mdi-chevron-down ms-1"></i>
                                                </span>
                                            </DropdownToggle>
                                            <DropdownMenu className="dropdown-menu-end">
                                                <DropdownItem onClick={() => handleFilterSelect("Patient Id")}>Patient Id</DropdownItem>
                                                <DropdownItem onClick={() => handleFilterSelect("ipdOrOpdId")}>OPD Or IPD ID</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </Col>

                                    <Col>
                                        {selectedFilter === "Patient Id" && (
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
                                        )}

                                        {selectedFilter === "ipdOrOpdId" && (
                                            <input
                                                type="search"
                                                placeholder="Search by OPD Or IPD Id"
                                                value={ipdOrOpdId}
                                                onChange={(e: any) => setIpdOrOpdId(e.target.value)}
                                                className="form-control"
                                            />
                                        )}
                                    </Col>
                                    <Col xs="auto">
                                        <Button onClick={onSearch} className=" mx-1">Search</Button>
                                        <Button className="mx-1" color="danger" onClick={reset}>Reset</Button>
                                    </Col>
                                </Row>

                                <PharmacyDataTable data={pharmacyData} refresh={refresh} />
                                <Paginator
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    pageSize={pageSize}
                                    handlePageSizeChange={handlePageSizeChange}
                                    handlePrevious={handlePrevious}
                                    handleNext={handleNext}
                                    disableNext={pharmacyData?.length === 0 || pharmacyData?.length < pageSize}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <Modal isOpen={createPharmacyBillModal} toggle={handleColse}
                backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable
            >
                <ModalHeader toggle={handleColse} className="p-3 bg-info-subtle modal-title model-header-container">
                    Generate Pharmacy Bill
                </ModalHeader>
                <ModalBody>
                    <AddPharmacyBill handleClose={handleColse} />
                </ModalBody>
            </Modal>

        </React.Fragment>
    )
}
export default Pharmacy