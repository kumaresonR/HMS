import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Container, Row } from 'reactstrap';
import { GiCheckMark } from 'react-icons/gi';
import './TimeSheet.css';
import EmployeeApiService from '../../helpers/services/employee/EmployeeApiService';
import moment from 'moment';
import StorageService from '../../helpers/storage/storage-service';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import FormHeader from '../../common/FormHeader/FormHeader';
import { minimizePage } from '../../slices/pageResizer/uiSlice';

const AvailableTimeSheet = () => {
  const employeeApiService: EmployeeApiService = new EmployeeApiService();
  const dispatch = useDispatch();
  const location = useLocation();
  const [shiftData, setShiftData] = useState<any>([]);
  const [bookedData, setBookedData] = useState<any>([]);
  const startOfWeek = moment().startOf('week');
  const endOfWeek = moment().endOf('week');
  const [doctorId, setDoctorId] = useState('');

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const timeSlots = Array.from({ length: 24 }, (_, i) => moment().startOf('day').add(i, 'hour').format('hh:00 A'));
  const getSlotStartTimesForDay = (dayIndex: number) => {

    return shiftData
      .filter((item: any) => item.dayIndex === dayIndex)
      .map((item: any) => item.slotStartTime);

  };
  console.log("shiftData----------", shiftData)

  const getShiftById = async (id: any) => {
    try {
      const data = await employeeApiService.getShiftByEmployeeId(id);
      setBookedData(data.shiftTimeSlots);
      const filteredShifts = data.shifts.filter((shift: any) => {
        const shiftDate = moment(shift.shiftDate);
        return shiftDate.isBetween(startOfWeek, endOfWeek, null, '[]');
      });

      // Split time slots for each shift
      const splitTimeSlots = filteredShifts.flatMap((shift: any) => {
        const slots = [];
        const startTime = moment(`${shift.shiftDate}T${shift.startTime}`);
        const endTime = moment(`${shift.shiftDate}T${shift.endTime}`);
        const duration = parseInt(shift.durationMinutes, 10);

        let currentTime = startTime.clone();
        while (currentTime.isBefore(endTime)) {
          const nextTime = currentTime.clone().add(duration, 'minutes');
          if (nextTime.isAfter(endTime)) break;

          slots.push({
            dayIndex: currentTime.day(),
            slotStartTime: currentTime.format('hh:mm A'),
            slotEndTime: nextTime.format('hh:mm A'),
            shiftDate: shift.shiftDate,
            doctorName: shift.doctorName,
            shiftType: shift.shiftType,
            scheduleId: shift.scheduleId
          });

          currentTime = nextTime;
          console.log("aaaaaaaaaa", slots)
        }

        return slots;
      });

      setShiftData(splitTimeSlots);
      console.log("splitTimeSlots", splitTimeSlots)
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    let user = StorageService.getUserDataFromSessionStorage();
    setDoctorId(user.user_id);
    if (user.user_id) {
      getShiftById(user.user_id);
    }

  }, []);

  return (
    <Container fluid>
      <FormHeader
        title="Available Time Sheet"
        pageTitle="Available Time Sheet"
        onMinimize={() => dispatch(minimizePage({
          route: location.pathname,
          pageName: "Available Time Sheet",
        }))} />
      <Row>
        <Card>
          <CardHeader className="d-flex align-items-center justify-content-between">
            <h4 className="card-title mb-0"></h4>
            <div className="d-flex justify-content-evenly ms-5">
              <div>
                <p className="mb-0">
                  <span className="booked text-danger">
                    <GiCheckMark />
                  </span>{' '}
                  Booked
                </p>
              </div>
              <div>
                <p className="mb-0 ms-3">
                  <span className="booked text-success">
                    <GiCheckMark />
                  </span>{' '}
                  Available
                </p>
              </div>
            </div>
          </CardHeader>

          <CardBody>
            <div className="table-responsive">
              <table className="table text-center table-nowrap table-centered align-middle">
                <thead className="table-light">
                  <tr>
                    <th></th>
                    {daysOfWeek.map(day => (
                      <th key={day}>{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((time, timeIndex) => (
                    <tr key={timeIndex}>
                      <th scope="row">{time}</th>
                      {daysOfWeek.map((_, dayIndex) => {
                        // const shiftsForDayAndTime = shiftData.filter((shift: any) => {
                        //   const shiftStartMoment = moment(shift.slotStartTime, 'hh:mm A');
                        //   const timeStartMoment = moment(time, 'hh:mm A');
                        //   const timeEndMoment = timeStartMoment.clone().add(59, 'minutes');

                        //   return (
                        //     shiftStartMoment.isBetween(timeStartMoment, timeEndMoment, null, '[]') &&
                        //     shift.dayIndex === dayIndex
                        //   );
                        // });

                        const shiftsForDayAndTime = shiftData.filter((shift: any) => {
                          const shiftStartMoment = moment(shift.slotStartTime, 'hh:mm A');
                          const timeStartMoment = moment(time, 'hh:mm A');
                          const timeEndMoment = timeStartMoment.clone().add(1, 'hour');

                          return (
                            shiftStartMoment.isBetween(timeStartMoment, timeEndMoment, null, '[)') &&
                            shift.dayIndex === dayIndex
                          );
                        });


                        return (
                          <td key={dayIndex}>
                            <div className="d-flex flex-wrap gap-3">
                              {shiftsForDayAndTime.length > 0 ? (
                                shiftsForDayAndTime.map((shift: any, index: number) => {
                                  const matchingSchedule = bookedData.find(
                                    (schedule: any) =>
                                      schedule.scheduleId === shift.scheduleId &&
                                      schedule.timeSlot === shift.slotStartTime &&
                                      schedule.status === 'Booked'
                                  );

                                  const badgeClass = matchingSchedule ? 'badgeRed' : 'badgeGreen';

                                  return (
                                    <div key={index}>
                                      <span className={`${badgeClass} mb-2`} style={{
                                        cursor: 'pointer',
                                        padding: '5px 8px',
                                        borderRadius: '10px',
                                      }}>
                                        {shift.slotStartTime}
                                      </span>
                                    </div>
                                  );
                                })
                              ) : (
                                <span>No shifts available</span>
                              )}
                            </div>
                          </td>

                          // <td key={dayIndex}>
                          //   {getSlotStartTimesForDay(dayIndex).includes(time) ? (
                          //     shiftsForDayAndTime.length > 0 ? (
                          //       <span
                          //         className="mb-2 d-flex flex-wrap gap-3"
                          //         style={{
                          //           cursor: 'pointer',
                          //           padding: '5px 8px',
                          //           borderRadius: '10px',
                          //         }}
                          //       >
                          //         {shiftsForDayAndTime.map((shift: any, index: number) => {
                          //           const matchingSchedule = bookedData.find(
                          //             (schedule: any) =>
                          //               schedule.scheduleId === shift.scheduleId &&
                          //               schedule.timeSlot === shift.slotStartTime &&
                          //               schedule.status === 'Booked'
                          //           );

                          //           const isBooked = matchingSchedule ? 'green' : '';

                          //           return (
                          //             <div key={index}>
                          //               <span
                          //                 className={`${isBooked ? 'badgeRed' : 'badgeGreen'} mb-2`}
                          //                 style={{
                          //                   cursor: 'pointer',
                          //                   padding: '5px 8px',
                          //                   borderRadius: '10px',
                          //                 }}
                          //               >
                          //                 {shift.slotStartTime}
                          //               </span>
                          //             </div>
                          //           );
                          //         })}
                          //       </span>
                          //     ) : (
                          //       <span>No shifts available</span>
                          //     )
                          //   ) : "No shifts available"}
                          // </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </Row>
    </Container>

  );
};

export default AvailableTimeSheet;
