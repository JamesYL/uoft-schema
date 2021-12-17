import { saveRaw, saveParsed, Option } from "./data_gen_scripts/cacheData";
import coursesToCsv from "./data_gen_scripts/to_csv/course";
import meetingToCsv from "./data_gen_scripts/to_csv/meeting";
import selectionToCsv from "./data_gen_scripts/to_csv/selection";

interface GenerateOptions {
  /** Generate raw data and parsed data returned by the UofT */
  fetchUpdatedData?: {
    /** Which timetable term to get, ex: 20205, 20219 */
    latest: string;
    /** Courses to get from UofT Timetable, ex: CSC, STA, MAT137. It can be specific or general. */
    codes: string[];
  };
  /** Generate CSV files for courses */
  updateCourses: boolean;
  /** Generate CSV files for offerings of a course */
  updateSelections: boolean;
  /** Generate CSV files for lecture/tutorial/practical meetings */
  updateMeetings: boolean;
}
const generate = async ({
  fetchUpdatedData,
  updateCourses,
  updateSelections,
  updateMeetings,
}: GenerateOptions) => {
  if (fetchUpdatedData) {
    const { latest, codes } = fetchUpdatedData;
    await Promise.all(
      codes.map(async (code) => {
        const option: Option = { code, latest };
        return saveRaw(option).then((data) => saveParsed(data, option));
      })
    );
  }
  if (updateCourses) await coursesToCsv();
  if (updateSelections) await selectionToCsv();
  if (updateMeetings) await meetingToCsv();
};
generate({
  fetchUpdatedData: {
    latest: "20219",
    codes: ["CSC", "MAT", "STA"],
  },
  updateCourses: true,
  updateSelections: true,
  updateMeetings: true,
});
