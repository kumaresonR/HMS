import { Col, Container, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap"
import userImg from "../../assets/images/users/no_image.png";
import classnames from "classnames";
import { useEffect, useState } from "react";
import StockDataTable from "./StockDatatable";
import BedStockDataTable from "./BadStockDataTable";
import PharmacyApiService from "../../helpers/services/pharmacy/pharmacy-api-service";

const PreviewMedicineDetails = (props: any) => {
    const pharmacyApiService: PharmacyApiService = new PharmacyApiService();

    const data = props.data;
    const [purchaseMedicines, setPurchaseMedicines] = useState<any>([]);
    const [badStockData, setBadStockData] = useState<any>([]);

    const [customActiveTab, setcustomActiveTab] = useState<string>("1");
    const toggleCustom = (tab: any) => {
        if (customActiveTab !== tab) {
            setcustomActiveTab(tab);
        }
    };

    const getAllPurchaseMedicine = async () => {
        try {
            let result = await pharmacyApiService.getAllPurchaseMedicine('?all');
            if (data.name) {
                let filteredStock = result.filter((item: any) => item.medicines.some((medicine: any) => medicine.medicineName.trim() === data.name.trim()));
                setPurchaseMedicines(filteredStock);
            } else {
                setPurchaseMedicines([]);
            }
        } catch (error: any) {
            console.log(error);
        }
    }

    const getAllBadStock = async () => {
        try {
            let result = await pharmacyApiService.getAllBadStockByMedicineId(props.data.addMedicineId);
            setBadStockData(result);
        } catch (error: any) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllBadStock();
        getAllPurchaseMedicine();
    }, []);
    return <>
        <Container fluid>
            <Row>
                <Col sm="auto">
                    <img src={userImg} alt="user" width={150} />
                </Col>
                <Col>

                    <table className="noBorderTable">
                        <tbody>
                            <tr>
                                <th>Medicine Name</th>
                                <td className="text-primary">{data.name}</td>
                            </tr>
                            <tr>
                                <th>Medicine Company</th>
                                <td>{data.company}</td>
                            </tr>
                            <tr>
                                <th>Medicine Group</th>
                                <td>{data.groupName}</td>
                            </tr>
                            <tr>
                                <th>Min Level</th>
                                <td>{data.minLevel}</td>
                            </tr>
                            <tr>
                                <th>Tax (%)</th>
                                <td>{data.tax}</td>
                            </tr>
                            <tr>
                                <th>VAT A/C</th>
                                <td>{data.vatAccount}</td>
                            </tr>
                            <tr>
                                <th>Rack Number</th>
                                <td className="text-primary">{data.rackNumber}</td>
                            </tr>
                            <tr>
                                <th>Note</th>
                                <td>{data.note || 'NA'}</td>
                            </tr>
                        </tbody>
                    </table>



                </Col>

                <Col>

                    <table className="noBorderTable">
                        <tbody>
                            <tr>
                                <th>Medicine Category</th>
                                <td className="text-primary">{data.category}</td>
                            </tr>
                            <tr>
                                <th>Medicine Composition</th>
                                <td>{data.composition}</td>
                            </tr>
                            <tr>
                                <th>Unit</th>
                                <td>{data.unit}</td>
                            </tr>
                            <tr>
                                <th>Re-Order Level</th>
                                <td className="text-primary">{data.reorderLevel}</td>
                            </tr>
                            <tr>
                                <th>Box/Packing</th>
                                <td>{data.boxPacking}</td>
                            </tr>
                        </tbody>
                    </table>
                </Col>
            </Row>
            <Row>
                <Col sm={12}>
                    <Nav tabs className="nav nav-tabs border-bottom-0 nav-tabs-custom nav-success mb-3">
                        <NavItem>
                            <NavLink
                                style={{ cursor: "pointer" }}
                                className={classnames({
                                    active: customActiveTab === "1",
                                })}
                                onClick={() => {
                                    toggleCustom("1");
                                }}
                            >
                                Stock
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                style={{ cursor: "pointer" }}
                                className={classnames({
                                    active: customActiveTab === "2",
                                })}
                                onClick={() => {
                                    toggleCustom("2");
                                }}
                            >
                                Bad Stock
                            </NavLink>
                        </NavItem>
                    </Nav>
                </Col>
                <Col sm={12}>
                    <TabContent
                        activeTab={customActiveTab}
                        className="text-muted"
                    >
                        <TabPane tabId="1" id="home1">
                            <StockDataTable data={purchaseMedicines} />
                        </TabPane>
                        <TabPane tabId="2">
                            <BedStockDataTable data={badStockData} />
                        </TabPane>
                    </TabContent>
                </Col>
            </Row>
        </Container>
    </>
}
export default PreviewMedicineDetails