export const create = async (req, res, model) => {
  try {
    const data = new model(req.body);
    await data.save();
    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

export const update = async (req, res, model) => {
  try {
    const data = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!data) {
      return res.status(404).json({ message: "Data not found" });
    }
    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

export const getAll = async (req, res, model) => {
  try {
    const data = await model.find();
    if (!data) {
      return res.status(404).json({
        message: "Data not found",
      });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

export const getById = async (req, res, model) => {
  try {
    const data = await model.findById(req.params.id);
    if (!data) {
      return res.status(404).json({
        message: "Data not found",
      });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

export const remove = async (req, res, model) => {
  try {
    const data = await model.findByIdAndDelete(req.params.id);
    if (!data) {
      return res.status(404).json({
        message: "Data not found",
      });
    }
    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};
