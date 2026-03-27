import React, { useState } from "react";
import { Card, CardBody, Col, Row, Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import TableContainer from "../../Components/Common/TableContainer";
import "./myProfile.css";
import moment from "moment";
import PreviewLeaveReques from "../HumanResource/PreviewLeaveReques";
import { BsFillPersonFill } from "react-icons/bs";
import { FaBed } from "react-icons/fa";
import { GiBabyBottle } from "react-icons/gi";
import { MdAirlineSeatIndividualSuite } from "react-icons/md";

const LeavesInfo = (props: any) => {
    const data = props.data?.leaveRequests || [];
    const [editModel, setEditModel] = useState<boolean>(false);
    const [selectedLeaveData, setSelectedLeaveData] = useState<any>('');

    const LeavesDataWidgets = [
        {
            id: 1,
            cardColor: "primary",
            label: `Casual Leave ( ${props.data?.totalLeaves?.["CASUAL LEAVE"] || 0} )`,
            used: props.data?.usedLeaves?.["CASUAL LEAVE"] || 0,
            available: props.data?.availableLeaves?.["CASUAL LEAVE"] || 0,
            icon: MdAirlineSeatIndividualSuite,
            bgcolor: "primary",
        },
        {
            id: 2,
            cardColor: "secondary",
            label: `Privilege Leave ( ${props.data?.totalLeaves?.["PRIVILEGE LEAVE"] || 0} )`,
            used: props.data?.usedLeaves?.["PRIVILEGE LEAVE"] || 0,
            available: props.data?.availableLeaves?.["PRIVILEGE LEAVE"] || 0,
            icon: FaBed,
            bgcolor: "secondary",
        },
        {
            id: 3,
            cardColor: "success",
            label: `Sick Leave ( ${props.data?.totalLeaves?.["SICK LEAVE"] || 0} )`,
            used: props.data?.usedLeaves?.["SICK LEAVE"] || 0,
            available: props.data?.availableLeaves?.["SICK LEAVE"] || 0,
            icon: FaBed,
            bgcolor: "success",
        },
        {
            id: 4,
            cardColor: "info",
            label: `Maternity Leave ( ${props.data?.totalLeaves?.["MATERNITY LEAVE"] || 0} )`,
            used: props.data?.usedLeaves?.["MATERNITY LEAVE"] || 0,
            available: props.data?.availableLeaves?.["MATERNITY LEAVE"] || 0,
            icon: GiBabyBottle,
            bgcolor: "info",
        },
        {
            id: 5,
            cardColor: "warning",
            label: `Paternity Leave ( ${props.data?.totalLeaves?.["PATERNITY LEAVE"] || 0} )`,
            used: props.data?.usedLeaves?.["PATERNITY LEAVE"] || 0,
            available: props.data?.availableLeaves?.["PATERNITY LEAVE"] || 0,
            icon: BsFillPersonFill,
            bgcolor: "warning",
        },
        // {
        //     id: 6,
        //     cardColor: "danger",
        //     label: `Fever Leave ( ${props.data?.totalLeaves?.["FEVER LEAVE"] || 0} )`,
        //     used: props.data?.usedLeaves?.["FEVER LEAVE"] || 0,
        //     available: props.data?.availableLeaves?.["FEVER LEAVE"] || 0,
        //     icon: FaBed,
        //     bgcolor: "danger",
        // },
        {
            id: 5,
            cardColor: "warning",
            label: `LOP ( ${props.data?.totalLeaves?.["LOP"] || 0} )`,
            used: props.data?.usedLeaves?.["LOP"] || 0,
            available: props.data?.availableLeaves?.["LOP"] || 0,
            icon: BsFillPersonFill,
            bgcolor: "warning",
        },
    ];

    const leaveColumns = [
        {
            header: "Leave Type",
            accessorKey: "leaveType", enableColumnFilter: false,
            cell: (info: any) => info.getValue(),
        },
        {
            header: "Leave Date",
            accessorKey: "leaveDate",
            enableColumnFilter: false,
            cell: (info: any) => {
                const row = info.row.original;
                const startDate = moment(row.leaveFromDate).format("DD/MM/YYYY");
                const endDate = moment(row.leaveToDate).format("DD/MM/YYYY");
                return (
                    <span className="text-primary">
                        {startDate} - {endDate}
                    </span>
                );
            },
        },
        {
            header: "Days",
            accessorKey: "leaveDays",
            enableColumnFilter: false,
            cell: (info: any) => (
                <span className="text-purple">{info.getValue()}</span>
            ),
        },
        {
            header: "Apply Date",
            accessorKey: "applyDate",
            enableColumnFilter: false,
            cell: (info: any) => {
                const applyDate = moment(info.getValue()).format("DD/MM/YYYY");
                return <span>{applyDate}</span>;
            },
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: ({ row }: any) => (
                <span
                    className={`badge ${row.original.status === "APPROVED" ? "bg-success" : "bg-warning"
                        }`}
                >
                    {row.original.status}
                </span>
            ),
            enableColumnFilter: false,
        },
        // {
        //     header: "Approved Date",
        //     accessorKey: "approvedDate",
        //     cell: (info: any) => info.getValue(),
        //     enableColumnFilter: false,
        // },
        // {
        //     header: "Action",
        //     accessorKey: "action",
        //     enableColumnFilter: false,
        //     cell: (row:any) => (
        //         <Button color="primary" size="sm" onClick={() => edit(row)}>
        //             View
        //         </Button>
        //     ),
        // },
    ];

    const edit = (data: any) => {
        setSelectedLeaveData(data);
        handleEditClose();
    }

    const handleEditClose = () => {
        setEditModel(!editModel);
    }

    return (
        <React.Fragment>
            <Card>
                <CardBody className="myProfile">
                    <div>
                        <h5 className="card-title mb-4">Leaves Information</h5>

                        <Row>
                            {LeavesDataWidgets.map((item: any, key: number) => (
                                <Col xl={3} md={6} className="col" key={key}>
                                    <Card className="card-animate">
                                        <CardBody>
                                            <div className="d-flex align-items-center justify-content-between">

                                                <div className="d-flex align-items-center">
                                                    <div className="flex-grow-1 overflow-hidden">
                                                        <p className="text-uppercase fw-medium text-muted text-truncate mb-0">{item.label}</p>
                                                        <br />
                                                        {/* 
                                                        <h6 className="fs-15 fw-semibold ff-secondary mb-4">
                                                            Used: {item.used}, Available: {item.available}
                                                        </h6> */}
                                                        <p className="text-dark">
                                                            Used: {item.used}, Available: {item.available}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="avatar-sm icon_highlight flex-shrink-0">
                                                    <span className={`avatar-title rounded fs-3 `}>
                                                        <i className={`text-${item.bgcolor}`}>
                                                            <item.icon />
                                                        </i>
                                                    </span>
                                                </div>

                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                            ))}



                            {/* {LeavesDataWidgets.map((item) => (
                                <Col xl={4} md={6} key={item.id}>
                                    <Card className={`card-animate bg-${item.cardColor}`}>
                                        <CardBody>
                                            <div className="d-flex align-items-center">
                                                <div className="flex-grow-1">
                                                    <h6 className="text-white">{item.label}</h6>
                                                    <p className="text-white-50 mb-0">
                                                        Used: {item.used}, Available: {item.available}
                                                    </p>
                                                </div>
                                                <div className="icon_highlight">
                                                    <span className={`text-${item.bgcolor}`}>
                                                        <item.icon size={40} />
                                                    </span>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                            ))} */}
                        </Row>
                        <Row>
                            <Col lg={12}>
                                <Card>
                                    <CardBody>
                                        {data && data.length > 0 ? (
                                            <TableContainer
                                                columns={leaveColumns}
                                                data={data}
                                                isGlobalFilter={true}
                                                customPageSize={5}
                                                tableClass="table table-bordered"
                                                theadClass="thead-light"
                                                divClass="table-responsive"
                                            />
                                        ) : (
                                            <div className="text-center mt-3">
                                                <h5>No data available to display.</h5>
                                            </div>
                                        )}
                                    </CardBody>

                                </Card>
                            </Col>
                        </Row>
                    </div>
                </CardBody>
            </Card>
            <Modal isOpen={editModel} toggle={handleEditClose}
                backdrop={'static'} id="staticBackdrop" centered size='lg' scrollable
            >
                <ModalHeader toggle={handleEditClose} className="p-3 bg-info-subtle modal-title">
                    View Details
                </ModalHeader>
                <ModalBody>
                    <PreviewLeaveReques data={selectedLeaveData} handleClose={handleEditClose} />
                </ModalBody>
            </Modal>
        </React.Fragment >
    );
};

export default LeavesInfo;
