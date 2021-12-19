import axios from "axios";

export interface ScheduleRawData {
  [meetingId: string]: {
    meetingDay: "MO" | "TU" | "WE" | "TH" | "FR" | null;
    /** In format hh:mm, always half an hour interval */
    meetingStartTime: string | null;
    /** In format hh:mm, always half an hour interval */
    meetingEndTime: string | null;
  };
}
export interface InstructorRawData {
  [instructorId: string]: {
    firstName: string;
    lastName: string;
  };
}
export interface MeetingRawData {
  schedule: ScheduleRawData | [];
  instructors: InstructorRawData | [];
  teachingMethod: "LEC" | "TUT" | "PRA";
  /** Something like 5101, 0102, 0102 */
  sectionNumber: string;
  deliveryMode: "ONLSYNC" | "ONLASYNC" | "CLASS" | "INPER";
  /** Async only hours per week */
  contactHours?: string;
  /** If this meeting still exists */
  cancel: string;
}
export interface CourseRawData {
  [courseId: string]: {
    courseTitle: string;
    code: string;
    section: "F" | "S" | "Y";
    session: string;
    meetings: { [meetingId: string]: MeetingRawData };
    deliveryInstructions: string | null;
    webTimetableInstructions: string | null;
    breadthCategories: string;
    distributionCategories: string;
    courseDescription: string;
    prerequisite: string;
    corequisite: string;
    exclusion: string;
    recommendedPreparation: string;
  };
}

/**
 * Get raw data from UofT ArtSci UTSG Official Timetable
 * @param searchCode the course(s) to search for, CSC or CSC108 for example
 * @param searchSession to specify which version of the timetable, 20219 or 20215 for example
 * @returns Raw data
 */
const getRawData = async (
  searchCode: string,
  searchSession: string
): Promise<CourseRawData> => {
  const rawCourses = (
    await axios.get<CourseRawData | []>(
      `https://timetable.iit.artsci.utoronto.ca/api/${searchSession}/courses?code=${searchCode}`
    )
  ).data;
  if (Array.isArray(rawCourses)) return {};
  return rawCourses;
};
export default getRawData;
