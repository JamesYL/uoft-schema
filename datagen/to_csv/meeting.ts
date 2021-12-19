import path from "path";
import { SelectionCSV } from "./selection";
import { getAllParsed, readFromCsv, saveToCsv } from "../general/util";

const meetingHeader = [
  "id",
  "meeting_type",
  "section_number",
  "delivery_mode",
  "selection_id",
];

export interface MeetingCSV {
  id: number;
  meeting_type: "LEC" | "TUT" | "PRA";
  section_number: string;
  delivery_mode: "ONLSYNC" | "CLASS" | "ONLASYNC";
  selection_id: number;
}
const meetingTaughtByHeader = ["meeting_id", "first_name", "last_name"];

export interface MeetingTaughtByCSV {
  meeting_id: number;
  first_name: string;
  last_name: string;
}

const meetingToCsv = async () => {
  const courses = await getAllParsed();
  const selectionCSV = await readFromCsv<SelectionCSV>(
    path.resolve(process.cwd(), "data", "csv", "selection.csv")
  );
  const selectionMap: { [code: string]: SelectionCSV } = {};
  selectionCSV.forEach((item) => {
    const { section, code } = item;
    const session = `${item.start_year}${item.start_month}`;
    const uniqueSelection = `${session};${section};${code}`;
    selectionMap[uniqueSelection] = item;
  });

  const meetingsInCsv: MeetingCSV[] = [];
  const meetingTaughtByCsv: MeetingTaughtByCSV[] = [];
  let meetingId = 0;
  courses.forEach((course) => {
    const { session, section, code, meetings } = course;

    const selectionId = selectionMap[`${session};${section};${code}`].id;
    meetings.forEach((meeting) => {
      meetingsInCsv.push({
        id: meetingId,
        meeting_type: meeting.teachingMethod,
        section_number: meeting.sectionNumber,
        delivery_mode: meeting.deliveryMode,
        selection_id: selectionId,
      });
      meeting.instructors.forEach(({ firstName, lastName }) => {
        meetingTaughtByCsv.push({
          meeting_id: meetingId,
          first_name: firstName,
          last_name: lastName,
        });
      });
      meetingId += 1;
    });
  });

  await saveToCsv<MeetingCSV>("meeting.csv", meetingHeader, meetingsInCsv);
  console.log("Successfully saved meetings to CSV");

  await saveToCsv<MeetingTaughtByCSV>(
    "meeting_taught_by.csv",
    meetingTaughtByHeader,
    meetingTaughtByCsv
  );
  console.log("Successfully saved meeting instructors to CSV");
};
export default meetingToCsv;
