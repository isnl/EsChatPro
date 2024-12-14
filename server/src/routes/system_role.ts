import express from "express";
import { isVip, onUserCheck } from "src/utils";
import { SystemRole } from "src/schema";
import { SYSTEM_ROLES_STATUS } from "src/constant";
import { vipMiddleware } from "src/middleware/vip";
const router = express.Router();

onUserCheck(router);

router.get("/", async function (req: any, res) {
  const { isPublic } = req.query;
  const { openId } = req.auth;
  const c = {
    title: 1,
    content: 1,
    description: 1,
    context: 1,
    isSchema: 1,
    jsonSchema: 1,
  };
  const result = await SystemRole.find(
    isPublic ? { status: SYSTEM_ROLES_STATUS.PASS } : { openId },
    isPublic
      ? {
          ...c,
          usageCount: 1,
        }
      : c
  ).sort({
    usageCount: -1,
    createdAt: -1,
  });
  res.json({
    code: 200,
    data: result || [],
  });
});
router.post("/", vipMiddleware, async function (req: any, res) {
  const {
    title,
    description,
    content,
    context = false,
    isSchema = false,
    jsonSchema,
  } = req.body;
  const { openId } = req.auth;
  try {
    const result = await SystemRole.create({
      title: title.substring(0, 100),
      description: description.substring(0, 500),
      content: content.substring(0, 10000),
      context: Boolean(context),
      openId,
      isSchema: Boolean(isSchema),
      jsonSchema,
    });
    res.json({
      code: 200,
      data: result._id,
    });
  } catch (error) {
    res.status(400).json({
      code: 10015,
      message: "非法操作: " + error.message,
    });
  }
});
router.put("/:id", vipMiddleware, async function (req: any, res) {
  const _id = req.params.id;
  const {
    title,
    content,
    description,
    context = false,
    isSchema = false,
    jsonSchema,
  } = req.body;
  const { openId } = req.auth;
  try {
    const result = await SystemRole.updateOne(
      {
        _id,
        openId,
      },
      {
        title: title.substring(0, 100),
        description: description.substring(0, 500),
        content: content.substring(0, 10000),
        context: Boolean(context),
        isSchema: Boolean(isSchema),
        openId,
        jsonSchema,
      }
    );
    if (result.modifiedCount) {
      res.json({
        code: 200,
      });
    } else {
      res.status(400).json({
        code: 10017,
        message: "非法操作",
      });
    }
  } catch (error) {
    res.status(400).json({
      code: 10016,
      message: "非法操作: " + error.message,
    });
  }
});

router.delete("/:id", vipMiddleware, async function (req: any, res) {
  const _id = req.params.id;
  const { openId } = req.auth;
  try {
    const result = await SystemRole.deleteOne({
      _id,
      openId,
    });
    if (result.deletedCount) {
      res.json({
        code: 200,
      });
    } else {
      res.status(400).json({
        code: 10019,
        message: "非法操作",
      });
    }
  } catch (error) {
    res.status(400).json({
      code: 10018,
      message: "非法操作: " + error.message,
    });
  }
});

export default router;
