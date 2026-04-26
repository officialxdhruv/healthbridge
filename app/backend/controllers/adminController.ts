import express from "express";

const addDoctor = async (req: express.Request, res: express.Response) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
    } catch (error) {

    }
}

export { addDoctor }