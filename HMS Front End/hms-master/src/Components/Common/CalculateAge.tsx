import React from "react";
import moment from "moment";

interface CalculateAgeProps {
  dateOfBirth?: string;
}

const calculateAge = (dateOfBirth: any): string => {
  if (!dateOfBirth) return "NA";

  const dob = moment(dateOfBirth);
  const today = moment();

  const years = today.diff(dob, "years");
  dob.add(years, "years");

  const months = today.diff(dob, "months");
  dob.add(months, "months");

  const days = today.diff(dob, "days");

  return `${years} Years ${months} Months ${days} Days`;
};

const CalculateAge: React.FC<CalculateAgeProps> = ({ dateOfBirth }) => {
  return <span>{calculateAge(dateOfBirth)}</span>;
};

export default CalculateAge;