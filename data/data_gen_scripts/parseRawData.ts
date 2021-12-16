import {
  CourseRawData,
  InstructorRawData,
  ScheduleRawData,
} from "./getRawData";

export interface Instructor {
  firstName: string;
  lastName: string;
}
export interface Schedule {
  meetingDay: "MO" | "TU" | "WE" | "TH" | "FR";
  /** In format hh:mm, always half an hour interval */
  meetingStartTime: string;
  /** In format hh:mm, always half an hour interval */
  meetingEndTime: string;
}
export interface Meeting {
  /** Empty schedule for async or courses that don't have schedules (independent study courses) */
  schedule: Schedule[];
  instructors: Instructor[];
  teachingMethod: "LEC" | "TUT" | "PRA";
  /** Something like 5101, 0102, 0102 */
  sectionNumber: string;
  deliveryMode: "ONLSYNC" | "ONLASYNC" | "CLASS";
  /** Async only hours per week */
  contactHours?: string;
}
export interface Course {
  courseTitle: string;
  code: string;
  section: "F" | "S" | "Y";
  session: string;
  meetings: Meeting[];
  breadthCategories: string;
  distributionCategories: string;
  courseDescription: string;
  deliveryInstructions?: string;
  webTimetableInstructions?: string;
  prerequisite?: string;
  corequisite?: string;
  exclusion?: string;
  recommendedPreparation?: string;
}
/**
 * Gets a list of courses that have unknown values parsed to be strictly defined
 * @param rawCourses the raw courses taken directly from UTSG ArtSci Timetable
 * @returns cleaned up courses
 */
const parseRawData = async (rawCourses: CourseRawData): Promise<Course[]> => {
  const parsedCourses: Course[] = [];
  Object.keys(rawCourses).forEach((courseId) => {
    const rawCourse = rawCourses[courseId];
    const {
      courseTitle,
      code,
      section,
      session,
      breadthCategories,
      distributionCategories,
      deliveryInstructions,
      courseDescription,
      prerequisite,
      corequisite,
      exclusion,
      recommendedPreparation,
      webTimetableInstructions,
    } = rawCourse;
    const meetings: Meeting[] = [];
    Object.keys(rawCourse.meetings).forEach((meetingId) => {
      const meeting = rawCourse.meetings[meetingId];
      if (meeting.cancel) return;
      const { teachingMethod, sectionNumber } = meeting;
      const deliveryMode =
        meeting.deliveryMode === "INPER" ? "CLASS" : meeting.deliveryMode;
      const schedule: Schedule[] = [];
      const instructors: Instructor[] = [];
      Object.keys(meeting.instructors).forEach((instructorId) => {
        const { firstName, lastName } = (
          meeting.instructors as InstructorRawData
        )[instructorId];
        instructors.push({ firstName, lastName });
      });
      Object.keys(meeting.schedule).forEach((scheduleId) => {
        const { meetingDay, meetingStartTime, meetingEndTime } = (
          meeting.schedule as ScheduleRawData
        )[scheduleId];
        if (
          meetingDay !== null &&
          meetingStartTime !== null &&
          meetingEndTime !== null
        )
          schedule.push({ meetingDay, meetingStartTime, meetingEndTime });
      });
      meetings.push({
        schedule,
        instructors,
        teachingMethod,
        sectionNumber,
        deliveryMode,
        contactHours: meeting.contactHours,
      });
    });
    parsedCourses.push({
      courseTitle,
      code,
      section,
      session,
      meetings,
      breadthCategories,
      distributionCategories,
      deliveryInstructions: !deliveryInstructions
        ? undefined
        : deliveryInstructions,
      courseDescription,
      prerequisite: !prerequisite ? undefined : prerequisite,
      corequisite: !corequisite ? undefined : corequisite,
      exclusion: !exclusion ? undefined : exclusion,
      recommendedPreparation: !recommendedPreparation
        ? undefined
        : recommendedPreparation,
      webTimetableInstructions: !webTimetableInstructions
        ? undefined
        : webTimetableInstructions,
    });
  });
  return parsedCourses;
};
export default parseRawData;
