const mongoose = require("mongoose");
const Expense = require("../models/Expense");

// ==========================================
// CREATE EXPENSE
// ==========================================

const createExpense = async (req, res, next) => {
  try {
    const userId = req.userId;

    const {
      title,
      amount,
      category,
      paymentMethod,
      date,
      notes,
    } = req.body;

    const expense = await Expense.create({
      userId,
      title,
      amount,
      category,
      paymentMethod,
      date,
      notes,
    });

    return res.status(201).json({
      message: "Expense created successfully",
      expense,
    });

  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET ALL EXPENSES
// ==========================================

const getExpenses = async (req, res, next) => {
  try {
    const userId = req.userId;

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    if (page < 1) {
      page = 1;
    }

    if (limit < 1) {
      limit = 10;
    }

    if (limit > 100) {
      limit = 100;
    }

    const skip = (page - 1) * limit;

    // ======================================
    // USER-SPECIFIC FILTER
    // ======================================

    const filter = {
      userId: userId,
    };

    // ======================================
    // CATEGORY FILTER
    // ======================================

    if (req.query.category) {
      filter.category = req.query.category;
    }

    // ======================================
    // SEARCH
    // ======================================

    if (req.query.search) {
      const search = req.query.search;

      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          category: {
            $regex: search,
            $options: "i",
          },
        },
        {
          paymentMethod: {
            $regex: search,
            $options: "i",
          },
        },
        {
          notes: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // ======================================
    // SORTING
    // ======================================

    const allowedSortFields = [
      "amount",
      "date",
      "title",
      "category",
    ];

    let sortBy = req.query.sort || "date";
    let order = req.query.order || "desc";

    if (!allowedSortFields.includes(sortBy)) {
      sortBy = "date";
    }

    if (order !== "asc" && order !== "desc") {
      order = "desc";
    }

    const sortOrder = order === "asc" ? 1 : -1;

    const sort = {
      [sortBy]: sortOrder,
    };

    // ======================================
    // DATABASE QUERY
    // ======================================

    const expenses = await Expense.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // ======================================
    // TOTAL
    // ======================================

    const totalExpenses =
      await Expense.countDocuments(filter);

    const totalPages =
      Math.ceil(totalExpenses / limit);

    // ======================================
    // RESPONSE
    // ======================================

    return res.status(200).json({
      message: "Expenses fetched successfully",

      pagination: {
        currentPage: page,
        limit: limit,
        totalExpenses: totalExpenses,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },

      filters: {
        category: req.query.category || null,
        search: req.query.search || null,
        sort: sortBy,
        order: order,
      },

      expenses,
    });

  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET EXPENSE BY ID
// ==========================================

const getExpenseById = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Explicit ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      const error = new Error("Invalid expense ID");
      error.statusCode = 400;
      error.name = "CastError";

      return next(error);
    }

    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: userId,
    });

    if (!expense) {
      const error = new Error("Expense not found");
      error.statusCode = 404;

      return next(error);
    }

    return res.status(200).json({
      message: "Expense fetched successfully",
      expense,
    });

  } catch (error) {
    next(error);
  }
};

// ==========================================
// UPDATE EXPENSE
// ==========================================

const updateExpense = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Explicit ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      const error = new Error("Invalid expense ID");
      error.statusCode = 400;
      error.name = "CastError";

      return next(error);
    }

    const expense = await Expense.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: userId,
      },
      {
        $set: req.body,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!expense) {
      const error = new Error("Expense not found");
      error.statusCode = 404;

      return next(error);
    }

    return res.status(200).json({
      message: "Expense updated successfully",
      expense,
    });

  } catch (error) {
    next(error);
  }
};

// ==========================================
// DELETE EXPENSE
// ==========================================

const deleteExpense = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Explicit ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      const error = new Error("Invalid expense ID");
      error.statusCode = 400;
      error.name = "CastError";

      return next(error);
    }

    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: userId,
    });

    if (!expense) {
      const error = new Error("Expense not found");
      error.statusCode = 404;

      return next(error);
    }

    return res.status(200).json({
      message: "Expense deleted successfully",
      expense,
    });

  } catch (error) {
    next(error);
  }
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
};
