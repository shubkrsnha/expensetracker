import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Expenses.css";

const API_URL = "";
const LIMIT = 10;

const CATEGORIES = [
  "Food",
  "Shopping",
  "Transport",
  "Entertainment",
  "Utilities",
  "Other",
];

const PAYMENT_METHODS = [
  "Cash",
  "UPI",
  "Credit Card",
  "Debit Card",
  "Bank Transfer",
];

const CATEGORY_ICONS = {
  Food: "🍔",
  Shopping: "🛍️",
  Transport: "🚗",
  Entertainment: "🎬",
  Utilities: "💡",
  Other: "💳",
};

const EMPTY_FORM = {
  title: "",
  amount: "",
  category: "Food",
  paymentMethod: "UPI",
  date: "",
  notes: "",
};


/* =========================================================
   HELPER FUNCTIONS
========================================================= */

const getToday = () => {
  return new Date().toISOString().split("T")[0];
};


const getErrorMessage = (
  error,
  fallbackMessage
) => {
  if (
    error instanceof Error &&
    error.message
  ) {
    return error.message;
  }

  return fallbackMessage;
};


const formatMoney = (value) => {
  const amount = Number(value || 0);

  return `₹${amount.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
};


const formatDate = (date) => {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};


const getCategoryIcon = (
  categoryName
) => {
  return (
    CATEGORY_ICONS[categoryName] ||
    "💳"
  );
};


const getFormDate = (date) => {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate
    .toISOString()
    .split("T")[0];
};


/*
 * Avoid nested ternary operators.
 *
 * SonarQube:
 * javascript:S3358
 */
const getSubmitButtonText = (
  saving,
  editingId
) => {
  if (saving) {
    return "Saving...";
  }

  if (editingId) {
    return "Update Expense";
  }

  return "Save Expense";
};


/*
 * Convert API response into a safe object.
 */
const parseJsonResponse = async (
  response
) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};


/* =========================================================
   COMPONENT
========================================================= */

function Expenses() {
  const navigate = useNavigate();

  const token =
    localStorage.getItem("token");

  const [expenses, setExpenses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [sort, setSort] =
    useState("date");

  const [order, setOrder] =
    useState("desc");

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [form, setForm] =
    useState(EMPTY_FORM);

  const [saving, setSaving] =
    useState(false);

  const [page, setPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);


  /* =========================================================
     FETCH EXPENSES
  ========================================================= */

  const fetchExpenses =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const params =
          new URLSearchParams();

        params.set(
          "page",
          String(page)
        );

        params.set(
          "limit",
          String(LIMIT)
        );

        const trimmedSearch =
          search.trim();

        if (trimmedSearch) {
          params.set(
            "search",
            trimmedSearch
          );
        }

        if (category) {
          params.set(
            "category",
            category
          );
        }

        params.set("sort", sort);
        params.set("order", order);

        const response =
          await fetch(
            `${API_URL}/api/expenses?${params.toString()}`,
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const result =
          await parseJsonResponse(
            response
          );

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Unable to fetch expenses"
          );
        }

        const expenseList =
          result.expenses ||
          result.data ||
          [];

        const responseTotalPages =
          result.totalPages ||
          result.pagination?.totalPages ||
          1;

        const safeTotalPages =
          Number(responseTotalPages);

        const validTotalPages =
          safeTotalPages > 0
            ? safeTotalPages
            : 1;

        setExpenses(
          Array.isArray(expenseList)
            ? expenseList
            : []
        );

        setTotalPages(
          validTotalPages
        );
      } catch (fetchError) {
        console.error(
          "Expenses fetch error:",
          fetchError
        );

        setError(
          getErrorMessage(
            fetchError,
            "Unable to load expenses"
          )
        );
      } finally {
        setLoading(false);
      }
    }, [
      token,
      page,
      search,
      category,
      sort,
      order,
    ]);


  /* =========================================================
     AUTHENTICATION
  ========================================================= */

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    void fetchExpenses();
  }, [
    token,
    navigate,
    fetchExpenses,
  ]);


  /* =========================================================
     FORM CHANGE
  ========================================================= */

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm(
      (previousForm) => ({
        ...previousForm,
        [name]: value,
      })
    );
  };


  /* =========================================================
     ADD FORM
  ========================================================= */

  const openAddForm = () => {
    setEditingId(null);

    setForm({
      ...EMPTY_FORM,
      date: getToday(),
    });

    setError("");
    setShowForm(true);
  };


  /* =========================================================
     EDIT FORM
  ========================================================= */

  const openEditForm = (
    expense
  ) => {
    setEditingId(
      expense._id
    );

    setForm({
      title:
        expense.title || "",

      amount:
        expense.amount || "",

      category:
        expense.category ||
        "Food",

      paymentMethod:
        expense.paymentMethod ||
        "UPI",

      date:
        getFormDate(
          expense.date
        ),

      notes:
        expense.notes || "",
    });

    setError("");
    setShowForm(true);
  };


  /* =========================================================
     CLOSE FORM
  ========================================================= */

  const closeForm = () => {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };


  /* =========================================================
     MODAL CANCEL
  ========================================================= */

  const handleModalCancel = (
    event
  ) => {
    event.preventDefault();
    closeForm();
  };


  /* =========================================================
     SAVE EXPENSE
  ========================================================= */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    const title =
      form.title.trim();

    const amount =
      Number(form.amount);

    const notes =
      form.notes.trim();

    if (
      !title ||
      !form.amount ||
      !form.date
    ) {
      setError(
        "Please fill all required fields."
      );

      return;
    }

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      setError(
        "Please enter a valid amount greater than zero."
      );

      return;
    }

    try {
      setSaving(true);
      setError("");

      const isEditing =
        Boolean(editingId);

      let method = "POST";

      let url =
        `${API_URL}/api/expenses`;

      if (isEditing) {
        method = "PUT";

        url =
          `${API_URL}/api/expenses/${editingId}`;
      }

      const requestBody = {
        title,
        amount,
        category:
          form.category,
        paymentMethod:
          form.paymentMethod,
        date:
          form.date,
        notes,
      };

      const response =
        await fetch(url, {
          method,

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body:
            JSON.stringify(
              requestBody
            ),
        });

      const result =
        await parseJsonResponse(
          response
        );

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to save expense"
        );
      }

      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_FORM);

      await fetchExpenses();
    } catch (saveError) {
      console.error(
        "Save expense error:",
        saveError
      );

      setError(
        getErrorMessage(
          saveError,
          "Unable to save expense"
        )
      );
    } finally {
      setSaving(false);
    }
  };


  /* =========================================================
     DELETE EXPENSE
  ========================================================= */

  const handleDelete = async (
    expenseId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this expense?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response =
        await fetch(
          `${API_URL}/api/expenses/${expenseId}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const result =
        await parseJsonResponse(
          response
        );

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to delete expense"
        );
      }

      /*
       * If the current page contains
       * only one item, move to previous
       * page after deletion.
       */
      if (
        expenses.length === 1 &&
        page > 1
      ) {
        setPage(
          (previousPage) =>
            previousPage - 1
        );

        return;
      }

      await fetchExpenses();
    } catch (deleteError) {
      console.error(
        "Delete expense error:",
        deleteError
      );

      setError(
        getErrorMessage(
          deleteError,
          "Unable to delete expense"
        )
      );
    }
  };


  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearchChange = (
    event
  ) => {
    setPage(1);

    setSearch(
      event.target.value
    );
  };


  /* =========================================================
     CATEGORY
  ========================================================= */

  const handleCategoryChange = (
    event
  ) => {
    setPage(1);

    setCategory(
      event.target.value
    );
  };


  /* =========================================================
     SORT
  ========================================================= */

  const handleSortChange = (
    event
  ) => {
    const [
      newSort,
      newOrder,
    ] =
      event.target.value.split(
        "-"
      );

    setPage(1);
    setSort(newSort);
    setOrder(newOrder);
  };


  /* =========================================================
     LOADING
  ========================================================= */

  if (
    loading &&
    expenses.length === 0
  ) {
    return (
      <main
        className="expenses-loading"
        aria-live="polite"
      >
        <div
          className="expenses-spinner"
          aria-hidden="true"
        />

        <p>
          Loading expenses...
        </p>
      </main>
    );
  }


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="expenses-page">

      {/* ===================================================
          HEADER
      =================================================== */}

      <section className="expenses-header">

        <div className="expenses-heading">

          <span className="expenses-eyebrow">
            MONEY MANAGEMENT
          </span>

          <h1>
            Expenses
          </h1>

          <p>
            Track and manage all your
            spending in one place.
          </p>

        </div>


        <button
          type="button"
          className="expenses-add-button"
          onClick={openAddForm}
        >
          <span
            className="add-icon"
            aria-hidden="true"
          >
            +
          </span>

          <span>
            Add Expense
          </span>
        </button>

      </section>


      {/* ===================================================
          ERROR
      =================================================== */}

      {error && (
        <div
          className="expenses-error"
          role="alert"
        >
          <span>
            {error}
          </span>
        </div>
      )}


      {/* ===================================================
          TOOLBAR
      =================================================== */}

      <section
        className="expenses-toolbar"
        aria-label="Expense filters"
      >

        <div className="expenses-search">

          <span
            className="search-icon"
            aria-hidden="true"
          >
            ⌕
          </span>

          <input
            type="search"
            placeholder="Search expenses..."
            aria-label="Search expenses"
            value={search}
            onChange={
              handleSearchChange
            }
          />

        </div>


        <select
          value={category}
          onChange={
            handleCategoryChange
          }
          aria-label="Filter expenses by category"
        >
          <option value="">
            All Categories
          </option>

          {CATEGORIES.map(
            (item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            )
          )}
        </select>


        <select
          value={`${sort}-${order}`}
          onChange={
            handleSortChange
          }
          aria-label="Sort expenses"
        >
          <option value="date-desc">
            Newest first
          </option>

          <option value="date-asc">
            Oldest first
          </option>

          <option value="amount-desc">
            Highest amount
          </option>

          <option value="amount-asc">
            Lowest amount
          </option>
        </select>

      </section>


      {/* ===================================================
          EXPENSE CARD
      =================================================== */}

      <section
        className="expenses-card"
        aria-label="Expense list"
      >

        <div className="expenses-table-header">

          <span>
            EXPENSE
          </span>

          <span>
            CATEGORY
          </span>

          <span>
            PAYMENT
          </span>

          <span>
            DATE
          </span>

          <span>
            AMOUNT
          </span>

          <span>
            ACTION
          </span>

        </div>


        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {expenses.length === 0 ? (

          <div className="expenses-empty">

            <div
              className="expenses-empty-icon"
              aria-hidden="true"
            >
              💰
            </div>

            <h2>
              No expenses found
            </h2>

            <p>
              Try changing your filters
              or add a new expense.
            </p>

            <button
              type="button"
              onClick={openAddForm}
            >
              <span
                aria-hidden="true"
              >
                +
              </span>

              <span>
                Add Expense
              </span>
            </button>

          </div>

        ) : (

          /* =================================================
             EXPENSE LIST
          ================================================= */

          <div className="expenses-list">

            {expenses.map(
              (expense) => (

                <div
                  className="expense-item"
                  key={expense._id}
                >

                  {/* EXPENSE */}

                  <div className="expense-title">

                    <div
                      className="expense-category-icon"
                      aria-hidden="true"
                    >
                      {getCategoryIcon(
                        expense.category
                      )}
                    </div>

                    <div className="expense-title-content">

                      <strong>
                        {expense.title}
                      </strong>

                      {expense.notes && (
                        <small>
                          {expense.notes}
                        </small>
                      )}

                    </div>

                  </div>


                  {/* CATEGORY */}

                  <div className="expense-category">

                    <span>
                      {expense.category}
                    </span>

                  </div>


                  {/* PAYMENT */}

                  <div className="expense-payment">

                    <span>
                      {expense.paymentMethod}
                    </span>

                  </div>


                  {/* DATE */}

                  <div className="expense-date">

                    <span>
                      {formatDate(
                        expense.date
                      )}
                    </span>

                  </div>


                  {/* AMOUNT */}

                  <div className="expense-amount">

                    <span>
                      {formatMoney(
                        expense.amount
                      )}
                    </span>

                  </div>


                  {/* ACTIONS */}

                  <div className="expense-actions">

                    <button
                      type="button"
                      className="edit-button"
                      onClick={() =>
                        openEditForm(
                          expense
                        )
                      }
                      aria-label={`Edit ${expense.title}`}
                    >
                      <span>
                        Edit
                      </span>
                    </button>


                    <button
                      type="button"
                      className="delete-button"
                      onClick={() =>
                        handleDelete(
                          expense._id
                        )
                      }
                      aria-label={`Delete ${expense.title}`}
                    >
                      <span>
                        Delete
                      </span>
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </section>


      {/* ===================================================
          PAGINATION
      =================================================== */}

      {expenses.length > 0 && (

        <nav
          className="expenses-pagination"
          aria-label="Expense pagination"
        >

          <button
            type="button"
            disabled={
              page === 1
            }
            onClick={() =>
              setPage(
                (previousPage) =>
                  previousPage - 1
              )
            }
          >
            <span
              aria-hidden="true"
            >
              ←
            </span>

            <span>
              Previous
            </span>
          </button>


          <span className="pagination-status">

            <span>
              Page
            </span>

            <strong>
              {page}
            </strong>

            <span>
              of
            </span>

            <strong>
              {totalPages}
            </strong>

          </span>


          <button
            type="button"
            disabled={
              page >= totalPages
            }
            onClick={() =>
              setPage(
                (previousPage) =>
                  previousPage + 1
              )
            }
          >
            <span>
              Next
            </span>

            <span
              aria-hidden="true"
            >
              →
            </span>
          </button>

        </nav>

      )}


      {/* ===================================================
          ADD / EDIT MODAL

          IMPORTANT:
          Native <dialog> is used.

          There is NO:
          - div onClick
          - div onMouseDown
          - role="dialog"
          - role="presentation"
      =================================================== */}

      {showForm && (

        <dialog
          className="expense-modal"
          open
          aria-labelledby="expense-modal-title"
          onCancel={
            handleModalCancel
          }
        >

          {/* MODAL HEADER */}

          <div className="modal-header">

            <div className="modal-title-section">

              <span className="modal-eyebrow">
                EXPENSE
              </span>

              <h2 id="expense-modal-title">
                {editingId
                  ? "Edit Expense"
                  : "Add Expense"}
              </h2>

            </div>


            <button
              type="button"
              className="modal-close"
              onClick={closeForm}
              disabled={saving}
              aria-label="Close expense form"
            >
              <span
                aria-hidden="true"
              >
                ×
              </span>
            </button>

          </div>


          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={handleSubmit}
          >

            {/* TITLE */}

            <div className="form-group">

              <label htmlFor="expense-title">
                <span>
                  Title *
                </span>
              </label>

              <input
                id="expense-title"
                type="text"
                name="title"
                value={form.title}
                onChange={
                  handleChange
                }
                placeholder="e.g. Lunch"
                maxLength={100}
                required
              />

            </div>


            {/* AMOUNT + DATE */}

            <div className="form-row">

              <div className="form-group">

                <label htmlFor="expense-amount">
                  <span>
                    Amount *
                  </span>
                </label>

                <input
                  id="expense-amount"
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={
                    handleChange
                  }
                  placeholder="250"
                  min="0.01"
                  step="0.01"
                  required
                />

              </div>


              <div className="form-group">

                <label htmlFor="expense-date">
                  <span>
                    Date *
                  </span>
                </label>

                <input
                  id="expense-date"
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

            </div>


            {/* CATEGORY + PAYMENT */}

            <div className="form-row">

              <div className="form-group">

                <label htmlFor="expense-category">
                  <span>
                    Category
                  </span>
                </label>

                <select
                  id="expense-category"
                  name="category"
                  value={
                    form.category
                  }
                  onChange={
                    handleChange
                  }
                >

                  {CATEGORIES.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}

                </select>

              </div>


              <div className="form-group">

                <label htmlFor="expense-payment">
                  <span>
                    Payment Method
                  </span>
                </label>

                <select
                  id="expense-payment"
                  name="paymentMethod"
                  value={
                    form.paymentMethod
                  }
                  onChange={
                    handleChange
                  }
                >

                  {PAYMENT_METHODS.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}

                </select>

              </div>

            </div>


            {/* NOTES */}

            <div className="form-group">

              <label htmlFor="expense-notes">
                <span>
                  Notes
                </span>
              </label>

              <textarea
                id="expense-notes"
                name="notes"
                value={form.notes}
                onChange={
                  handleChange
                }
                placeholder="Optional notes..."
                rows={3}
                maxLength={500}
              />

            </div>


            {/* ACTIONS */}

            <div className="modal-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={closeForm}
                disabled={saving}
              >
                <span>
                  Cancel
                </span>
              </button>


              <button
                type="submit"
                className="save-button"
                disabled={saving}
              >
                <span>
                  {getSubmitButtonText(
                    saving,
                    editingId
                  )}
                </span>
              </button>

            </div>

          </form>

        </dialog>

      )}

    </main>
  );
}

export default Expenses;