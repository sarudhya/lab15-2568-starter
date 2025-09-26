import Router, { type Request, type Response} from "express";
import { students, courses } from "../db/db.js";
import { type Student, type Course } from "../libs/types.js";
import { 
    zStudentId,
    zStudentDeleteBody,
    zStudentPostBody,
    zStudentPutBody,    
 } from "../schemas/studentValidator.js";


const router = Router();

router.get("/:studentId/courses", (req: Request, res: Response) => {
  try {
    
    const studentId = req.params.studentId;
    const result = zStudentId.safeParse(studentId);
    
    if (!result.success) {
        return res.status(400).json({
            message: "Validation failed",
            errors: result.error.issues[0]?.message,
        });
    }
    
    const foundIndex = students.findIndex(
        (std: Student) => std.studentId === studentId
    );
    
    if (foundIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Student does not exists",
        });
    }

    const studentcouresId = students[foundIndex]?.courses ?? [];
    const studentcoures = courses
    .filter((a) => studentcouresId.includes(a.courseId))
    .map((a) => ({
      courseId: a.courseId,
      courseTitle: a.courseTitle
    }));

    
    res.set("Link", `/student/${studentId}/courses`);
    res.status(200).json({
      success: true,
      message: `Get coureses detail of student ${studentId}`,
      data: {
          studentId: studentId,
          course: {
            courseId: studentcouresId,
            courseTitle: studentcoures
          }
      }
    });
  } catch (err) {
    return res.json({
      success: false,
      message: "Something is wrong, please try again",
      error: err,
    });
  }
});

export default router;
