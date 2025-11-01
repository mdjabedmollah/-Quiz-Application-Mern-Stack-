import Result from "../models/resultModel.js";
export const createResult = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const { title, technology, level, totalQuestions, correct, wrong } =
      req.body;
    if (
      !technology ||
      !level ||
      totalQuestions === undefined ||
      correct === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing fields",
      });
    }

    // compute wrong if not provided
    const computedWrong =
      wrong !== undefined
        ? Number(wrong)
        : Math.max(0, Number(totalQuestions) - Number(correct));
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Missing Title",
      });
    }
    const payload = {
      title: String(title).trim(),
      technology,
      level,
      totalQuestions: Number(totalQuestions),
      correct: Number(correct),
      wrong: computedWrong,
      user: req.user.id, //for a particular user
    };

    const created = await Result.create(payload);
    return res.status(201).json({
      success: true,
      message: "Result Created",
      result: created,
    });
  } catch (error) {
    console.log("CreatResult Error ", error);
    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};
// list the result
export const listResult = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "not authorized",
      });
    }
    const { technology } = req.query;
    const query = { user: req.user.id };
    if (technology && technology.toLowerCase() !== "all") {
      query.technology = technology;
    }

    const items=await Result.find(query).sort({createdAt:-1}).lean()
     return res.json({
        success: true,
        results:items
        
      });

  } catch (error) {
    
    console.log("list Result  Error ", error);
    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
  
};
