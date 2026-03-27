import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Badge } from 'reactstrap';
import PharmacyApiService from '../../../helpers/services/pharmacy/pharmacy-api-service';
import Paginator from '../../../common/pagenator/pagenator';
import TableContainer from '../../../Components/Common/TableContainer';


const MedicineDetails = () => {
    const pharmacyApiService: PharmacyApiService = new PharmacyApiService();

    const [medicineStockData, setMedicineStockData] = useState<any>([]);

    const medicineStockColumns = [
        {
            header: 'Medicine Name',
            accessorKey: 'name',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Medicine Company',
            accessorFn: (row: any) => row.companyDetails?.companyName || 'N/A',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Medicine Category',
            accessorKey: 'category',
            enableColumnFilter: false,

        },
        
        {
            header: 'Expiry Date',
            accessorKey: 'expiryDate',
            enableColumnFilter: false,

        },
        {
            header: 'Quantity Sold',
            accessorKey: 'boxPacking',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue()}
                </div>
            ),
        },

    ];

    const getAllMedicineStock = async () => {
        try {
            let url = "all"
            let result = await pharmacyApiService.getAllMedicineStock(url);
            console.log("getAllMedicineStock", result);
            setMedicineStockData(result);
        } catch (error: any) {
            console.log("getAllMedicineStock Error");
            console.log(error);
        }
    }

    useEffect(() => {
        getAllMedicineStock();
    }, []);

    return (
        <Card>
            <CardHeader className="d-flex align-items-center">
                <h4 className="card-title flex-grow-1 mb-0">Medicine Stock Details</h4>
            </CardHeader>
            <CardBody>
                <TableContainer
                    columns={medicineStockColumns}
                    data={medicineStockData}
                    isGlobalFilter={true}
                    isCustomerFilter={true}
                    customPageSize={5}
                    tableClass="table table-bordered"
                    theadClass="thead-light"
                    divClass="table-responsive"
                />
            </CardBody>
        </Card>
    );
};

export default MedicineDetails;
