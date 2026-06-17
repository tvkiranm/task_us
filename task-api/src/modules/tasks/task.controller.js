exports.getAllTasks = (req, res) => {
  res.status(200).json({
    message: "All Tasks",
    data: [],
  });
};

exports.createTask = (req, res) => {
  res.status(201).json({
    message: "Create Task",
    data: req.body || {},
  });
};
