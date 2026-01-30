import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    Col,
    Input,
    Label,
    Row,
} from "reactstrap";
import TableContainer from "../../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";
import ReportApiService from "../../../helpers/services/report/report-api-service";
import { timeDurationData } from "../../../common/data/FakeData";
import SetupApiService from "../../../helpers/services/setup/setup-api-service";

const ExpiryMedicineReport = () => {
    const reportApiService: ReportApiService = new ReportApiService();
    const setupApiService: SetupApiService = new SetupApiService();

    const [medicineCategoryData, setMedicineCategoryData] = useState([]);
    const [supplierData, setSupplierData] = useState([]);
    const [supplier, setSupplier] = useState('');
    const [expiryMedicineData, setExpiryMedicineData] = useState([]);
    const [medicineCategory, setMedicineCategory] = useState('');
    const [timeDuration, setTimeDuration] = useState('');
    const [timeDurationValidationError, setTimeDurationValidationError] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const expiryMedicineColumns = [
        {
            header: 'Medicine Name',
            accessorKey: 'medicineName',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue() ? info.getValue() : 'N/A'}
                </div>
            ),
        },
        {
            header: 'Batch No',
            accessorKey: 'batchNo',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div>
                    {info.getValue() ? info.getValue() : 'N/A'}
                </div>
            ),
        },
        // {
        //     header: 'Company Name',
        //     accessorKey: 'companyName',
        //     enableColumnFilter: false,
        //     cell: (info: any) => (
        //         <div className=" text-primary">
        //             {info.getValue()}

        //         </div>
        //     ),
        // },
        {
            header: 'Medicine Category',
            accessorKey: 'medicineCategory',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div>
                    {info.getValue() ? info.getValue() : 'N/A'}
                </div>
            ),
        },
        // {
        //     header: 'Medicine Group',
        //     accessorKey: 'medicineGroup',
        //     enableColumnFilter: false,

        // },
        // {
        //     header: 'Supplier',
        //     accessorKey: 'supplier',
        //     enableColumnFilter: false,

        // },
        {
            header: 'Expire Date',
            accessorKey: 'expireDate',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div>
                    {info.getValue() ? info.getValue() : 'N/A'}
                </div>
            ),
        },
        {
            header: 'Quantity',
            accessorKey: 'quantity',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div>
                    {info.getValue() ? info.getValue() : 'N/A'}
                </div>
            ),
        },
    ];

    const getAllPatientData = async () => {
        try {
            if (!timeDuration) {
                setTimeDurationValidationError(true);
                return [];
            } else {
                setTimeDurationValidationError(false);
            }
            if (timeDuration === "Period" && (!startDate || !endDate)) {
                toast.warning("Start Date and End Date are required for Period", { containerId: 'TR' });
                return [];
            }
            const params = new URLSearchParams();

            if (medicineCategory) params.append("medicineCategory", medicineCategory);
            if (timeDuration && timeDuration !== "Period") {
                params.append("timeDuration", timeDuration);
            }

            if (timeDuration === "Period") {
                params.append("startDate", startDate);
                params.append("endDate", endDate);
            }

            const url = `expiry-medicines?${params.toString()}`;
            let result = await reportApiService.getAllExpiryMedicineReport(url);
            setExpiryMedicineData(result);
            return result || [];
        } catch (error: any) {
            toast.error(error.message, { containerId: 'TR' });
            return [];
        }
    }

    const getAllMedicineCategory = async () => {
        try {
            let data = await setupApiService.getAllMedicineCategory();
            setMedicineCategoryData(data);
        } catch (error) {
            console.log(error);
        }
    }

    const getAllSupplier = async () => {
        try {
            const result = await setupApiService.getAllSupplier();
            setSupplierData(result);
        } catch (error: any) {
            console.error("Error in getAllSupplier:", error);
        }
    };

    useEffect(() => {
        // getAllSupplier();
        getAllMedicineCategory();
    }, []);

    return (
        <React.Fragment>
            <div>
                <h5 className="card-title mb-4">Expiry Medicine Report</h5>
                <Row>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label
                                className="form-label"
                                htmlFor="duration-input"
                            >
                                Time Duration <span className='text-danger'> * </span>
                            </Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="pathology-duration-input"
                                value={timeDuration}
                                onChange={e => setTimeDuration(e.target.value)}
                                invalid={!!timeDurationValidationError}
                            >
                                <option value=''>Select Duration</option>
                                {timeDurationData.map((data, idx) => (
                                    <option key={idx} value={data.code}>{data.duration}</option>
                                ))}
                            </Input>
                            {timeDurationValidationError && <div className="invalid-feedback">Time Duration Required.</div>}
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label
                                className="form-label"
                                htmlFor="medicine-category-input"
                            >
                                Medicine Category
                            </Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="medicine-category-input"
                                value={medicineCategory}
                                onChange={(e) => { setMedicineCategory(e.target.value) }}
                            >
                                <option value=''>Select Category</option>
                                {medicineCategoryData.map((data: any, idx: any) => (
                                    <option key={idx} value={data.categoryName}>{data.categoryName}</option>
                                ))}
                            </Input>
                        </div>
                    </Col>
                    {/* <Col lg={4}>
                        <div className="mb-3">
                            <Label
                                className="form-label"
                                htmlFor="supplier-input"
                            >
                                Supplier
                            </Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="supplier-input"
                                value={supplier}
                                onChange={(e) => setSupplier(e.target.value)}
                            >
                                <option>Select Supplier</option>
                                {supplierData.map((item: any, idx: any) => (
                                    <option key={idx} value={item.supplierId}>{item.supplierName}</option>
                                ))}
                            </Input>
                        </div>
                    </Col> */}

                    {timeDuration === 'Period' && (
                        <>
                            <Col lg={4}>
                                <div className="mb-3">
                                    <Label
                                        className="form-label"
                                        htmlFor="DateFrom"
                                    >
                                        Date From
                                    </Label>
                                    <Input
                                        type="date"
                                        className="form-control"
                                        id="DateFrom"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className="mb-3">
                                    <Label
                                        className="form-label"
                                        htmlFor="DateTo"
                                    >
                                        Date To
                                    </Label>
                                    <Input
                                        type="date"
                                        className="form-control"
                                        id="DateTo"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </Col>
                        </>
                    )}
                </Row>

                <Row>
                    <Col lg={12} className="px-0">
                        <Card id="expiryMedicineReport">
                            <CardHeader className="border-0">
                                <Row className="g-4">
                                    <div className="col-sm">
                                        
                                    </div>

                                    <div className="col-sm-auto">
                                        <div>
                                            <button type="button" onClick={getAllPatientData}
                                                className="btn btn-primary">
                                                Search
                                            </button>
                                        </div>
                                    </div>
                                </Row>
                            </CardHeader>

                            <div className="card-body pt-0">
                                <div>
                                    <TableContainer
                                        columns={expiryMedicineColumns}
                                        data={expiryMedicineData}
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
            </div>
        </React.Fragment>
    );
};

export default ExpiryMedicineReport;
