import { useState, useEffect } from 'react';
import { listAssignments, getEmployeeAssignmentSummary, deleteEmployeeAssignment } from '../../../services/api/assignmentsApi';

const PAGE_SIZE = 12;
const officeOptions = [
  "Heber City Office",
  "West Valley Office",
  "So. Idaho",
  "Utah Valley",
];

const useAssignmentManagement = (onSuccess) => {
  const [assignments, setAssignments] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [officeFilter, setOfficeFilter] = useState("");
  const [refreshToken, setRefreshToken] = useState(0);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  const [unassigning, setUnassigning] = useState(false);
  const [unassignError, setUnassignError] = useState("");

  // Load assignments list
  useEffect(() => {
    let cancelled = false;

    const loadAssignments = async () => {
      setListLoading(true);
      setListError("");
      try {
        const response = await listAssignments({
          page,
          size: PAGE_SIZE,
          search: searchTerm || undefined,
          office: officeFilter || undefined,
        });
        if (cancelled) return;
        setAssignments(response?.content || []);
        setTotalPages(response?.totalPages ?? 0);
      } catch (error) {
        console.error("Error loading assignments", error);
        if (cancelled) return;
        setAssignments([]);
        setTotalPages(0);
        setListError(
          error.message || "We couldn't load the assignments. Please try again."
        );
      } finally {
        if (!cancelled) {
          setListLoading(false);
        }
      }
    };

    loadAssignments();
    return () => {
      cancelled = true;
    };
  }, [page, searchTerm, officeFilter, refreshToken]);

  // Load assignment details
  useEffect(() => {
    if (!selectedEmployeeId) {
      setDetail(null);
      setDetailError("");
      setUnassignError("");
      return undefined;
    }

    let cancelled = false;
    setDetailLoading(true);
    setDetailError("");
    setUnassignError("");

    getEmployeeAssignmentSummary(selectedEmployeeId)
      .then((summary) => {
        if (cancelled) return;
        setDetail(summary);
      })
      .catch((error) => {
        console.error("Error loading assignment summary", error);
        if (cancelled) return;
        setDetail(null);
        setDetailError(
          error.message || "We couldn't load the assignment information."
        );
      })
      .finally(() => {
        if (!cancelled) {
          setDetailLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedEmployeeId]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchTerm(searchInput.trim());
    setPage(0);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setOfficeFilter("");
    setPage(0);
  };

  const handleOfficeFilterChange = (value) => {
    setOfficeFilter(value);
    setPage(0);
  };

  const handleSelectAssignment = (assignment) => {
    if (!assignment?.employee?.id) return;
    const employeeId = assignment.employee.id;
    setSelectedEmployeeId(employeeId);
    setSelectedAssignment(assignment);
  };

  const handleUnassign = async () => {
    if (!selectedEmployeeId) return;
    setUnassigning(true);
    setUnassignError("");
    try {
      const summary = await deleteEmployeeAssignment(selectedEmployeeId);
      setDetail(summary);
      setSelectedEmployeeId(null);
      setSelectedAssignment(null);
      setRefreshToken(Date.now());
      setPage(0);
      onSuccess?.({ type: "assignment", summary });
    } catch (error) {
      console.error("Error removing assignment", error);
      setUnassignError(
        error.message || "We couldn't remove the assignment. Please try again."
      );
    } finally {
      setUnassigning(false);
    }
  };

  const handlePrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNextPage = () => {
    setPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev));
  };

  const handleRefresh = () => {
    setRefreshToken(Date.now());
  };

  const summaryEmployee = detail?.employee || selectedAssignment?.employee || null;
  const assignedComputer = detail?.computer || selectedAssignment?.computer || null;
  const assignmentInfo = detail?.assignment || selectedAssignment?.assignment || null;

  return {
    // List state
    assignments,
    listLoading,
    listError,
    page,
    totalPages,
    searchInput,
    officeFilter,
    officeOptions,

    // Detail state
    summaryEmployee,
    assignedComputer,
    assignmentInfo,
    detailLoading,
    detailError,
    unassigning,
    unassignError,

    // Handlers
    setSearchInput,
    handleSearchSubmit,
    handleClearSearch,
    handleOfficeFilterChange,
    handleSelectAssignment,
    handleUnassign,
    handlePrevPage,
    handleNextPage,
    handleRefresh,
  };
};

export default useAssignmentManagement;
