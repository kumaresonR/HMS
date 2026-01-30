import React, { useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
} from "reactstrap";
import TableContainer from "../../../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import ExportCSVModal from "../../../../Components/Common/ExportCSVModal";
 
import { Link } from "react-router-dom";

const RoleList = () => {
    // Dummy role data
    const roleData = [
        { id: 1, role: 'Admin', type: 'Full Access', action: 'Edit' },
        { id: 2, role: 'Editor', type: 'Partial Access', action: 'Edit' },
        { id: 3, role: 'Viewer', type: 'Read Only', action: 'View' },
        { id: 4, role: 'Moderator', type: 'Moderate Content', action: 'Manage' },
        { id: 5, role: 'Contributor', type: 'Limited Access', action: 'Add' },
        { id: 6, role: 'Guest', type: 'Temporary Access', action: 'View' },
        { id: 7, role: 'Manager', type: 'Manage Users', action: 'Edit' },
        { id: 8, role: 'Super Admin', type: 'Full Control', action: 'All' },
    ];

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    // Updated role columns
    const roleColumns = [
        {
            header: 'Role',
            accessorKey: 'role',
            enableColumnFilter: false,
        },
        {
            header: 'Type',
            accessorKey: 'type',
            enableColumnFilter: false,
        },
        {
            header: "Action",
            cell: (cell: any) => {
             

                function handleCompanyClick(companyData: any) {
                    throw new Error("Function not implemented.");
                }

                function onClickDelete(companyData: any) {
                    throw new Error("Function not implemented.");
                }

              return (
                <ul className="list-inline hstack gap-2 mb-0">
                 
                  <li className="list-inline-item" title="Edit">
                    <Link className="edit-item-btn" to="#"
                      onClick={() => { const companyData = cell.row.original; handleCompanyClick(companyData); }}
                    >
                      <i className="ri-pencil-fill align-bottom text-muted"></i>
                    </Link>
                  </li>
                  <li className="list-inline-item" title="Delete">
                    <Link
                      className="remove-item-btn"
                      onClick={() => { const companyData = cell.row.original; onClickDelete(companyData); }}
                      to="#"
                    >
                      <i className="ri-delete-bin-fill align-bottom text-muted"></i>
                    </Link>
                  </li>
                </ul>
              );
            },
          },
    ];

    return (
        <React.Fragment>
            <div>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={roleData}
                />

                <Container fluid>
                    <Row>
                        <Col lg={12}>
                            <Card id="roleList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0">Role List</h5>
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

                                <div className="card-body pt-0">
                                    <div>
                                        <TableContainer
                                            columns={roleColumns}
                                            data={roleData}
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
                </Container>
            </div>
        </React.Fragment>
    );
};

export default RoleList;
