import React, { useState } from "react";
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
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

const InventoryItemReport = () => {
    const inventoryItemData = [
        { name: 'Paracetamol', category: 'Medicine', supplier: 'MediSupply Inc.', store: 'Pharmacy 1', date: '2024-01-01', quantity: 100, purchasePrice: 5 },
        { name: 'Syringe Pack', category: 'Medical Equipment', supplier: 'HealthEquip Ltd.', store: 'Store Room 2', date: '2024-01-02', quantity: 500, purchasePrice: 2 },
        { name: 'Hospital Bed', category: 'Furniture', supplier: 'MediFurniture Co.', store: 'Store Room 1', date: '2024-01-03', quantity: 10, purchasePrice: 1500 },
        { name: 'Surgical Gloves', category: 'Supplies', supplier: 'MediSupply Inc.', store: 'Store Room 3', date: '2024-01-04', quantity: 200, purchasePrice: 1 },
        { name: 'Antibiotic Ointment', category: 'Medicine', supplier: 'PharmaCare Ltd.', store: 'Pharmacy 1', date: '2024-01-05', quantity: 50, purchasePrice: 20 },
        { name: 'Bandages', category: 'Supplies', supplier: 'HealthEquip Ltd.', store: 'Store Room 2', date: '2024-01-06', quantity: 300, purchasePrice: 0.5 },
        { name: 'IV Stand', category: 'Medical Equipment', supplier: 'MediFurniture Co.', store: 'Store Room 3', date: '2024-01-07', quantity: 15, purchasePrice: 75 },
        { name: 'Digital Thermometer', category: 'Medical Equipment', supplier: 'HealthEquip Ltd.', store: 'Pharmacy 1', date: '2024-01-08', quantity: 30, purchasePrice: 10 },
    ];


    const [isExportCSV, setIsExportCSV] = useState(false);

    const inventoryItemColumns = [
        {
            header: 'Name',
            accessorKey: 'name',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary text-nowrap">
                    {info.getValue()}
    
                </div>
            ),
        },
        {
            header: 'Category',
            accessorKey: 'category',
            enableColumnFilter: false,
           
        },
        {
            header: 'Supplier',
            accessorKey: 'supplier',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary text-nowrap">
                    {info.getValue()}
    
                </div>
            ),
        },
        {
            header: 'Store',
            accessorKey: 'store',
            enableColumnFilter: false,
         
        },
        {
            header: 'Date',
            accessorKey: 'date',
            enableColumnFilter: false,
            
        },
        {
            header: 'Quantity',
            accessorKey: 'quantity',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary text-nowrap">
                    {info.getValue()}
    
                </div>
            ),
        },
        {
            header: 'Purchase Price',
            accessorKey: 'purchasePrice',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary text-nowrap">
                    {info.getValue()}
    
                </div>
            ),
        },
    ];

    return (
        <React.Fragment>
            <div>
                <h5 className="card-title mb-4">Inventory Item Report</h5>
                <Row>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label
                                className="form-label"
                                htmlFor="inventory-time-duration-input"
                            >
                                Time Duration
                            </Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="inventory-time-duration-input"
                            >
                                <option>Select Duration</option>
                                <option>30 mins</option>
                                <option>1 hour</option>
                                <option>2 hours</option>
                            </Input>
                        </div>
                    </Col>
                </Row>

                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={inventoryItemData}
                />

                <Row>
                    <Col lg={12} className="px-0">
                        <Card id="inventoryItemReport">
                               <CardHeader className="border-0">
                                                            <Row className="g-4 align-items-center">
                                                                <div className="col-sm">
                            
                                                                </div>
                                                                <div className="col-sm-auto">
                                                                    <div>
                                                                        <button type="button" className="btn btn-primary" onClick={() => setIsExportCSV(true)}>
                                                                            <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                                            Export
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-auto">
                            
                                                                    <div className="input-group">
                            
                                                                        <Input
                                                                            type="text"
                                                                            className="form-control"
                                                                            id="Search"
                                                                            placeholder="Search..."
                                                                        />
                                                                        <span className="input-group-text searchBtn">
                                                                            <i className="ri-search-2-line label-icon align-middle fs-16 ms-2"></i>
                                                                        </span>
                                                                    </div>
                            
                            
                                                                </div>
                                                            </Row>
                                                        </CardHeader>

                            <div className="card-body pt-0">
                                <div>
                                    <TableContainer
                                        columns={inventoryItemColumns}
                                        data={inventoryItemData}
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

export default InventoryItemReport;
