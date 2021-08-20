import express from 'express';
import HelloController from '../controllers/hello';
import UserRouter from "./user.router";

const router = express.Router();

router.get("/hello", async (req, res) => {
    const controller = new HelloController();
    const response = await controller.getMessage();
    return res.send(response);
});
router.use("/users", UserRouter);

export default router;