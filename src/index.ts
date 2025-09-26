
import express,{ type Request, type Response} from "express";
import morgan from 'morgan';
import courseRoutes from "./routes/courseRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";

const app: any = express();
const port = 3000;

//Middleware
app.use("/api/v2/students", studentRoutes);
app.use("/api/v2/courses", courseRoutes);

app.get("/", (req: Request, res: Response)=>{
  res.send("API services for Student Data")
})

app.get("/me", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Student Information",
    data:{
      studentsId: "670610736",
      firstName: "sarudhya",
      lastName: "achavakul",
      program: "CPE",
      section: "001"
    }
  });
});

app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);


export default app;
