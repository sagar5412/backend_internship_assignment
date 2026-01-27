import express from "express"
import cors from "cors"

// import routes
import authRoutes from "./routes/v1/authRoutes.js"
import taskRoutes from "./routes/v1/taskRoutes.js"
// initialize express app
const app = express();

app.use(cors({
    origin:process.env.FRONTEND_URL || "http://localhost:5173",
    credentials:true
}))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

// API Routes
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/tasks",taskRoutes);

// 404 handler
app.use((req,res)=>{
    res.status(404).json({
        success:false,
        message:"Route not found"
    })
})

// global error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
})

export default app