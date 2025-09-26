import Router, { type Request, type Response} from "express"; 
import { students, courses } from "../db/db.js";
import { type Student, type Course } from "../libs/types.js";
import { 
    zStudentId,
    zStudentDeleteBody,
    zStudentPostBody,
    zStudentPutBody,    
 } from "../schemas/studentValidator.js";
 import { 
    zCourseId,
    zCourseDeleteBody,
    zCoursePostBody,
    zCoursePutBody,} from "../schemas/courseValidator.js";
import { success } from "zod";
import { error } from "console";

const router = Router();
// READ all
router.get("/", (req: Request, res: Response) => {
    return res.json({
        success: true,
        courses: courses
    })
});

// Params URL 
router.get("/:corseId", (req: Request, res: Response) => {
    try {
        const courseid = Number(req.params.corseId);
        const result = zCourseId.safeParse(courseid)

         if (!result.success) {
        return res.status(400).json({
            message: "Validation failed",
            errors: "Invalid input: expected number, received NaN",
        });
    }
    
    const foundIndex = courses.findIndex(
        (std: Course) => std.courseId === courseid
    );
    
    if (foundIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Course does not exists",
        });
    }

    res.set("Link", `/student/${courseid}`);
    res.status(200).json({
      success: true,
      message: `Get courese ${courseid} sucessfully`,
      data: courses[foundIndex]
    });
    } catch (err) {
        
    }
});


router.post("/", (req: Request, res: Response) => {
    try {
        const body = req.body as Course;

        const result = zCoursePostBody.safeParse(body);
         if (!result.success) {
        return res.status(400).json({
            message: "Validation failed",
            errors: "Number must be exactly 6 digits",
        });
        }

        const foundIndex = courses.find((a) => a.courseId === body.courseId)
        if (foundIndex) {
            return res.status(409).json({
                success: false,
                massage: "Course Id already exists"
            })
        }

        courses.push(body);

        res.set("Link", `/courses`);

        return res.status(201).json({
            success: true,
            data: body
        })
    } catch (err) {
        return res.json({
            success: false,
            message: "Something is wrong, please try again",
            error: err,
        })
    }
});

router.put("/", (req: Request, res: Response) => {
    try {
        const body = req.body as Course;

        const result = zCoursePutBody.safeParse(body);
        if (!result.success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: "Number must be exactly 6 digits",
        });
        }

        const foundIndex = courses.findIndex((a) => a.courseId === body.courseId)
        if (foundIndex === -1) {
            return res.status(409).json({
                success: false,
                massage: "Course Id does not exists"
            })
        }

        courses[foundIndex] = {...courses[foundIndex],...body};

        res.set("Link", `/courses`);

        return res.status(200).json({
            success: true,
            message: `Course ${body.courseId} has been updated successfully`,
            data: courses[foundIndex],
        })

    } catch (err) {
        return res.json({
            success: false,
            message: "Something went wrong, please try again",
            error: err
        })
    }
});


router.delete("/",(req: Request, res: Response) => {
    try {
        const body = req.body as Course;

        const result = zCourseDeleteBody.safeParse(body);
        if (!result.success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: "Number must be exactly 6 digits",
        });
        }

        const foundIndex = courses.findIndex((a) => a.courseId === body.courseId)
        if (foundIndex === -1) {
            return res.status(409).json({
                success: false,
                massage: "Course Id does not exists"
            })
        }

        const course = courses[foundIndex]
        courses.splice(foundIndex, 1)

        res.set("Link", `/courses`);

        return res.status(200).json({
            success: true,
            message: `Course ${body.courseId} has been deleted successfully`,
            data: course
        })

    } catch (err) {
        return res.json({
            success: false,
            message: "Something went wrong, please try again",
            error: err
        })
    }
});

export default router;
