import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const AttendanceCalendar = (props: any) => {

    const getColorForStatus = (status: string) => {
        switch (status) {
            case 'Present':
                return 'green';
            case 'Absent':
                return 'red';
            case 'Late':
                return 'pink';
            case 'Holiday':
                return 'orange';
            case 'Half Day':
                return '#800080';
            default:
                return 'blue';
        }
    };

    const events = props?.data?.map((record: any) => ({
        title: `${record.staffAttendance}`,
        date: record.attendanceDate,
        backgroundColor: getColorForStatus(record.staffAttendance),
        borderColor: getColorForStatus(record.staffAttendance),
    }));
    return (
        <div className='h-100'>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                height="auto"
            />
        </div>
    );
};

export default AttendanceCalendar;
