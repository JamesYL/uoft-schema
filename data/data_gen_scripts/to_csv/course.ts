import { getAllParsed, saveToCsv } from "./util";

type Header =
  | "id"
  | "department"
  | "course_title"
  | "course_number"
  | "campus"
  | "breadth_category"
  | "distribution_category"
  | "course_description"
  | "num_credits";

const headers: Header[] = [
  "id",
  "department",
  "course_title",
  "course_number",
  "campus",
  "breadth_category",
  "distribution_category",
  "course_description",
  "num_credits",
];

type BaseRecord = {
  [key in Header]?: string | number;
};
interface Record extends BaseRecord {
  id: number;
  department: string;
  course_title: string;
  course_number: number;
  campus: number;
  breadth_category?: number;
  distribution_category?: string;
  course_description: string;
  num_credits: number;
}

const coursesToCsv = async () => {
  const courses = await getAllParsed();
  const codeExists = new Set();
  const coursesForCSV = courses
    .map<Record>(
      ({
        courseTitle,
        code,
        breadthCategories,
        distributionCategories,
        courseDescription,
      }) => {
        let numCredits = -1;
        let courseNumber = -1;
        let courseWeightIndex = code.lastIndexOf("H");
        if (courseWeightIndex !== -1) {
          numCredits = 0.5;
          courseNumber = Number(code.slice(3, courseWeightIndex));
        } else {
          courseWeightIndex = code.lastIndexOf("Y");
          if (courseWeightIndex === -1) {
            throw new Error(
              `Course is neither half credit or full credit: ${code}`
            );
          }
          numCredits = 1;
          courseNumber = Number(code.slice(3, courseWeightIndex));
        }

        const res = {
          id: -1,
          department: code.slice(0, 3),
          course_title: courseTitle,
          course_number: courseNumber,
          campus: Number(code[code.length - 1]) as 1 | 3 | 5,
          num_credits: numCredits,
          course_description: courseDescription,
        } as Record;
        if (distributionCategories) {
          res.distribution_category = distributionCategories;
        }
        if (breadthCategories) {
          const trimmedBreadth = breadthCategories.trim();
          const breadthNum = Number(trimmedBreadth[trimmedBreadth.length - 2]);
          if (Number.isNaN(breadthNum))
            throw new Error(
              `Could not determine breadth number: ${breadthCategories}`
            );
          res.breadth_category = breadthNum;
        }
        return res;
      }
    )
    .filter((item) => {
      const id = `${item.department};${item.course_number};${item.num_credits};${item.campus}`;
      if (codeExists.has(id)) return false;
      codeExists.add(id);
      return true;
    })
    .map<Record>((item, i) => ({ ...item, id: i }));

  await saveToCsv<Record>("course.csv", headers, coursesForCSV);
  console.log("Successfully saved courses to CSV");
};
export default coursesToCsv;
