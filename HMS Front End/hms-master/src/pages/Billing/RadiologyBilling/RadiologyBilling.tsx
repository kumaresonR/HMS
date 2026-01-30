import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, CardBody, Button, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import FormHeader from "../../../common/FormHeader/FormHeader";
import BillingApiService from "../../../helpers/services/billing/billing-api-service";
import PathologyCommonTable from "../../Pathology/PathologyCommonTable";
import { IoArrowBack } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import Paginator from "../../../common/pagenator/pagenator";
import { useDispatch } from "react-redux";
import { minimizePage } from "../../../slices/pageResizer/uiSlice";
import PatientApiService from "../../../helpers/services/patient/patient-api-service";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AsyncTypeahead } from "react-bootstrap-typeahead";

const RadiologyBilling = () => {
    const billingApiService: BillingApiService = new BillingApiService();
    const patientApiService: PatientApiService = new PatientApiService();

    const dispatch = useDispatch();
    const location = useLocation();
    const [radiologyData, setRadiologyData] = useState<any>([1]);
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
            let result = await billingApiService.searchRadiologyBySearchTearm(queryString);
            setRadiologyData(result);
        } catch (error: any) {
            setRadiologyData([]);
        }
    }

    const reset = () => {
        setIpdOrOpdId("");
        setPatientId("");
        typeaheadRef.current.clear();
        setOptions([]);
        getAllBill(currentPage, pageSize);
    }

    const getAllBill = async (page: number, size: number) => {
        try {
            let url = `?page=${page}&size=${size}`;
            let result = await billingApiService.getRadiologyBill(url);
            setRadiologyData(result);
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

    useEffect(() => {
        const loadPages = async () => {
            const currentPageData = await getAllBill(currentPage, pageSize);
            setRadiologyData(currentPageData);
        };

        loadPages();
    }, [currentPage, pageSize]);

    return <>
        <React.Fragment>
            <Container fluid>
                <FormHeader
                    title="Radiology Billing"
                    pageTitle="Billing"
                    onMinimize={() => dispatch(minimizePage({
                        route: location.pathname,
                        pageName: "Radiology Billing",
                    }))} />
                <Row>
                    <Col sm={12}>
                        <Card>

                            <CardHeader className="border-0 align-items-center d-flex flex-wrap justify-content-between">
                                <h4 className="card-title mb-0">Radiology Billing</h4>
                                <Link to="/main/billing" className="ms-3">
                                    <Button color="light" className="bg-gradient backBtn">
                                        <IoArrowBack />
                                    </Button>
                                </Link>

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
                                <PathologyCommonTable title="Billing" refresh={getAllBill} data={radiologyData} />
                                <Paginator
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    pageSize={pageSize}
                                    handlePageSizeChange={handlePageSizeChange}
                                    handlePrevious={handlePrevious}
                                    handleNext={handleNext}
                                    disableNext={radiologyData?.length === 0 || radiologyData?.length < pageSize}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    </>
}
export default RadiologyBilling