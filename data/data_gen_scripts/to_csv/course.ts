import { getAllParsed, saveToCsv } from "./util";

const header = [
  "code",
  "department",
  "course_title",
  "course_number",
  "campus",
  "breadth_category",
  "distribution_category",
  "course_description",
  "num_credits",
];

export interface CourseCSV {
  code: string;
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
    .map<CourseCSV>(
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
          code,
          department: code.slice(0, 3),
          course_title: courseTitle,
          course_number: courseNumber,
          campus: Number(code[code.length - 1]) as 1 | 3 | 5,
          num_credits: numCredits,
          course_description: courseDescription,
        } as CourseCSV;
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
      if (codeExists.has(item.code)) return false;
      codeExists.add(item.code);
      return true;
    });

  await saveToCsv<CourseCSV>("course.csv", header, coursesForCSV);
  console.log("Successfully saved courses to CSV");
};
export default coursesToCsv;
