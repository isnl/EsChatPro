const limitMiddleware = async (req, res, next) => {
  let jsonSize = req.headers["content-length"];
  // 不能大于5Mb
  if (jsonSize > 5 * 1024 * 1024) {
    const currentSize = (jsonSize / 1024 / 1024).toFixed(2);
    return res.status(400).json({
      code: 10018,
      message: `数据量最大为限制5Mb，当前大小为${currentSize}Mb，请将对话内容酌情删减后重试`,
    });
  }
  next();
};

export { limitMiddleware };
