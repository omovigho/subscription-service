import { Router } from "express";

const workflowRouter = Router();

workflowRouter.get("/", (req, res) => {
  res.send("Get all workflows");
});

export default workflowRouter;