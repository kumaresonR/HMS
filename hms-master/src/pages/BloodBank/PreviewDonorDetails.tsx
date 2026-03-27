import React, { useEffect, useState } from "react"
import { Button, Col, Container, Label, Row, Table } from "reactstrap"
import { donorData } from "../../common/data/FakeData"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import DeleteModal from "../../Components/Common/DeleteModal"
import ErrorHandler from "../../helpers/ErrorHandler"
import { toast } from "react-toastify"
import BloodBankApiService from "../../helpers/services/bloodBank/BloodBankApiService"
import moment from "moment"
import { Link } from "react-router-dom"
import RoleBasedComponent from "../../common/RolePermission/RoleBasedComponent"

const PreviewDonorDetails = (props: any) => {
    const bloodBankApiService: BloodBankApiService = new BloodBankApiService();

    const [data, setData] = useState<any>('');
    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await bloodBankApiService.deleteBag(selectedId);
                toast.success('Bag Deleted Successfully', { containerId: 'TR' });
                getDonorDetailsById();
                setDeleteModal(false);
                return;
            } catch (error: any) {
                console.log("handleDelete Error")
                return ErrorHandler(error)
            }
        }
    };

    const deleteBag = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    const getDonorDetailsById = async () => {
        try {
            let data = await bloodBankApiService.getDonorIdByBagDetails(props.id);
            setData(data);
            console.log('getDonorDetailsById data', data);
        } catch (error) {
            console.log(error);
        }
    }

    const calculateAge = (dateOfBirth: any) => {
        const birthDate = moment(dateOfBirth);
        const now = moment();

        const years = now.diff(birthDate, "years");
        birthDate.add(years, "years");

        const months = now.diff(birthDate, "months");
        birthDate.add(months, "months");

        const days = now.diff(birthDate, "days");

        return `${years} Years ${months} Months ${days} Days`;
    };

    useEffect(() => {
        getDonorDetailsById();
    }, []);

    return (
        <React.Fragment>
            <Container fluid>
                <Row>
                    <Col md={6}>
                        <Row>
                            <Col xs={6}><Label>Donor Name</Label></Col>
                            <Col xs={6}><Label>{data?.donorDetails?.donorName}</Label></Col>
                        </Row>
                        <Row>
                            <Col xs={6}><Label>Date Of Birth</Label></Col>
                            <Col xs={6}><Label>{data?.donorDetails?.dateOfBirth}</Label></Col>
                        </Row>
                        <Row>
                            <Col xs={6}><Label>Gender</Label></Col>
                            <Col xs={6}><Label>{data?.donorDetails?.gender}</Label></Col>
                        </Row>
                        <Row>
                            <Col xs={6}><Label>Father Name	</Label></Col>
                            <Col xs={6}><Label>{data?.donorDetails?.fatherName}</Label></Col>
                        </Row>
                    </Col>
                    <Col md={6}>
                        <Row>
                            <Col xs={6}><Label>Age </Label></Col>
                            <Col xs={6}> <Label>{calculateAge(data?.donorDetails?.dateOfBirth)}</Label></Col>
                        </Row>
                        <Row>
                            <Col xs={6}><Label>Blood Group	 </Label></Col>
                            <Col xs={6}><Label>{data?.donorDetails?.bloodGroup} </Label></Col>
                        </Row>
                        <Row>
                            <Col xs={6}><Label>Contact No </Label></Col>
                            <Col xs={6}><Label>{data?.donorDetails?.contactNo} </Label></Col>
                        </Row>
                        <Row>
                            <Col xs={6}><Label>Address </Label></Col>
                            <Col xs={6}><Label>{data?.donorDetails?.address} </Label></Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <div className="table-responsive">
                        <Table hover className="table-centered table-bordered align-middle table-nowrap mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Bags</th>
                                    <th>Institution</th>
                                    <th>Lot</th>
                                    <th>Donate Date</th>
                                    <th>Charge Category</th>
                                    <th>Charge Name</th>
                                    <th>Standard Charge</th>
                                    <th>Apply Charge</th>
                                    <th>Discount (₹)</th>
                                    <th>Tax (₹)</th>
                                    <th>Net Amount (₹)</th>
                                    <th>Note</th>
                                    <th>Paid Amount (₹)</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.bagStocks?.length > 0 ? (
                                    data.bagStocks.map((data: any, idx: any) => (
                                        <tr key={idx}>
                                            <td>{data.bagNo} </td>
                                            <td>{data.institution}</td>
                                            <td>{data.lot}</td>
                                            <td>{moment(data.donateDate).format('DD/MM/YYYY')} </td>
                                            <td>{data.chargeCategory} </td>
                                            <td>{data.chargeName}</td>
                                            <td>{data.standardCharge}</td>
                                            <td>{data.total} </td>
                                            <td>{data.discount}</td>
                                            <td>{data.tax}</td>
                                            <td>{data.netAmount}</td>
                                            <td>{data.note}</td>
                                            <td>{data.paymentAmount}</td>
                                            <RoleBasedComponent allowedRoles={["SUPERADMIN", "PATHOLOGIST"]}>
                                                <td>
                                                    <span>
                                                        <ul className="list-inline hstack gap-2 mb-0">
                                                            <li className="list-inline-item" title="Preview">
                                                                <Link
                                                                    className="view-item-btn"
                                                                    to="#" onClick={() => deleteBag(data.bagStockId)}
                                                                >
                                                                    <FontAwesomeIcon icon={faTrashCan} className="text-danger" />
                                                                </Link>
                                                            </li>
                                                        </ul>
                                                    </span>
                                                </td>
                                            </RoleBasedComponent>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={14} className="text-center">
                                            No records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </Table>
                    </div>
                </Row>
            </Container>

            <DeleteModal
                show={deleteModal}
                onDeleteClick={handleDelete}
                onCloseClick={() => setDeleteModal(false)}
            />
        </React.Fragment>
    )
}

export default PreviewDonorDetails