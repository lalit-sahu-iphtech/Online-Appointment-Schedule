// src/component/Workflows/Workflows.jsx
import { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";

// ✅ DEFAULT WORKFLOWS (Templates)
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

  // ✅ Toggle panels
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

  // ✅ Load workflows from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('workflows');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // ✅ Merge templates with saved data
        const merged = DEFAULT_WORKFLOWS.map(template => {
          const existing = parsed.find(w => w.id === template.id && w.isTemplate);
          return existing || template;
        });
        const userWorkflows = parsed.filter(w => !w.isTemplate);
        setWorkflows([...merged, ...userWorkflows]);
      } catch (error) {
        console.error('Error loading workflows:', error);
        setWorkflows(DEFAULT_WORKFLOWS);
      }
    } else {
      localStorage.setItem('workflows', JSON.stringify(DEFAULT_WORKFLOWS));
      setWorkflows(DEFAULT_WORKFLOWS);
    }
    setLoading(false);
  }, []);

  // ✅ Save to localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('workflows', JSON.stringify(workflows));
      if (onWorkflowsChange) {
        onWorkflowsChange(workflows);
      }
    }
  }, [workflows, loading, onWorkflowsChange]);

  // ✅ Auth check
  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (!stored) {
      navigate("/signin");
      return;
    }
    try {
      setCurrentUser(JSON.parse(stored));
    } catch (error) {
      console.error("Invalid currentUser in storage:", error);
      localStorage.removeItem("currentUser");
      navigate("/signin");
      return;
    }
    setCheckingAuth(false);
  }, [navigate]);

  // ✅ Profile actions
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setActivePanel(null);
    navigate("/signin");
  };

  const handleProfileClick = () => {
    setActivePanel(null);
    navigate("/profile");
  };

  const handleSettingsClick = () => {
    setActivePanel(null);
    navigate("/settings");
  };

  if (checkingAuth) {
    return null;
  }

  const toggleCollapse = (key) =>
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  const applyFilter = (value) => {
    setActiveFilter(value);
    setFilterOpen(false);
  };

  // ✅ Get workflows based on active tab
  const getWorkflowsByTab = () => {
    if (activeTab === "my") {
      return workflows.filter(w => !w.isTemplate);
    } else {
      return workflows.filter(w => w.isTemplate);
    }
  };

  const filteredWorkflows = getWorkflowsByTab();

  // ✅ Filter by category
  const beforeEvents = filteredWorkflows.filter(
    (w) => w.category === "Before Event/Meeting"
  );
  const afterEvents = filteredWorkflows.filter(
    (w) => w.category === "After Event/Meeting"
  );

  // ✅ Search filter
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

  // ✅ Category filter
  const filteredBefore = activeFilter === "after" ? [] : searchedBefore;
  const filteredAfter = activeFilter === "before" ? [] : searchedAfter;

  // ✅ Show more logic
  const displayBefore = showAll ? filteredBefore : filteredBefore.slice(0, 2);
  const displayAfter = showAll ? filteredAfter : filteredAfter.slice(0, 3);

  const totalCount = filteredBefore.length + filteredAfter.length;
  const visibleCount = displayBefore.length + displayAfter.length;

  // ✅ Use workflow
  const handleUseWorkflow = (id) => {
    const workflow = workflows.find((w) => w.id === id);
    alert(`"${workflow?.title}" workflow activated!`);
  };

  // ✅ ✅ FIX: Edit workflow - Sabke liye allow
  const handleEditWorkflow = (id) => {
    const workflow = workflows.find((w) => w.id === id);
    if (workflow) {
      setEditingWorkflow(workflow);
      setShowCreateModal(true);
    }
  };

  // ✅ ✅ FIX: Delete workflow - Sabke liye allow
  const handleDeleteWorkflow = (id) => {
    const workflow = workflows.find((w) => w.id === id);
    if (workflow) {
      if (window.confirm(`Delete "${workflow.title}"?`)) {
        setWorkflows(prev => prev.filter(w => w.id !== id));
      }
    }
  };

  // ✅ Add/Edit workflow
  const addWorkflow = (newWorkflow) => {
    if (editingWorkflow) {
      // ✅ Edit mode
      setWorkflows(prev =>
        prev.map(w =>
          w.id === editingWorkflow.id
            ? { 
                ...newWorkflow, 
                id: editingWorkflow.id, 
                isTemplate: editingWorkflow.isTemplate || false 
              }
            : w
        )
      );
      setEditingWorkflow(null);
    } else {
      // ✅ Create mode
      setWorkflows([
        ...workflows,
        {
          ...newWorkflow,
          id: Date.now(),
          isTemplate: false,
          createdAt: new Date().toISOString(),
        },
      ]);
    }
    setShowCreateModal(false);
  };

  // ✅ Search results
  const getSearchResults = () => {
    if (!search.trim()) return [];
    return workflows.filter(
      (item) =>
        item.title.toLowerCase().includes(search.trim().toLowerCase()) ||
        item.description.toLowerCase().includes(search.trim().toLowerCase())
    );
  };

  const searchResults = getSearchResults();

  // ✅ Notifications
  const getNotifications = () => {
    return workflows.slice(0, 3).map((w) => ({
      id: w.id,
      title: w.title,
      category: w.category,
    }));
  };

  const notifications = getNotifications();
  const commentsCount = workflows.length > 0 ? workflows.length : 0;

  if (loading) {
    return <div className="workflows-container">Loading workflows...</div>;
  }

  return (
    <>
      {/* TOPBAR */}
      <div className="workflows-topbar">
        <h1>Workflows</h1>

        <div className="workflows-topbar-right">
          <button
            className="workflows-create-btn"
            onClick={() => {
              setEditingWorkflow(null);
              setShowCreateModal(true);
            }}
          >
            <span>+</span> Create
          </button>

          <div className="workflows-topbar-icons">
            {/* SEARCH */}
            <div className="workflows-icon-wrap">
              <button
                className="workflows-icon-btn"
                onClick={() => togglePanel("search")}
              >
                <FaSearch />
              </button>

              {activePanel === "search" && (
                <div className="workflows-icon-dropdown">
                  <h4>Search workflows</h4>
                  <div className="workflows-search-input-wrap">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search by workflow name"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  {search.trim() === "" && (
                    <div className="workflows-dropdown-empty">Type to search your workflows</div>
                  )}

                  {search.trim() !== "" && searchResults.length === 0 && (
                    <div className="workflows-dropdown-empty">No workflows found</div>
                  )}

                  {searchResults.length > 0 && (
                    <div className="workflows-search-result-list">
                      {searchResults.map((item) => (
                        <div
                          key={item.id}
                          className="workflows-search-result-item"
                          onClick={() => {
                            setActivePanel(null);
                            setSearch("");
                          }}
                        >
                          <span>{item.title}</span>
                          <span className="workflows-search-result-date">
                            {item.isTemplate ? "Template" : "My Workflow"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* NOTIFICATIONS */}
            <div className="workflows-icon-wrap">
              <button
                className="workflows-icon-btn"
                onClick={() => togglePanel("notifications")}
              >
                <FaRegBell />
                {notifications.length > 0 && (
                  <span className="workflows-icon-badge"></span>
                )}
              </button>

              {activePanel === "notifications" && (
                <div className="workflows-icon-dropdown">
                  <h4>Recent Workflows</h4>
                  {notifications.length === 0 ? (
                    <div className="workflows-dropdown-empty">No recent workflows</div>
                  ) : (
                    <div className="workflows-search-result-list">
                      {notifications.map((item) => (
                        <div
                          key={item.id}
                          className="workflows-search-result-item"
                          onClick={() => setActivePanel(null)}
                        >
                          <span>{item.title}</span>
                          <span className="workflows-search-result-date">
                            {item.category === "Before Event/Meeting" ? "Before" : "After"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* COMMENTS */}
            <div className="workflows-icon-wrap">
              <button
                className="workflows-icon-btn"
                onClick={() => togglePanel("comments")}
              >
                <FaRegCommentDots />
                {commentsCount > 0 && (
                  <span className="workflows-icon-badge"></span>
                )}
              </button>

              {activePanel === "comments" && (
                <div className="workflows-icon-dropdown">
                  <h4>Workflow Comments</h4>
                  <div className="workflows-dropdown-empty">
                    {commentsCount === 0 ? "No comments yet" : `${commentsCount} workflows available`}
                  </div>
                </div>
              )}
            </div>

            {/* PROFILE */}
            <div className="workflows-icon-wrap workflows-avatar-wrap" onClick={() => togglePanel("profile")}>
              <FaUserCircle className="workflows-avatar-icon" />
              <FaChevronDown className="workflows-avatar-chevron" />

              {activePanel === "profile" && (
                <div className="workflows-icon-dropdown workflows-profile-dropdown">
                  <div className="workflows-profile-dropdown-header">
                    <FaUserCircle className="workflows-profile-avatar" />
                    <div>
                      <h4>{currentUser?.email ? currentUser.email.split("@")[0] : "My Account"}</h4>
                      <span>{currentUser?.email || "Manage your profile"}</span>
                    </div>
                  </div>

                  <div className="workflows-profile-menu">
                    <button type="button" className="workflows-profile-menu-item" onClick={handleProfileClick}>
                      <FaUser /> Profile
                    </button>
                    <button type="button" className="workflows-profile-menu-item" onClick={handleSettingsClick}>
                      <FaCog /> Settings
                    </button>
                    <button type="button" className="workflows-profile-menu-item workflows-profile-menu-logout" onClick={handleLogout}>
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* WORKFLOWS CONTAINER */}
      <div className="workflows-container">
        {/* TABS + FILTER */}
        <div className="workflows-tabs-row">
          <div className="workflows-tabs">
            <button
              className={`workflows-tab ${activeTab === "my" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("my");
                setShowAll(false);
              }}
            >
              My workflow
              <span className="workflows-tab-count">
                {workflows.filter(w => !w.isTemplate).length}
              </span>
            </button>
            <button
              className={`workflows-tab ${activeTab === "templates" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("templates");
                setShowAll(false);
              }}
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

        {/* ✅ Empty State for My Workflow */}
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
                    onEdit={handleEditWorkflow}      // ✅ Sabko edit dena
                    onDelete={handleDeleteWorkflow}  // ✅ Sabko delete dena
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
                    onDelete={handleDeleteWorkflow}  
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
            <button onClick={() => setShowAll(true)}>Show more</button>
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