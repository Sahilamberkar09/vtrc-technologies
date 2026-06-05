import Quotation from "./quotation.model.js";

// POST /api/quotations — Save new quotation
export const createQuotation = async (req, res) => {
  try {
    const quotation = new Quotation(req.body);
    await quotation.save();
    res.status(201).json({ success: true, data: quotation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/quotations — List all quotations
export const getQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find()
      .sort({ createdAt: -1 })
      .select("quotationNo clientName projectType totalValue date status createdAt");
    res.status(200).json({ success: true, data: quotations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/quotations/:id — Single quotation
export const getQuotationById = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) {
      return res.status(404).json({ success: false, message: "Quotation not found" });
    }
    res.status(200).json({ success: true, data: quotation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/quotations/:id — Update / edit a quotation
export const updateQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!quotation) {
      return res.status(404).json({ success: false, message: "Quotation not found" });
    }
    res.status(200).json({ success: true, data: quotation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/quotations/:id — Delete a quotation
export const deleteQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findByIdAndDelete(req.params.id);
    if (!quotation) {
      return res.status(404).json({ success: false, message: "Quotation not found" });
    }
    res.status(200).json({ success: true, message: "Quotation deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
