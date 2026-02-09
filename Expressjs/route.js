const express = require("express");
const app = express();
app.use(express.json());

let students = [
    { id: 1, name: "aman", marks: 60, status: "active", city: "agra" },
    { id: 2, name: "naman", marks: 45, status: "active", city: "hyderabad" }
];

app.get("/students", (req, res) => {
    res.json(students);
});

// Patch -> update student status
app.patch("/students/:id/status", (req, res) => {
    const id = Number(req.params.id);
    const { status } = req.body;
    const student = students.find((s) => s.id === id);
    if (!student) {
        return res.status(404).json({ message: "student not found" });
    }
    if (status !== "active" && status !== "inactive") {
        return res.status(400).json({ message: "status must be active or inactive" });
    }

    student.status = status;

    res.json({ message: "student status updated successfully", student });
});

app.listen(8000, () => console.log("server started"));