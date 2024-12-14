import { Model } from "src/schema";
import { Request, Response } from "express";
import { commonDeleteAction, commonListQuery } from "src/utils";
export default router => {
  router.get("/model", async function (req: Request, res: Response) {
    try {
      const { list, total } = await commonListQuery(req, Model);
      res.json({
        code: 200,
        data: {
          list,
          total,
        },
      });
    } catch (error) {
      res.status(400).json({
        message: "服务器错误，请稍后重试",
      });
    }
  });

  router.get("/model/:id", async function (req: Request, res: Response) {
    const _id = req.params.id;
    try {
      const model = await Model.findById(_id);
      if (!model) {
        res.status(400).json({
          message: "非法操作",
        });
        return;
      }
      res.json({
        code: 200,
        data: model,
      });
    } catch (error) {
      res.status(400).json({
        message: "服务器错误，请稍后重试",
      });
    }
  });

  router.post("/model", async function (req: Request, res: Response) {
    const {
      name,
      model,
      apiKey,
      apiBaseUrl,
      description,
      sort,
      isBetter,
    } = req.body;
    try {
      const newModel = new Model({
        name,
        model,
        apiKey,
        apiBaseUrl,
        description,
        sort,
        isBetter,
      });
      await newModel.save();
      res.json({
        code: 200,
        data: newModel,
      });
    } catch (error) {
      res.status(400).json({
        message: "服务器错误，请稍后重试",
      });
    }
  });

  router.put("/model/:id", async function (req: Request, res: Response) {
    const _id = req.params.id;
    const {
      name,
      model,
      apiKey,
      apiBaseUrl,
      description,
      usageCount,
      enable,
      sort,
      isBetter,
    } = req.body;
    try {
      const updatedModel = await Model.findByIdAndUpdate(
        _id,
        {
          name,
          model,
          apiKey,
          apiBaseUrl,
          description,
          usageCount,
          enable,
          sort,
          isBetter,
        },
        { new: true }
      );
      if (!updatedModel) {
        res.status(400).json({
          message: "非法操作",
        });
        return;
      }
      res.json({
        code: 200,
        data: updatedModel,
      });
    } catch (error) {
      res.status(400).json({
        message: "服务器错误，请稍后重试",
      });
    }
  });

  router.delete("/model/:id", async function (req: Request, res: Response) {
    commonDeleteAction(req, res, Model);
  });
};
