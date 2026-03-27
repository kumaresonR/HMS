import React, { useEffect, useState } from "react"
import { Button, Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap"
import FormHeader from "../../../common/FormHeader/FormHeader"
import PathologyCommonTable from "../../Pathology/PathologyCommonTable"
import BillingApiService from "../../../helpers/services/billing/billing-api-service"
import { IoArrowBack } from "react-icons/io5"
import { Link, useLocation } from "react-router-dom"
import Paginator from "../../../common/pagenator/pagenator"
import { minimizePage } from "../../../slices/pageResizer/uiSlice"
import { useDispatch } from "react-redux"

const PathologyBilling = () => {
    const billingApiService: BillingApiService = new BillingApiService();
    const dispatch = useDispatch();
    const location = useLocation();
    const [pathologyData, setPathologyData] = useState<any>([]);

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

    const getAllPathologyBill = async (page: number, size: number) => {
        try {
            let url = `?page=${page}&size=${size}`;
            let result = await billingApiService.getPathologyBill(url);
            setPathologyData(result);
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
            const currentPageData = await getAllPathologyBill(currentPage, pageSize);
            setPathologyData(currentPageData);
        };

        loadPages();
    }, [currentPage, pageSize]);

    return <>
        <React.Fragment>
            <Container fluid>
                <FormHeader
                    title="Pathology Billing"
                    pageTitle="Billing"
                    onMinimize={() => dispatch(minimizePage({
                        route: location.pathname,
                        pageName: "Pathology Billing",
                    }))} />
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardHeader className="border-0 align-items-center d-flex flex-wrap justify-content-between">
                                <h4 className="card-title mb-0">Pathology Billing</h4>
                                <Link to="/main/billing" className="ms-3">
                                    <Button color="light" className="bg-gradient backBtn">
                                        <IoArrowBack />
                                    </Button>
                                </Link>

                            </CardHeader>
                            <CardBody>
                                <PathologyCommonTable title="Billing" refresh={getAllPathologyBill} data={pathologyData} />
                                <Paginator
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    pageSize={pageSize}
                                    handlePageSizeChange={handlePageSizeChange}
                                    handlePrevious={handlePrevious}
                                    handleNext={handleNext}
                                    disableNext={pathologyData?.length === 0 || pathologyData?.length < pageSize}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    </>
}
export default PathologyBilling