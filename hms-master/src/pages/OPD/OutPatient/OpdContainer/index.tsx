import React, { useRef, useEffect, useState } from "react";
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
import OpdOverview from "./OpdOverview";
import Medication from "../../../IPD/InPatient/IpdContainer/Medication";
import LabInvestigation from "../../../IPD/InPatient/IpdContainer/LabInvestigation";
import Operation from "../../../IPD/InPatient/IpdContainer/Operation";
import Charges from "../../../IPD/InPatient/IpdContainer/Charges";
import IpdPayment from "../../../IPD/InPatient/IpdContainer/IpdPayment";
import OpdTreatmentHistory from "./OpdTreatmentHistory";
import Vital from "../../../IPD/InPatient/IpdContainer/Vital";
import AddTimeLine from "../../../IPD/InPatient/IpdContainer/TimeLine/AddTimeLine";
import OPDApiService from "../../../../helpers/services/opd/opd-api-service";
import { IoArrowBack } from "react-icons/io5";
import Prescription from "../../../IPD/InPatient/IpdContainer/Prescription";
import RoleBasedComponent from "../../../../common/RolePermission/RoleBasedComponent";
import { useDispatch } from "react-redux";
import FormHeader from "../../../../common/FormHeader/FormHeader";
import { minimizePage } from "../../../../slices/pageResizer/uiSlice";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const OpdContainer: React.FC = () => {
  const opdApiService = new OPDApiService();
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { state } = location;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [lightNavTab, setLightNavTab] = useState<string>("1");

  const storedId = localStorage.getItem("opdId");
  const id = state?.data || storedId || state?.id;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -150 : 150,
        behavior: "smooth",
      });
    }
  };
  const lightNavToggle = (tab: string) => {
    if (lightNavTab !== tab) {
      setLightNavTab(tab);
      localStorage.setItem("activeTab", tab);
    }
  };

  // Fetch OPD data
  const getAllOpd = async () => {
    try {
      const response = await opdApiService.getOPDById(id);
      setData(response || {});
    } catch (err) {
      console.error(err);
      setData({});
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    getAllOpd();
    localStorage.setItem("activeTab", lightNavTab);
  };

  useEffect(() => {
    if (id) {
      localStorage.setItem("opdId", id);
      getAllOpd();
    }
  }, [id]);

  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab");
    setLightNavTab(savedTab || "1");
  }, []);

  return (
    <>
      <Container fluid>
        <FormHeader
          title="OPD Overview"
          pageTitle="OPD"
          onMinimize={() =>
            dispatch(
              minimizePage({
                route: location.pathname,
                pageName: "OPD Overview",
                data: { id },
              })
            )
          }
        />
      </Container>

      <div className="text-end mb-3">
        <Button color="primary" onClick={() => navigate(-1)}>
          <IoArrowBack /> Back
        </Button>
      </div>

      <Card>
        <CardBody>
          <div className="d-flex align-items-center position-relative">
            <button
              className="btn btn-light position-absolute start-0"
              onClick={() => scroll("left")}
              style={{ zIndex: 2 }}
            >
              <FaChevronLeft />
            </button>
            <div
              ref={scrollRef}
              className="overflow-auto flex-grow-1 mx-5"
              style={{ scrollbarWidth: "none" }}
            >
              <Nav pills className="d-flex flex-nowrap nav-pills nav-custom-light">
                <NavItem className="text-nowrap">
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({ active: lightNavTab === "1" })}
                    onClick={() => lightNavToggle("1")}
                  >
                    Overview
                  </NavLink>
                </NavItem>
                <NavItem className="text-nowrap">
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({ active: lightNavTab === "2" })}
                    onClick={() => lightNavToggle("2")}
                  >
                    Prescription
                  </NavLink>
                </NavItem>
                <RoleBasedComponent allowedRoles={["SUPERADMIN","DOCTOR", "NURSE"]}>
                  <NavItem className="text-nowrap">
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({ active: lightNavTab === "3" })}
                      onClick={() => lightNavToggle("3")}
                    >
                      Medication
                    </NavLink>
                  </NavItem>
                </RoleBasedComponent>
                <RoleBasedComponent allowedRoles={["SUPERADMIN","DOCTOR", "NURSE", "RADIOLOGIST", "PATHOLOGIST"]}>
                  <NavItem className="text-nowrap">
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({ active: lightNavTab === "4" })}
                      onClick={() => lightNavToggle("4")}
                    >
                      Lab Investigation
                    </NavLink>
                  </NavItem>
                </RoleBasedComponent>
                <RoleBasedComponent allowedRoles={["SUPERADMIN","DOCTOR", "NURSE"]}>
                  <NavItem className="text-nowrap">
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({ active: lightNavTab === "5" })}
                      onClick={() => lightNavToggle("5")}
                    >
                      Operations
                    </NavLink>
                  </NavItem>
                </RoleBasedComponent>
                <RoleBasedComponent allowedRoles={["SUPERADMIN","DOCTOR", "NURSE", "ACCOUNTANT", "RECEPTIONIST"]}>
                  <NavItem className="text-nowrap">
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({ active: lightNavTab === "6" })}
                      onClick={() => lightNavToggle("6")}
                    >
                      Charges
                    </NavLink>
                  </NavItem>
                  <NavItem className="text-nowrap">
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({ active: lightNavTab === "7" })}
                      onClick={() => lightNavToggle("7")}
                    >
                      Payments
                    </NavLink>
                  </NavItem>
                </RoleBasedComponent>
                <RoleBasedComponent allowedRoles={["SUPERADMIN","DOCTOR", "NURSE"]}>
                  <NavItem className="text-nowrap">
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({ active: lightNavTab === "9" })}
                      onClick={() => lightNavToggle("9")}
                    >
                      Timeline
                    </NavLink>
                  </NavItem>
                  <NavItem className="text-nowrap">
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({ active: lightNavTab === "10" })}
                      onClick={() => lightNavToggle("10")}
                    >
                      Treatment History
                    </NavLink>
                  </NavItem>
                </RoleBasedComponent>
                <RoleBasedComponent allowedRoles={["SUPERADMIN","DOCTOR", "NURSE", "RECEPTIONIST"]}>
                  <NavItem className="text-nowrap">
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({ active: lightNavTab === "11" })}
                      onClick={() => lightNavToggle("11")}
                    >
                      Vitals
                    </NavLink>
                  </NavItem>
                </RoleBasedComponent>
              </Nav>
            </div>
            <button
              className="btn btn-light position-absolute end-0"
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
          <TabPane tabId="1">
            <OpdOverview data={data || {}} refresh={refresh} />
          </TabPane>
          <TabPane tabId="2">
            <Prescription data={data || {}} refresh={refresh} />
          </TabPane>
          <TabPane tabId="3">
            <Medication data={data || {}} refresh={refresh} />
          </TabPane>
          <TabPane tabId="4">
            <LabInvestigation data={data || {}} refresh={refresh} />
          </TabPane>
          <TabPane tabId="5">
            <Operation data={data || {}} refresh={refresh} />
          </TabPane>
          <TabPane tabId="6">
            <Charges data={data || {}} refresh={refresh} />
          </TabPane>
          <TabPane tabId="7">
            <IpdPayment data={data || {}} refresh={refresh} />
          </TabPane>
          <TabPane tabId="9">
            <AddTimeLine data={data || {}} refresh={refresh} />
          </TabPane>
          <TabPane tabId="10">
            <OpdTreatmentHistory data={data || {}} refresh={refresh} />
          </TabPane>
          <TabPane tabId="11">
            <Vital data={data || {}} refresh={refresh} />
          </TabPane>
        </TabContent>
      )}
    </>
  );
};

export default OpdContainer;