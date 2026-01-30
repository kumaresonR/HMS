import React, { useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    Button,
    Input,
    CardBody,
} from "reactstrap";
import TableContainer from "../../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";


// Define a type for the language data
interface LanguageData {
    id: number;
    language: string;
    shortCode: string;
    countryCode: string;
    status: string;
    active: boolean;
    isRtl: boolean;
}

const LanguageList = () => {
    // Dummy language data
    const languageData: LanguageData[] = [
        { id: 1, language: 'English', shortCode: 'EN', countryCode: 'US', status: 'Active', active: true, isRtl: false },
        { id: 2, language: 'Spanish', shortCode: 'ES', countryCode: 'ES', status: 'Active', active: true, isRtl: false },
        { id: 3, language: 'Arabic', shortCode: 'AR', countryCode: 'AE', status: 'Inactive', active: false, isRtl: true },
        { id: 4, language: 'French', shortCode: 'FR', countryCode: 'FR', status: 'Active', active: true, isRtl: false },
        { id: 5, language: 'Chinese', shortCode: 'ZH', countryCode: 'CN', status: 'Active', active: true, isRtl: false },
        { id: 6, language: 'Hindi', shortCode: 'HI', countryCode: 'IN', status: 'Inactive', active: false, isRtl: false },
        { id: 7, language: 'Russian', shortCode: 'RU', countryCode: 'RU', status: 'Active', active: true, isRtl: false },
        { id: 8, language: 'Hebrew', shortCode: 'HE', countryCode: 'IL', status: 'Active', active: true, isRtl: true },
    ];

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    // Updated language columns
    const languageColumns = [
        {
            header: '#',
            accessorKey: 'id',
            enableColumnFilter: false,
        },
        {
            header: 'Language',
            accessorKey: 'language',
            enableColumnFilter: false,
        },
        {
            header: 'Short Code',
            accessorKey: 'shortCode',
            enableColumnFilter: false,
        },
        {
            header: 'Country Code',
            accessorKey: 'countryCode',
            enableColumnFilter: false,
        },
        {
            header: 'Status',
            accessorKey: 'status',
            enableColumnFilter: false,
        },
        {
            header: 'Active',
            accessorKey: 'active',
            Cell: ({ row }: { row: { original: LanguageData } }) => (
                <span>{row.original.active ? 'Yes' : 'No'}</span>
            ),
            enableColumnFilter: false,
        },
        {
            header: 'Is RTL',
            accessorKey: 'isRtl',
            Cell: ({ row }: { row: { original: LanguageData } }) => (
                <span>{row.original.isRtl ? 'Yes' : 'No'}</span>
            ),
            enableColumnFilter: false,
        },
        {
            header: "Action",
            cell: (cell: any) => {

                return (
                    <div className="form-check form-switch form-check-right mb-2">
                        <Input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckRightDisabled" defaultChecked />
                    </div>
                );
            },
        },
    ];

    // Handler for delete action
    const handleDelete = (id: number) => {
        // Implement delete logic here
        console.log(`Deleted language entry with id: ${id}`);
    };

    return (
        <React.Fragment>
            <div>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={languageData}
                />

                <Container fluid>

                    <Row>
                        <Col lg={12}>
                            <Card id="languageList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0">Language List</h5>
                                            </div>
                                        </div>
                                        <div className="col-sm-auto">
                                            <div>
                                                <button type="button" className="btn btn-secondary" onClick={() => setIsExportCSV(true)}>
                                                    <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                    Export
                                                </button>
                                            </div>
                                        </div>
                                    </Row>
                                </CardHeader>
                                <CardBody>



                                    <div>
                                        <TableContainer
                                            columns={languageColumns}
                                            data={languageData}
                                            isGlobalFilter={true}
                                            isCustomerFilter={true}
                                            customPageSize={5}
                                            tableClass="table table-bordered"
                                            theadClass="thead-light"
                                            divClass="table-responsive"
                                        />
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default LanguageList;
