import React, { useEffect, useState } from "react"
import { UncontrolledAlert } from "reactstrap"
import StorageService from "../helpers/storage/storage-service";
import DashboardApiService from "../helpers/services/dashboard/dashboard-api-service";
import { useNavigate } from "react-router-dom";
import bell from "../assets/images/svg/bell.svg";

const ViewAllNotification = () => {
    const dashboardApiService: DashboardApiService = new DashboardApiService();
    const navigate: any = useNavigate();

    const [userId, setUserId] = useState('');
    const [unReadData, setUnReadData] = useState<any>([]);
    const [unReadDataCount, setUnReadDataCount] = useState<any>();
    const [readData, setReadData] = useState([]);

    const getAllUnreadMessage = async (id: any) => {
        try {
            let data = await dashboardApiService.getAllUnreadMessage(id);
            setUnReadData(data);
            setUnReadDataCount(data?.length || 0);
        } catch (error: any) {
            console.log(error.message)
        }
    }

    const handleRead = async (id: any, item: any) => {
        try {
            let data = await dashboardApiService.getAllReadMessage(id);
            setReadData(data);
            if (item.title === "appointment") {
                navigate('/main/view-scheduled-appointment');
            }
            if (item.title === 'Pathology Report' || item.title === 'Radiology Report') {
                if (item.ipdOrOpdId.startsWith("IPD")) {
                    navigate('/main/ipd-overview', { state: { data: item.ipdOrOpdId } });
                } else if (item.ipdOrOpdId.startsWith("OPD")) {
                    navigate('/main/opd-overview', { state: { data: item.ipdOrOpdId } });
                }
            }
            if(item.title === "LeaveRequest") {
                navigate('/main/leaveApproval');
            } 
            if(item.title === "LeaveDISAPPROVED") {
                navigate('/main/myLeave');
            }
            getAllUnreadMessage(userId);
        } catch (error: any) {
            console.log(error.message);
            getAllUnreadMessage(userId);
        }
    }

    useEffect(() => {
        const user = StorageService.getUserDataFromSessionStorage();
        setUserId(user.user_id);
        if (user.user_id) {
            // getNotification(user.user_id);
            getAllUnreadMessage(user.user_id);
        }
    }, []);

    return (
        <React.Fragment>
            {unReadData?.length > 0 ? (
                <>
                    {unReadData?.map((item: any, idx: any) => (
                        <UncontrolledAlert color="dark" key={idx} className="material-shadow mb-2" onClick={(e) => handleRead(item.id,item)}>
                            <strong>{item.message}</strong>
                        </UncontrolledAlert>
                    ))}
                </>
            ) : (
                <div className="text-center p-4">
                    <div className="w-25 w-sm-50 pt-3 mx-auto">
                        <img src={bell} className="img-fluid" alt="no-notifications" />
                    </div>
                    <div className="text-center pb-5 mt-2">
                        <h6 className="fs-18 fw-semibold lh-base">
                            Hey! You have no any notifications
                        </h6>
                    </div>
                </div>
            )}

        </React.Fragment>
    )
}

export default ViewAllNotification