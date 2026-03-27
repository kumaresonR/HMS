import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Card,
  CardBody,
  Container,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";
import { useLocation, useNavigate } from "react-router-dom";
import IpdOverview from "./IpdOverview";
import IpdBedHistory from "./IpdBedHistory";
import IpdTreatmentHistory from "./TreatmentHistory/IpdTreatmentHistory";
import AddNurseNote from "./NurseNote/AddNurseNote";
import Antenatal from "./Antenatal";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import AddPostnatalHistory from "./PostnatalHistory/AddPostnatalHistory";
import PreviousObstetricHistory from "./PreviousObstetricHistory";
import Vital from "./Vital";
import ConsultantRegister from "./ConsultantRegister";
import AddTimeLine from "./TimeLine/AddTimeLine";
import IpdPayment from "./IpdPayment";
import Operation from "./Operation";
import Medication from "./Medication";
import Prescription from "./Prescription";
import Charges from "./Charges";
import LabInvestigation from "./LabInvestigation";
import IPDApiService from "../../../../helpers/services/ipd/ipd-api-service";
import { IoArrowBack } from "react-icons/io5";
import RoleBasedComponent from "../../../../common/RolePermission/RoleBasedComponent";
import { useDispatch } from "react-redux";
import FormHeader from "../../../../common/FormHeader/FormHeader";
import { minimizePage } from "../../../../slices/pageResizer/uiSlice";

