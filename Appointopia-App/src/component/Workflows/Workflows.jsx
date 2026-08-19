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
} from "react-icons/fa";
import WorkflowCard from "./WorkflowCard";
import CreateWorkflowModal from "./CreateWorkflowModal";
import "./workflows.css";

// Default Workflow Data
const DEFAULT_WORKFLOWS = [
  {
    id: 1,
    category: "Before Event/Meeting",
    title: "Reminder Event Email",
    description:
      "Reminder emails prevent overlooking important events/tasks in both professional and personal settings.",
  },
  {
    id: 2,
    category: "Before Event/Meeting",
    title: "Cancellation Email",
    description:
      "A cancellation email is a communication sent to inform recipients that a previously scheduled event has been canceled.",
  },
  {
    id: 3,
    category: "After Event/Meeting",
    title: "Thank You Email",
    description:
      "Thank-you emails are a thoughtful way to acknowledge someone's actions and show that their efforts are valued and recognized.",
  },
  {
    id: 4,
    category: "After Event/Meeting",
    title: "Download eBook",
    description:
      "The presentations cover a wide range of topics discussed by our esteemed speakers, offering valuable insights.",
  },
  {
    id: 5,
    category: "After Event/Meeting",
    title: "Wrap-Up Report",
    description:
      "Wrap-Up Report that highlights the key takeaways, accomplishments, and insights from the event.",
  },
];

export default function Workflows({ onWorkflowsChange }) {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState("templates");
  const [collapsed, setCollapsed] = useState({ before: false, after: false });
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  
  // ✅ Dropdown states
  const [activePanel, setActivePanel] = useState(null); // 'search' | 'notifications' | 'comments' | 'profile'

  // ✅ Toggle panels
  const togglePanel = (panel) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  // ✅ Close panel on outside click
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

  // ✅ Load workflows from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('workflows');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setWorkflows(parsed);
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

  // ✅ Save to localStorage whenever workflows change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('workflows', JSON.stringify(workflows));
      if (onWorkflowsChange) {
        onWorkflowsChange(workflows);
      }
    }
  }, [workflows, loading, onWorkflowsChange]);

  const toggleCollapse = (key) =>
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  const applyFilter = (value) => {
    setActiveFilter(value);
    setFilterOpen(false);
  };

  // Filter by category
  const beforeEvents = workflows.filter(
    (w) => w.category === "Before Event/Meeting"
  );
  const afterEvents = workflows.filter(
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

  const handleUseWorkflow = (id) => {
    const workflow = workflows.find((w) => w.id === id);
    alert(`"${workflow?.title}" workflow activated!`);
  };

  // ✅ Add new workflow
  const addWorkflow = (newWorkflow) => {
    const updatedWorkflows = [
      ...workflows,
      {
        ...newWorkflow,
        id: Date.now(),
      },
    ];
    setWorkflows(updatedWorkflows);
    setShowCreateModal(false);
  };

  // ✅ Search results for dropdown
  const getSearchResults = () => {
    if (!search.trim()) return [];
    return workflows.filter(
      (item) =>
        item.title.toLowerCase().includes(search.trim().toLowerCase()) ||
        item.description.toLowerCase().includes(search.trim().toLowerCase())
    );
  };

  const searchResults = getSearchResults();

  // ✅ Upcoming notifications (workflow based)
  const getNotifications = () => {
    return workflows.slice(0, 3).map((w) => ({
      id: w.id,
      title: w.title,
      category: w.category,
    }));
  };

  const notifications = getNotifications();

  // ✅ Comments count
  const commentsCount = workflows.length > 0 ? workflows.length : 0;

  // Show loading state
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
            onClick={() => setShowCreateModal(true)}
          >
            <span>+</span> Create
          </button>

          <div className="workflows-topbar-icons">
            
            {/* 🔍 SEARCH */}
            <div className="workflows-icon-wrap">
              <button
                className="workflows-icon-btn"
                onClick={() => togglePanel("search")}
                aria-label="Search workflows"
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
                            {item.category === "Before Event/Meeting" ? "Before" : "After"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 🔔 NOTIFICATIONS */}
            <div className="workflows-icon-wrap">
              <button
                className="workflows-icon-btn"
                onClick={() => togglePanel("notifications")}
                aria-label="Notifications"
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
                          onClick={() => {
                            setActivePanel(null);
                          }}
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

            {/* 💬 COMMENTS */}
            <div className="workflows-icon-wrap">
              <button
                className="workflows-icon-btn"
                onClick={() => togglePanel("comments")}
                aria-label="Comments"
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

            {/* 👤 PROFILE */}
            <div className="workflows-icon-wrap workflows-avatar-wrap" onClick={() => togglePanel("profile")}>
              <FaUserCircle className="workflows-avatar-icon" />
              <FaChevronDown className="workflows-avatar-chevron" />

              {activePanel === "profile" && (
                <div className="workflows-icon-dropdown workflows-profile-dropdown">
                  <div className="workflows-profile-dropdown-header">
                    <FaUserCircle className="workflows-profile-avatar" />
                    <div>
                      <h4>My Account</h4>
                      <span>Manage your profile</span>
                    </div>
                  </div>

                  <div className="workflows-profile-menu">
                    <button type="button" className="workflows-profile-menu-item">
                      <FaUserCircle /> Profile
                    </button>
                    <button type="button" className="workflows-profile-menu-item">
                      <FaSearch /> Settings
                    </button>
                    <button type="button" className="workflows-profile-menu-item workflows-profile-menu-logout">
                      <FaUserCircle /> Logout
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
              onClick={() => setActiveTab("my")}
            >
              My workflow
            </button>
            <button
              className={`workflows-tab ${
                activeTab === "templates" ? "active" : ""
              }`}
              onClick={() => setActiveTab("templates")}
            >
              Templates
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
              <div
                className="workflows-filter-backdrop"
                onClick={() => setFilterOpen(false)}
              />
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

        {/* Before Event/Meeting Section */}
        {displayBefore.length > 0 && (
          <div className="workflows-section">
            <div className="workflows-section-header">
              <h2 className="workflows-section-title">Before Event/Meeting</h2>
              <button
                className={`workflows-section-collapse ${
                  collapsed.before ? "collapsed" : ""
                }`}
                onClick={() => toggleCollapse("before")}
                aria-label="Toggle section"
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
                className={`workflows-section-collapse ${
                  collapsed.after ? "collapsed" : ""
                }`}
                onClick={() => toggleCollapse("after")}
                aria-label="Toggle section"
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

        {/* Empty State */}
        {filteredBefore.length === 0 && filteredAfter.length === 0 && (
          <div className="workflows-empty">
            <p>No workflows found</p>
            <button
              className="workflows-create-btn"
              onClick={() => setShowCreateModal(true)}
            >
              <span>+</span> Create Workflow
            </button>
          </div>
        )}
      </div>

      {/* Create Workflow Modal */}
      {showCreateModal && (
        <CreateWorkflowModal
          onClose={() => setShowCreateModal(false)}
          onSave={addWorkflow}
        />
      )}
    </>
  );
}