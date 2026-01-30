import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    Button,
} from "reactstrap";
import TableContainer from "../../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import SetupApiService from "../../../helpers/services/setup/setup-api-service";
import ErrorHandler from "../../../helpers/ErrorHandler";
import avaliableBed from "../../../assets/images/avaliablebeds.png";
import notAvaliableBed from "../../../assets/images/notavaliableBed.png";

const BedStatus = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    const [bedData, setBedData] = useState([]);

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    const bedStatusColumns = [
        {
            header: "Bed Name",
            accessorKey: "name",
            enableColumnFilter: false,
            cell: (info: any) => {
                const { roomStatus, notAvailable } = info.row.original;

                let bedImage = avaliableBed;
                if (notAvailable === true) {
                    bedImage = notAvaliableBed;
                } else if (roomStatus === true) {
                    bedImage = notAvaliableBed;
                }

                return (
                    <div className="bg-white shadow-md rounded-lg flex flex-col items-center justify-between h-full text-center p-2">
                        <div className="text-primary text-lg font-semibold">
                            {info.getValue()}
                        </div>
                        <img
                            src={bedImage}
                            alt="Patient in bed"
                            height="50px"
                            className="mt-2 h-24 object-contain"
                        />
                    </div>
                );
            },
        },
        {
            header: 'Bed Type',
            accessorKey: 'bedType.name',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary">
                    {info.getValue()}

                </div>
            ),
        },
        {
            header: 'Bed Group',
            accessorKey: 'bedGroup.name',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Floor',
            accessorKey: 'bedGroup.floor.floorName',
            enableColumnFilter: false, cell: (info: any) => (
                <div className=" text-primary">
                    {info.getValue()}

                </div>
            ),
        },
        // {
        //     header: 'Status',
        //     accessorKey: 'roomStatus',
        //     enableColumnFilter: false,
        //     cell: (info: any) => {
        //         const roomStatus = info.getValue(); 
        //         return (
        //             <span className={roomStatus === true ? 'text-danger p-2 badge' : 'text-success p-2 badge'}>{roomStatus ? 'Allotted' : 'Available'}</span>
        //         );
        //     },
        // }
        {
            header: 'Status',
            accessorKey: 'roomStatus',
            enableColumnFilter: false,
            cell: (info: any) => {
                const roomStatus = info.getValue();
                const notAvailable = info.row.original.notAvailable;
                let statusLabel = roomStatus ? 'Allotted' : 'Available';
                let statusClass = roomStatus ? 'text-danger p-2 badge' : 'text-success p-2 badge';
                if (notAvailable === true) {
                    statusLabel = 'Not Available for Use';
                    statusClass = 'text-warning p-2 badge';
                }
                return (
                    <span className={statusClass}>{statusLabel}</span>
                    // <span className={roomStatus === true ? 'text-danger p-2 badge' : 'text-success p-2 badge'}>{roomStatus ? 'Allotted' : 'Available'}</span>
                );
            },
        }
    ];

    const getAllBed = async () => {
        try {
            let result = await setupApiService.getAllMasterBed();
            setBedData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllBed();
    }, []);

    return (
        <React.Fragment>

            <Container fluid>

                <Row className="d-flex justify-content-center">
                    <Col xl={12} className="p-0">
                        <Card>
                            <ExportCSVModal
                                show={isExportCSV}
                                onCloseClick={() => setIsExportCSV(false)}
                                data={bedData}
                            />

                            <Row>
                                <Col lg={12}>
                                    <Card id="bedStatus">
                                        <CardHeader className="border-0">
                                            <Row className="g-4 align-items-center">
                                                <div className="col-sm">
                                                    <div>
                                                        <h5 className="card-title mb-0">Bed Status</h5>
                                                    </div>
                                                </div>

                                                <div className="col-sm-auto">
                                                    <div>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            className="btn btn-secondary"
                                                            onClick={() => setIsExportCSV(true)}
                                                        >
                                                            <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                            Export
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Row>
                                        </CardHeader>

                                        <div className="card-body pt-0">
                                            <div>
                                                <TableContainer
                                                    columns={bedStatusColumns}
                                                    data={bedData}
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

                        </Card>
                    </Col>
                </Row>
            </Container>

        </React.Fragment>
    );
};

export default BedStatus;
