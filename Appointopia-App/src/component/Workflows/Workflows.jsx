// src/component/Workflows/Workflows.jsx
import { useState, useEffect, useMemo } from "react";
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

// Import Common Topbar & Notification System
import Topbar from "../Comman/Topbar";
import { useNotifications } from "../../hooks/useNotifications";
import { getNotificationLabel } from "../../utils/notificationService";
import { useNotificationsContext } from "../../context/NotificationContext";
import { useToast } from "../Toast";

// ✅ Firebase Services
import {
  getWorkflows as firebaseGetWorkflows,
  addWorkflow as firebaseAddWorkflow,
  updateWorkflow as firebaseUpdateWorkflow,
  deleteWorkflow as firebaseDeleteWorkflow
} from "../../services/firestoreService";

// DEFAULT WORKFLOWS (Templates)
const DEFAULT_WORKFLOWS = [
  {
    id: 1,
    category: "Before Event/Meeting",
    title: "Reminder Event Email",
    description:
      "Reminder emails prevent overlooking important events/tasks in both professional and personal settings.",
    trigger: "1 day before event happens",
    actions: ["Send email to guests"],
    isTemplate: true,
  },
  {
    id: 2,
    category: "Before Event/Meeting",
    title: "Cancellation Email",
    description:
      "A cancellation email is a communication sent to inform recipients that a previously scheduled event has been canceled.",
    trigger: "2 hours before event happens",
    actions: ["Send cancellation notification"],
    isTemplate: true,
  },
  {
    id: 3,
    category: "After Event/Meeting",
    title: "Thank You Email",
    description:
      "Thank-you emails are a thoughtful way to acknowledge someone's actions and show that their efforts are valued and recognized.",
    trigger: "Immediately after event happens",
    actions: ["Send thank you email"],
    isTemplate: true,
  },
  {
    id: 4,
    category: "After Event/Meeting",
    title: "Download eBook",
    description:
      "The presentations cover a wide range of topics discussed by our esteemed speakers, offering valuable insights.",
    trigger: "Immediately after event happens",
    actions: ["Send eBook download link"],
    isTemplate: true,
  },
  {
    id: 5,
    category: "After Event/Meeting",
    title: "Wrap-Up Report",
    description:
      "Wrap-Up Report that highlights the key takeaways, accomplishments, and insights from the event.",
    trigger: "1 day after event happens",
    actions: ["Send wrap-up report"],
    isTemplate: true,
  },
];