const IpdContainer = () => {
  const iPDApiService: IPDApiService = new IPDApiService();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: string) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -150 : 150,
        behavior: "smooth",
      });
    }
  };
  let navigate: any = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { state } = useLocation();
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  const storedId = localStorage.getItem("ipdId");
  const id = state?.data || storedId || location?.state?.id;

  const [lightNavTab, setlightNavTab] = useState<string>("1");
  const lightNavToggle = (tab: any) => {
    if (lightNavTab !== tab) {
      setlightNavTab(tab);
      localStorage.setItem("activeTab", tab);
    }
  };
  const getAllIpd = async () => {
    try {
      let url = id;
      let data = await iPDApiService.getIPDById(url);
      setData(data || {});
    } catch (error) {
      console.log(error);
      setData({});
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    getAllIpd();
    localStorage.setItem("activeTab", lightNavTab);
  };
  useEffect(() => {
    if (id) {
      localStorage.setItem("ipdId", id);
      getAllIpd();
    }
  }, [id]);

  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab) {
      setlightNavTab(savedTab);
    } else {
      setlightNavTab("1");
    }
  }, []);

  return (
    <React.Fragment>
      <Container fluid>
        <FormHeader
          title="IPD Overview"
          pageTitle="IPD"
          onMinimize={() =>
            dispatch(
              minimizePage({
                route: location.pathname,
                pageName: "IPD Overview",
                data: { id },
              })
            )
          }
        />
      </Container>
      <div className="text-end mb-3">
        <Button
          color="primary"
          onClick={() => navigate(-1)}
          className="btn btn-primary add-btn ms-3"
        >
          <IoArrowBack /> Back
        </Button>
      </div>
      <Card>
        <CardBody>
          <div className="d-flex align-items-center position-relative">
            <button
              className="btn btn-light position-absolute start-0 z-1"
              onClick={() => scroll("left")}
              style={{ zIndex: 2 }}
            >
              <FaChevronLeft />
            </button>
            <div
              ref={scrollRef}
              className="d-flex overflow-auto flex-nowrap mx-5"
              style={{ scrollbarWidth: "none" }}
            >
              <Nav
                pills
                className="nav p-2 nav-pills mb-0 nav-custom nav-custom-light flex-nowrap"
              >
                <NavItem className="text-nowrap">
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({ active: lightNavTab === "1" })}
                    onClick={() => lightNavToggle("1")}
                  >
                    Overview
                  </NavLink>
                </NavItem>
                <RoleBasedComponent allowedRoles={["SUPERADMIN","DOCTOR", "NURSE"]}>
                  <NavItem className="text-nowrap">
                    <NavLink style={{ cursor: "pointer" }}
                      className={classnames({ active: lightNavTab === "2" })}
                      onClick={() => lightNavToggle("2")}
                    >
                      Nurse Notes
                    </NavLink>
                  </NavItem>
                  <NavItem className="text-nowrap">
                    <NavLink style={{ cursor: "pointer" }}
                      className={classnames({ active: lightNavTab === "3" })}
                      onClick={() => lightNavToggle("3")}
                    >
                      Medication
                    </NavLink>
                  </NavItem>
                </RoleBasedComponent>
                <NavItem className="text-nowrap">
                  <NavLink style={{ cursor: "pointer" }}
                    className={classnames({ active: lightNavTab === "4" })}
                    onClick={() => lightNavToggle("4")}
                  >
                    Prescription
                  </NavLink>
                </NavItem>
                <RoleBasedComponent allowedRoles={["SUPERADMIN","DOCTOR", "NURSE"]}>
                  <NavItem className="text-nowrap">
                    <NavLink style={{ cursor: "pointer" }}
                      className={classnames({ active: lightNavTab === "5" })}
                      onClick={() => lightNavToggle("5")}
                    >
                      Consultant Register
                    </NavLink>
                  </NavItem>
                </RoleBasedComponent>
                <RoleBasedComponent allowedRoles={["SUPERADMIN","DOCTOR", "NURSE", "RADIOLOGIST", "PATHOLOGIST"]}>
                  <NavItem className="text-nowrap">
                    <NavLink style={{ cursor: "pointer" }}
                      className={classnames({ active: lightNavTab === "6" })}
                      onClick={() => lightNavToggle("6")}
                    >
                      Lab Investigation
                    </NavLink>
                  </NavItem>
                </RoleBasedComponent>
                <RoleBasedComponent allowedRoles={["SUPERADMIN","DOCTOR", "NURSE"]}>
                  <NavItem className="text-nowrap">
                    <NavLink style={{ cursor: "pointer" }}
                      className={classnames({ active: lightNavTab === "7" })}
                      onClick={() => lightNavToggle("7")}
                    >
                      Operations
                    </NavLink>
                  </NavItem>
                </RoleBasedComponent>
                <RoleBasedComponent
                  allowedRoles={[
                    "DOCTOR",
                    "NURSE",
                    "ACCOUNTANT",
                    "RECEPTIONIST",
                  ]}
                >
                  <NavItem className="text-nowrap">
                    <NavLink style={{ cursor: "pointer" }}
                      className={classnames({ active: lightNavTab === "8" })}
                      onClick={() => lightNavToggle("8")}
                    >
                      Charges
                    </NavLink>
                  </NavItem>
                  <NavItem className="text-nowrap">
                    <NavLink style={{ cursor: "pointer" }}
                      className={classnames({ active: lightNavTab === "9" })}
                      onClick={() => lightNavToggle("9")}
                    >
                      Payments
                    </NavLink>
                  </NavItem>
                </RoleBasedComponent>
                <RoleBasedComponent allowedRoles={["SUPERADMIN","DOCTOR", "NURSE"]}>
                  <NavItem className="text-nowrap">
                    <NavLink style={{ cursor: "pointer" }}
                      className={classnames({ active: lightNavTab === "11" })}
                      onClick={() => lightNavToggle("11")}
                    >
                      Bed History
                    </NavLink>
                  </NavItem>
                  <NavItem className="text-nowrap">
                    <NavLink style={{ cursor: "pointer" }}
                      className={classnames({ active: lightNavTab === "12" })}
                      onClick={() => lightNavToggle("12")}
                    >
                      Timeline
                    </NavLink>
                  </NavItem>
                  <NavItem className="text-nowrap">
                    <NavLink style={{ cursor: "pointer" }}
                      className={classnames({ active: lightNavTab === "13" })}
                      onClick={() => lightNavToggle("13")}
                    >
                      Treatment History
                    </NavLink>
                  </NavItem>
                </RoleBasedComponent>
                <RoleBasedComponent allowedRoles={["SUPERADMIN","DOCTOR", "NURSE", "RECEPTIONIST"]}>
                  <NavItem className="text-nowrap">
                    <NavLink style={{ cursor: "pointer" }}
                      className={classnames({ active: lightNavTab === "14" })}
                      onClick={() => lightNavToggle("14")}
                    >
                      Vitals
                    </NavLink>
                  </NavItem>
                </RoleBasedComponent>
                <RoleBasedComponent allowedRoles={["SUPERADMIN","DOCTOR", "NURSE"]}>
                  {data?.admissions?.antenatal === true && (
                    <>
                      <NavItem className="text-nowrap">
                        <NavLink style={{ cursor: "pointer" }}
                          className={classnames({
                            active: lightNavTab === "15",
                          })}
                          onClick={() => lightNavToggle("15")}
                        >
                          Previous Obstetric History
                        </NavLink>
                      </NavItem>
                      <NavItem className="text-nowrap">
                        <NavLink style={{ cursor: "pointer" }}
                          className={classnames({
                            active: lightNavTab === "16",
                          })}
                          onClick={() => lightNavToggle("16")}
                        >
                          Postnatal History
                        </NavLink>
                      </NavItem>
                      <NavItem className="text-nowrap">
                        <NavLink style={{ cursor: "pointer" }}
                          className={classnames({
                            active: lightNavTab === "17",
                          })}
                          onClick={() => lightNavToggle("17")}
                        >
                          Antenatal
                        </NavLink>
                      </NavItem>
                    </>
                  )}
                </RoleBasedComponent>
              </Nav>
            </div>
            <button
              className="btn btn-light position-absolute end-0 z-1"
              onClick={() => scroll("right")}
              style={{ zIndex: 2 }}
            >
              <FaChevronRight />
            </button>
          </div>
        </CardBody>
      </Card>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <TabContent activeTab={lightNavTab} className="text-muted">
          <TabPane tabId="1" id="nav-light-home">
            <IpdOverview data={data || {}} refresh={refresh} />
          </TabPane>
          <TabPane tabId="2" id="nav-light-home">
            <AddNurseNote data={data || {}} refresh={refresh} />
          </TabPane>
          <TabPane tabId="3" id="nav-light-home">
            <Medication data={data || {}} refresh={refresh} title="ipd" />
          </TabPane>
          <TabPane tabId="4" id="nav-light-home">
            <Prescription title="ipd" data={data || {}} refresh={refresh} />
          </TabPane>
          <TabPane tabId="5" id="nav-light-home">
            <ConsultantRegister data={data || {}} refresh={refresh} />
          </TabPane>
          <TabPane tabId="6" id="nav-light-home">
            <LabInvestigation data={data || {}} refresh={refresh} />
          </TabPane>
          <TabPane tabId="7" id="nav-light-profile">
            <Operation data={data || {}} refresh={refresh} title="ipd" />
          </TabPane>
          <TabPane tabId="8" id="nav-colored-messages">
            <Charges data={data || {}} refresh={refresh} title="ipd" />
          </TabPane>
          <TabPane tabId="9" id="nav-light-home">
            <IpdPayment data={data || {}} refresh={refresh} title="ipd" />
          </TabPane>
          {/* <TabPane tabId="10" id="nav-light-home">
                            <IpdOverview data={data || {}} />
                        </TabPane> */}
          <TabPane tabId="11" id="nav-colored-messages">
            <IpdBedHistory data={data || {}} refresh={refresh} />
          </TabPane>
          <TabPane tabId="12" id="nav-colored-messages">
            <AddTimeLine data={data || {}} refresh={refresh} title="ipd" />
          </TabPane>
          <TabPane tabId="13" id="nav-colored-messages">
            <IpdTreatmentHistory data={data || {}} refresh={refresh} />
          </TabPane>
          <TabPane tabId="14" id="nav-colored-messages">
            <Vital data={data || {}} refresh={refresh} title="ipd" />
          </TabPane>
          <TabPane tabId="15" id="nav-colored-messages">
            <PreviousObstetricHistory data={data || {}} refresh={refresh} />
          </TabPane>
          <TabPane tabId="16" id="nav-colored-messages">
            <AddPostnatalHistory data={data || {}} refresh={refresh} />
          </TabPane>
          <TabPane tabId="17" id="nav-colored-messages">
            <Antenatal data={data || {}} refresh={refresh} />
          </TabPane>
        </TabContent>
      )}
    </React.Fragment>
  );
};

export default IpdContainer;
