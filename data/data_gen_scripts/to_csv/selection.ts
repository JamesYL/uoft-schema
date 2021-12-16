import path from "path";
import { CourseCSV } from "./course";
import { getAllParsed, readFromCsv, saveToCsv } from "./util";

const header = [
  "id",
  "code",
  "section",
  "start_year",
  "start_month",
  "num_weeks",
  "delivery_instructions",
  "other_instructions",
];

export interface SelectionCSV {
  id: number;
  code: string;
  section: "F" | "S" | "Y";
  start_year: number;
  start_month: number;
  num_weeks: number;
  delivery_instructions?: string;
  other_instructions?: string;
}

const selectionToCsv = async () => {
  const courses = await getAllParsed();
  const courseCSV = await readFromCsv<CourseCSV>(
    path.resolve(process.cwd(), "data", "csv", "course.csv")
  );
  const codeToMap: { [code: string]: CourseCSV } = {};
  courseCSV.forEach((item) => {
    codeToMap[item.code] = item;
  });
  const exists = new Set();

  const selectionsInCSV = courses
    .map<SelectionCSV>((course, i) => {
      const {
        code,
        deliveryInstructions,
        webTimetableInstructions,
        session,
        section,
      } = course;
      const startYear = Number(session.slice(0, 4));
      const startMonth = Number(session[4]);
      let numWeeks = 24;
      if (startMonth === 5) {
        numWeeks = 12;
      } else if (startMonth === 9) {
        numWeeks = 24;
      } else {
        throw new Error("Start month is not September nor May");
      }
      if (section !== "Y") {
        numWeeks /= 2;
      }
      const res: SelectionCSV = {
        id: i,
        code,
        section,
        start_year: startYear,
        start_month: startMonth,
        num_weeks: numWeeks,
      };

      if (deliveryInstructions) {
        res.delivery_instructions = deliveryInstructions;
      }
      if (webTimetableInstructions) {
        res.other_instructions = webTimetableInstructions;
      }
      return res;
    })
    .filter((item) => {
      const id = `${item.code};${item.start_year};${item.start_month};${item.section}`;
      if (exists.has(id)) return false;
      exists.add(id);
      return true;
    })
    .map((item, i) => ({ ...item, id: i }));

  await saveToCsv<SelectionCSV>("selection.csv", header, selectionsInCSV);
  console.log("Successfully saved selections to CSV");
};
export default selectionToCsv;
