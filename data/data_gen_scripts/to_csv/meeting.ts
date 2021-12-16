import path from "path";
import { SelectionCSV } from "./selection";
import { getAllParsed, readFromCsv, saveToCsv } from "./util";

const header = [
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

const meetingToCsv = async () => {
  const courses = await getAllParsed();
  const courseCSV = await readFromCsv<SelectionCSV>(
    path.resolve(process.cwd(), "data", "csv", "selection.csv")
  );
  const selectionMap: { [code: string]: SelectionCSV } = {};
  courseCSV.forEach((item) => {
    const { section, code } = item;
    const session = `${item.start_year}${item.start_month}`;
    const uniqueSelection = `${session};${section};${code}`;
    selectionMap[uniqueSelection] = item;
  });

  const meetingsInCsv: MeetingCSV[] = [];
  courses.forEach((course, i) => {
    const { session, section, code, meetings } = course;

    const selectionId = selectionMap[`${session};${section};${code}`].id;
    meetings.forEach((meeting) => {
      meetingsInCsv.push({
        id: i,
        meeting_type: meeting.teachingMethod,
        section_number: meeting.sectionNumber,
        delivery_mode: meeting.deliveryMode,
        selection_id: selectionId,
      });
    });
  });
  await saveToCsv<MeetingCSV>(
    "meeting.csv",
    header,
    meetingsInCsv.map((item, i) => ({ ...item, id: i }))
  );
  console.log("Successfully saved meetings to CSV");
};
export default meetingToCsv;
