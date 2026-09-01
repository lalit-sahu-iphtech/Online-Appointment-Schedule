// src/component/Workflows/Workflows.jsx
import { useState, useEffect, useMemo, useRef } from "react";
import {
  FaSearch,
  FaRegBell,
  FaRegCommentDots,
  FaUserCircle,
  FaChevronDown,
  FaChevronUp,
  FaFilter,
  FaUser,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";
import WorkflowCard from "./WorkflowCard";
import CreateWorkflowModal from "./CreateWorkflowModal";
import "./workflows.css";
import { useLocation, useNavigate } from "react-router-dom";

import Topbar from "../Comman/Topbar";
import { useNotifications } from "../../hooks/useNotifications";
import { getNotificationLabel } from "../../utils/notificationService";
import { useNotificationsContext } from "../../context/NotificationContext";
import { useToast } from "../Toast";

import {
  getWorkflows as firebaseGetWorkflows,
  addWorkflow as firebaseAddWorkflow,
  updateWorkflow as firebaseUpdateWorkflow,
  deleteWorkflow as firebaseDeleteWorkflow
} from "../../services/firestoreService";

import { executeWorkflow } from "../../services/workflowExecutor";

const DEFAULT_WORKFLOWS = [
  {
    id: 1,
    category: "Before Event/Meeting",
    title: "Reminder Event Email",
    description:
      "Reminder emails prevent overlooking important events/tasks in both professional and personal settings.",
    trigger: "1 day before event happens",
    actions: [{ type: "email", label: "Send email to guests", config: {} }],
    isTemplate: true,
    isDefault: true,
  },
  {
    id: 2,
    category: "Before Event/Meeting",
    title: "Cancellation Email",
    description:
      "A cancellation email is a communication sent to inform recipients that a previously scheduled event has been canceled.",
    trigger: "2 hours before event happens",
    actions: [{ type: "email", label: "Send cancellation notification", config: {} }],
    isTemplate: true,
    isDefault: true,
  },
  {
    id: 3,
    category: "After Event/Meeting",
    title: "Thank You Email",
    description:
      "Thank-you emails are a thoughtful way to acknowledge someone's actions and show that their efforts are valued and recognized.",
    trigger: "Immediately after event happens",
    actions: [{ type: "email", label: "Send thank you email", config: {} }],
    isTemplate: true,
    isDefault: true,
  },
  {
    id: 4,
    category: "After Event/Meeting",
    title: "Download eBook",
    description:
      "The presentations cover a wide range of topics discussed by our esteemed speakers, offering valuable insights.",
    trigger: "Immediately after event happens",
    actions: [{ type: "email", label: "Send eBook download link", config: {} }],
    isTemplate: true,
    isDefault: true,
  },
  {
    id: 5,
    category: "After Event/Meeting",
    title: "Wrap-Up Report",
    description:
      "Wrap-Up Report that highlights the key takeaways, accomplishments, and insights from the event.",
    trigger: "1 day after event happens",
    actions: [{ type: "email", label: "Send wrap-up report", config: {} }],
    isTemplate: true,
    isDefault: true,
  },
];

// ✅ Default workflow IDs for quick reference
const DEFAULT_WORKFLOW_IDS = [1, 2, 3, 4, 5];

export default function Workflows({ onWorkflowsChange, onDateChange }) {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [currentUser, setCurrentUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState(null);
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState("templates");
  const [collapsed, setCollapsed] = useState({ before: false, after: false });
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activePanel, setActivePanel] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { addNotifications } = useNotificationsContext();
  
  // ✅ Refs to prevent infinite loop
  const prevDateRef = useRef(null);
  const onDateChangeRef = useRef(onDateChange);
  const isFirstRender = useRef(true);

  // ✅ Update ref when prop changes
  useEffect(() => {
    onDateChangeRef.current = onDateChange;
  }, [onDateChange]);

  // ✅ Notify parent when date changes (without infinite loop)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!onDateChangeRef.current) return;

    const dateStr = selectedDate.toDateString();
    
    if (prevDateRef.current !== dateStr) {
      prevDateRef.current = dateStr;
      onDateChangeRef.current(selectedDate);
    }
  }, [selectedDate]);

  const togglePanel = (panel) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  useEffect(() => {
    if (!activePanel) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest(".workflows-icon-wrap")) {
        setActivePanel(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activePanel]);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      const data = await firebaseGetWorkflows();
      
      const templates = data.filter(w => w.isTemplate === true);
      const userWorkflows = data.filter(w => w.isTemplate === false);
      
      // ✅ Merge default templates with Firebase templates
      const mergedTemplates = DEFAULT_WORKFLOWS.map(template => {
        const existing = templates.find(w => w.id === template.id);
        return existing || template;
      });
      
      const allWorkflows = [...mergedTemplates, ...userWorkflows];
      setWorkflows(allWorkflows);
      
      if (onWorkflowsChange) {
        onWorkflowsChange(allWorkflows);
      }
    } catch (error) {
      console.error("Error loading workflows:", error);
      toast.error('Load Failed', 'Failed to load workflows. Please refresh.');
      setWorkflows(DEFAULT_WORKFLOWS);
      if (onWorkflowsChange) {
        onWorkflowsChange(DEFAULT_WORKFLOWS);
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Check if workflow is a default template (read-only)
  const isDefaultTemplate = (workflow) => {
    return DEFAULT_WORKFLOW_IDS.includes(workflow.id) && workflow.isTemplate === true;
  };

  const handleAddWorkflow = async (newWorkflow) => {
    const loadingToast = toast.loading('Creating Workflow...', 'Please wait');
    
    try {
      const userStr = localStorage.getItem("currentUser");
      const user = userStr ? JSON.parse(userStr) : null;

      const workflowWithUser = {
        ...newWorkflow,
        isTemplate: false,
        isDefault: false,
        createdBy: user?.email || "unknown",
        createdByName: user?.email?.split('@')[0] || "User",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await firebaseAddWorkflow(workflowWithUser);
      await loadWorkflows();
      
      loadingToast.success(
        'Workflow Created',
        `"${newWorkflow.title}" has been created successfully.`
      );
    } catch (error) {
      console.error("Error adding workflow:", error);
      loadingToast.error(
        'Creation Failed',
        error.message || 'Something went wrong. Please try again.'
      );
    }
  };

  const handleUpdateWorkflow = async (id, data) => {
    // ✅ Check if it's a default template
    const workflow = workflows.find(w => w.id === id);
    if (isDefaultTemplate(workflow)) {
      toast.warning('Cannot Edit', 'Default templates cannot be edited.');
      return;
    }

    const loadingToast = toast.loading('Updating Workflow...', 'Please wait');
    
    try {
      await firebaseUpdateWorkflow(id, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      await loadWorkflows();
      
      loadingToast.success(
        'Workflow Updated',
        `"${data.title}" has been updated successfully.`
      );
    } catch (error) {
      console.error("Error updating workflow:", error);
      loadingToast.error(
        'Update Failed',
        error.message || 'Something went wrong. Please try again.'
      );
    }
  };

  // ✅ DELETE workflow - Modified to prevent deleting default templates
  const handleDeleteWorkflow = async (id) => {
    const workflow = workflows.find(w => w.id === id);
    
    // ✅ Check if it's a default template
    if (isDefaultTemplate(workflow)) {
      toast.warning('Cannot Delete', 'Default templates cannot be deleted.');
      return;
    }

    const loadingToast = toast.loading('Deleting Workflow...', 'Please wait');
    
    try {
      await firebaseDeleteWorkflow(id);
      await loadWorkflows();
      
      loadingToast.success(
        'Workflow Deleted',
        'The workflow has been removed successfully.'
      );
    } catch (error) {
      console.error("Error deleting workflow:", error);
      loadingToast.error(
        'Delete Failed',
        error.message || 'Something went wrong. Please try again.'
      );
    }
  };

  // Execute workflow
  const handleExecuteWorkflow = async (id) => {
    const workflow = workflows.find(w => w.id === id);
    if (!workflow) {
      toast.warning("Not Found", "Workflow not found");
      return;
    }

    const userStr = localStorage.getItem("currentUser");
    const user = userStr ? JSON.parse(userStr) : null;

    const testMeeting = {
      meetingName: "Test Meeting - " + new Date().toLocaleString(),
      date: new Date().toISOString().split('T')[0],
      startTime: "10:00",
      endTime: "11:00",
      location: "Conference Room A",
      onlineLink: "https://meet.google.com/test",
      organizerEmail: user?.email || "test@example.com",
      organizerName: user?.email?.split('@')[0] || "Test User",
      invitees: [
        { name: "Test User", email: user?.email || "test@example.com" }
      ]
    };

    const loadingToast = toast.loading('Executing Workflow...', 'Running: ' + workflow.title);

    try {
      const results = await executeWorkflow(workflow, testMeeting);
      
      const successCount = results.filter(r => r.success).length;
      const totalCount = results.length;
      
      if (successCount === totalCount) {
        loadingToast.success(
          'Execution Complete',
          'All ' + totalCount + ' actions executed successfully!'
        );
      } else {
        loadingToast.warning(
          'Partial Execution',
          successCount + '/' + totalCount + ' actions executed successfully.'
        );
      }
    } catch (error) {
      console.error("Error executing workflow:", error);
      loadingToast.error(
        'Execution Failed',
        error.message || 'Something went wrong. Please try again.'
      );
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (!stored) {
      navigate("/signin");
      return;
    }
    try {
      const user = JSON.parse(stored);
      setCurrentUser(user);
    } catch (error) {
      console.error("Invalid currentUser in storage:", error);
      localStorage.removeItem("currentUser");
      navigate("/signin");
      return;
    }
    setCheckingAuth(false);
  }, [navigate, location.pathname]);

  const workflowEvents = useMemo(() => {
    return workflows.map(w => ({
      id: w.id,
      title: w.title,
      date: new Date().toISOString().split('T')[0],
      startTime: "09:00",
      endTime: "10:00",
      location: w.category,
    }));
  }, [workflows]);

  const {
    notifications: workflowNotifs,
    count: workflowNotifCount,
    getLabel: getWorkflowLabel,
  } = useNotifications(workflowEvents, 60);

  useEffect(() => {
    const formattedNotifications = workflowNotifs.map(n => ({
      id: n.id,
      title: n.title,
      diffMinutes: n.diffMinutes,
      category: n.category || "Workflow",
      source: "workflows",
    }));
    addNotifications("workflows", formattedNotifications);
  }, [workflowNotifs, addNotifications]);

  if (checkingAuth) {
    return null;
  }

  if (loading) {
    return <div className="workflows-container">Loading workflows...</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setActivePanel(null);
    navigate("/signin");
    toast.success('Logged Out', 'You have been logged out successfully.');
  };

  const handleProfileClick = () => {
    setActivePanel(null);
    navigate("/profile");
  };

  const handleSettingsClick = () => {
    setActivePanel(null);
    navigate("/settings");
  };

  const toggleCollapse = (key) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const applyFilter = (value) => {
    setActiveFilter(value);
    setFilterOpen(false);
  };

  const getWorkflowsByTab = () => {
    if (activeTab === "my") {
      return workflows.filter(w => !w.isTemplate);
    } else {
      return workflows.filter(w => w.isTemplate);
    }
  };

  const filteredWorkflows = getWorkflowsByTab();

  const beforeEvents = filteredWorkflows.filter(
    (w) => w.category === "Before Event/Meeting"
  );
  const afterEvents = filteredWorkflows.filter(
    (w) => w.category === "After Event/Meeting"
  );

  const filterBySearch = (items) => {
    if (!search) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
    );
  };

  const searchedBefore = filterBySearch(beforeEvents);
  const searchedAfter = filterBySearch(afterEvents);

  const filteredBefore = activeFilter === "after" ? [] : searchedBefore;
  const filteredAfter = activeFilter === "before" ? [] : searchedAfter;

  const displayBefore = showAll ? filteredBefore : filteredBefore.slice(0, 2);
  const displayAfter = showAll ? filteredAfter : filteredAfter.slice(0, 3);

  const totalCount = filteredBefore.length + filteredAfter.length;
  const visibleCount = displayBefore.length + displayAfter.length;

  const handleUseWorkflow = (id) => {
    const workflow = workflows.find((w) => w.id === id);
    toast.success('Workflow Activated', `"${workflow?.title}" has been activated successfully.`);
  };

  // ✅ EDIT workflow - Modified to check if default template
  const handleEditWorkflow = (id) => {
    const workflow = workflows.find((w) => w.id === id);
    if (workflow) {
      if (isDefaultTemplate(workflow)) {
        toast.warning('Cannot Edit', 'Default templates cannot be edited.');
        return;
      }
      setEditingWorkflow(workflow);
      setShowCreateModal(true);
    }
  };

  // ✅ DELETE click handler - Modified
  const handleDeleteWorkflowClick = (id) => {
    const workflow = workflows.find((w) => w.id === id);
    
    if (isDefaultTemplate(workflow)) {
      toast.warning('Cannot Delete', 'Default templates are read-only and cannot be deleted.');
      return;
    }
    
    if (workflow) {
      if (window.confirm(`Are you sure you want to delete "${workflow.title}"?`)) {
        handleDeleteWorkflow(id);
      }
    }
  };

  const addWorkflow = (newWorkflow) => {
    if (editingWorkflow) {
      handleUpdateWorkflow(editingWorkflow.id, newWorkflow);
      setEditingWorkflow(null);
    } else {
      handleAddWorkflow(newWorkflow);
    }
    setShowCreateModal(false);
  };

  const getSearchResults = () => {
    if (!search.trim()) return [];
    return workflows.filter(
      (item) =>
        item.title.toLowerCase().includes(search.trim().toLowerCase()) ||
        item.description.toLowerCase().includes(search.trim().toLowerCase())
    ).map(item => ({
      id: item.id,
      title: item.title,
      category: item.isTemplate ? "Template" : "My Workflow",
    }));
  };

  const searchResults = getSearchResults();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowAll(false);
  };

  const commentsCount = 0;

  return (
    <>
      <Topbar
        title="Workflows"
        createButtonLabel="Create"
        onCreateClick={() => {
          setEditingWorkflow(null);
          setShowCreateModal(true);
        }}
        searchPlaceholder="Search by workflow name"
        searchResults={searchResults}
        onSearchChange={(value) => setSearch(value)}
        onSearchResultClick={() => {
          setActivePanel(null);
          setSearch("");
        }}
        commentsCount={commentsCount}
        currentUser={currentUser}
        onLogout={handleLogout}
        onProfileClick={handleProfileClick}
        onSettingsClick={handleSettingsClick}
      />

      <div className="workflows-container">
        <div className="workflows-tabs-row">
          <div className="workflows-tabs">
            <button
              className={`workflows-tab ${activeTab === "my" ? "active" : ""}`}
              onClick={() => handleTabChange("my")}
            >
              My workflow
              <span className="workflows-tab-count">
                {workflows.filter(w => !w.isTemplate).length}
              </span>
            </button>
            <button
              className={`workflows-tab ${activeTab === "templates" ? "active" : ""}`}
              onClick={() => handleTabChange("templates")}
            >
              Templates
              <span className="workflows-tab-count">
                {workflows.filter(w => w.isTemplate).length}
              </span>
            </button>
          </div>

          <div className="workflows-filter-wrap">
            <button
              className={`workflows-filter-btn ${filterOpen ? "open" : ""}`}
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <FaFilter /> Filter
            </button>

            {filterOpen && (
              <div className="workflows-filter-backdrop" onClick={() => setFilterOpen(false)} />
            )}

            {filterOpen && (
              <div className="workflows-filter-menu">
                <button
                  className={activeFilter === "all" ? "active" : ""}
                  onClick={() => applyFilter("all")}
                >
                  All workflows
                </button>
                <button
                  className={activeFilter === "before" ? "active" : ""}
                  onClick={() => applyFilter("before")}
                >
                  Before Event/Meeting
                </button>
                <button
                  className={activeFilter === "after" ? "active" : ""}
                  onClick={() => applyFilter("after")}
                >
                  After Event/Meeting
                </button>
              </div>
            )}
          </div>
        </div>

        {activeTab === "my" && filteredWorkflows.length === 0 && (
          <div className="workflows-empty">
            <div className="workflows-empty-icon">📋</div>
            <h3>No workflows created yet</h3>
            <p>Create your first workflow to automate your event processes.</p>
            <button
              className="workflows-create-btn"
              onClick={() => {
                setEditingWorkflow(null);
                setShowCreateModal(true);
              }}
            >
              <span>+</span> Create Workflow
            </button>
          </div>
        )}

        {displayBefore.length > 0 && (
          <div className="workflows-section">
            <div className="workflows-section-header">
              <h2 className="workflows-section-title">Before Event/Meeting</h2>
              <button
                className={`workflows-section-collapse ${collapsed.before ? "collapsed" : ""}`}
                onClick={() => toggleCollapse("before")}
              >
                <FaChevronUp />
              </button>
            </div>
            {!collapsed.before && (
              <div className="workflows-grid">
                {displayBefore.map((workflow) => (
                  <WorkflowCard
                    key={workflow.id}
                    workflow={workflow}
                    onUse={handleUseWorkflow}
                    onEdit={handleEditWorkflow}
                    onDelete={handleDeleteWorkflowClick}
                    onExecute={handleExecuteWorkflow}
                    isTemplate={workflow.isTemplate}
                    isReadOnly={isDefaultTemplate(workflow)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {displayAfter.length > 0 && (
          <div className="workflows-section">
            <div className="workflows-section-header">
              <h2 className="workflows-section-title">After Event/Meeting</h2>
              <button
                className={`workflows-section-collapse ${collapsed.after ? "collapsed" : ""}`}
                onClick={() => toggleCollapse("after")}
              >
                <FaChevronUp />
              </button>
            </div>
            {!collapsed.after && (
              <div className="workflows-grid">
                {displayAfter.map((workflow) => (
                  <WorkflowCard
                    key={workflow.id}
                    workflow={workflow}
                    onUse={handleUseWorkflow}
                    onEdit={handleEditWorkflow}
                    onDelete={handleDeleteWorkflowClick}
                    onExecute={handleExecuteWorkflow}
                    isTemplate={workflow.isTemplate}
                    isReadOnly={isDefaultTemplate(workflow)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {totalCount > visibleCount && (
          <div className="workflows-show-more">
            <button onClick={() => setShowAll(true)}>
              Show more ({totalCount - visibleCount} more)
            </button>
          </div>
        )}

        {showAll && totalCount > 5 && (
          <div className="workflows-show-more">
            <button onClick={() => setShowAll(false)}>Show less</button>
          </div>
        )}

        {activeTab === "templates" && filteredWorkflows.length === 0 && (
          <div className="workflows-empty">
            <p>No templates available</p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateWorkflowModal
          onClose={() => {
            setShowCreateModal(false);
            setEditingWorkflow(null);
          }}
          onSave={addWorkflow}
          initialData={editingWorkflow}
          isEditMode={!!editingWorkflow}
        />
      )}
    </>
  );
}