export default function Workflows({ onWorkflowsChange }) {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  // ===== ALL STATE HOOKS =====
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

  // Get notification context
  const { addNotifications } = useNotificationsContext();

  // ===== ALL EFFECTS =====

  // Toggle panels
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

  // ✅ LOAD WORKFLOWS FROM FIREBASE
  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      const data = await firebaseGetWorkflows();
      
      // ✅ Separate templates and user workflows
      const templates = data.filter(w => w.isTemplate === true);
      const userWorkflows = data.filter(w => w.isTemplate === false);
      
      // ✅ Merge with default templates (if any missing)
      const mergedTemplates = DEFAULT_WORKFLOWS.map(template => {
        const existing = templates.find(w => w.id === template.id);
        return existing || template;
      });
      
      setWorkflows([...mergedTemplates, ...userWorkflows]);
      
      if (onWorkflowsChange) {
        onWorkflowsChange([...mergedTemplates, ...userWorkflows]);
      }
    } catch (error) {
      console.error("❌ Error loading workflows:", error);
      toast.error('❌ Load Failed', 'Failed to load workflows. Please refresh.');
      // ✅ Fallback to default templates
      setWorkflows(DEFAULT_WORKFLOWS);
    } finally {
      setLoading(false);
    }
  };

  // ===== ✅ CRUD OPERATIONS =====

  // ✅ Add workflow
  const handleAddWorkflow = async (newWorkflow) => {
    const loadingToast = toast.loading('⏳ Creating Workflow...', 'Please wait');
    
    try {
      const userStr = localStorage.getItem("currentUser");
      const user = userStr ? JSON.parse(userStr) : null;

      const workflowWithUser = {
        ...newWorkflow,
        isTemplate: false,
        createdBy: user?.email || "unknown",
        createdByName: user?.email?.split('@')[0] || "User",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await firebaseAddWorkflow(workflowWithUser);
      await loadWorkflows();
      
      loadingToast.success(
        '✅ Workflow Created!',
        `"${newWorkflow.title}" has been created successfully.`
      );
    } catch (error) {
      console.error("❌ Error adding workflow:", error);
      loadingToast.error(
        '❌ Creation Failed',
        error.message || 'Something went wrong. Please try again.'
      );
    }
  };

  // ✅ Update workflow
  const handleUpdateWorkflow = async (id, data) => {
    const loadingToast = toast.loading('⏳ Updating Workflow...', 'Please wait');
    
    try {
      await firebaseUpdateWorkflow(id, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      await loadWorkflows();
      
      loadingToast.success(
        '✅ Workflow Updated!',
        `"${data.title}" has been updated successfully.`
      );
    } catch (error) {
      console.error("❌ Error updating workflow:", error);
      loadingToast.error(
        '❌ Update Failed',
        error.message || 'Something went wrong. Please try again.'
      );
    }
  };

  // ✅ Delete workflow
  const handleDeleteWorkflow = async (id) => {
    const loadingToast = toast.loading('🗑️ Deleting Workflow...', 'Please wait');
    
    try {
      await firebaseDeleteWorkflow(id);
      await loadWorkflows();
      
      loadingToast.success(
        '✅ Workflow Deleted!',
        'The workflow has been removed successfully.'
      );
    } catch (error) {
      console.error("❌ Error deleting workflow:", error);
      loadingToast.error(
        '❌ Delete Failed',
        error.message || 'Something went wrong. Please try again.'
      );
    }
  };

  // Auth check
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

  // ===== ✅ HOOKS =====
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

  // ===== CONDITIONAL RETURNS =====
  if (checkingAuth) {
    return null;
  }

  if (loading) {
    return <div className="workflows-container">Loading workflows...</div>;
  }

  // ===== FUNCTIONS =====
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setActivePanel(null);
    navigate("/signin");
    toast.success('👋 Logged Out', 'You have been logged out successfully.');
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
    const label = key === "before" ? "Before Event" : "After Event";
    toast.info(`📂 ${collapsed[key] ? 'Expanded' : 'Collapsed'}`, `${label} section ${collapsed[key] ? 'expanded' : 'collapsed'}.`);
  };

  const applyFilter = (value) => {
    setActiveFilter(value);
    setFilterOpen(false);
    const filterLabels = {
      all: "All workflows",
      before: "Before Event/Meeting",
      after: "After Event/Meeting"
    };
    toast.info('🔍 Filter Applied', `Showing ${filterLabels[value] || 'All workflows'}.`);
  };

  // Get workflows based on active tab
  const getWorkflowsByTab = () => {
    if (activeTab === "my") {
      return workflows.filter(w => !w.isTemplate);
    } else {
      return workflows.filter(w => w.isTemplate);
    }
  };

  const filteredWorkflows = getWorkflowsByTab();

  // Filter by category
  const beforeEvents = filteredWorkflows.filter(
    (w) => w.category === "Before Event/Meeting"
  );
  const afterEvents = filteredWorkflows.filter(
    (w) => w.category === "After Event/Meeting"
  );

  // Search filter
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

  // Category filter
  const filteredBefore = activeFilter === "after" ? [] : searchedBefore;
  const filteredAfter = activeFilter === "before" ? [] : searchedAfter;

  // Show more logic
  const displayBefore = showAll ? filteredBefore : filteredBefore.slice(0, 2);
  const displayAfter = showAll ? filteredAfter : filteredAfter.slice(0, 3);

  const totalCount = filteredBefore.length + filteredAfter.length;
  const visibleCount = displayBefore.length + displayAfter.length;

  // Use workflow
  const handleUseWorkflow = (id) => {
    const workflow = workflows.find((w) => w.id === id);
    toast.success('⚡ Workflow Activated!', `"${workflow?.title}" has been activated successfully.`);
  };

  // Edit workflow
  const handleEditWorkflow = (id) => {
    const workflow = workflows.find((w) => w.id === id);
    if (workflow) {
      setEditingWorkflow(workflow);
      setShowCreateModal(true);
      toast.info('✏️ Editing', `Editing "${workflow.title}" workflow.`);
    }
  };

  // Delete workflow
  const handleDeleteWorkflowClick = (id) => {
    const workflow = workflows.find((w) => w.id === id);
    if (workflow) {
      if (window.confirm(`Are you sure you want to delete "${workflow.title}"?`)) {
        handleDeleteWorkflow(id);
      }
    }
  };

  // Add/Edit workflow
  const addWorkflow = (newWorkflow) => {
    if (editingWorkflow) {
      handleUpdateWorkflow(editingWorkflow.id, newWorkflow);
      setEditingWorkflow(null);
    } else {
      handleAddWorkflow(newWorkflow);
    }
    setShowCreateModal(false);
  };

  // Search results
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

  // Tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowAll(false);
    const tabLabels = {
      my: "My Workflows",
      templates: "Templates"
    };
    toast.info(`📋 ${tabLabels[tab]}`, `Switched to ${tabLabels[tab]}.`);
  };

  // Comments count
  const commentsCount = 0;

  return (
    <>
      {/* TOPBAR */}
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
          toast.info('🔍 Found', 'Showing workflow details.');
        }}
        commentsCount={commentsCount}
        currentUser={currentUser}
        onLogout={handleLogout}
        onProfileClick={handleProfileClick}
        onSettingsClick={handleSettingsClick}
      />

      {/* WORKFLOWS CONTAINER */}
      <div className="workflows-container">
        {/* TABS + FILTER */}
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

        {/* Empty State for My Workflow */}
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

        {/* Before Event/Meeting Section */}
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
                    isTemplate={workflow.isTemplate}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* After Event/Meeting Section */}
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
                    isTemplate={workflow.isTemplate}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Show More / Show Less */}
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

        {/* Empty State for Templates */}
        {activeTab === "templates" && filteredWorkflows.length === 0 && (
          <div className="workflows-empty">
            <p>No templates available</p>
          </div>
        )}
      </div>

      {/* Create/Edit Workflow Modal */}
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