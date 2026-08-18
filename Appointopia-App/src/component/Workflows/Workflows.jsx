// src/component/Workflows/Workflows.jsx

import { useState } from "react";
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

// Workflow Data
const workflowData = [
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

export default function Workflows() {
  const [workflows, setWorkflows] = useState(workflowData);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState("templates"); // "my" | "templates"
  const [collapsed, setCollapsed] = useState({ before: false, after: false });
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "before" | "after"

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

  // Category filter (from the Filter dropdown)
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

  const addWorkflow = (newWorkflow) => {
    setWorkflows([
      ...workflows,
      {
        ...newWorkflow,
        id: Date.now(),
      },
    ]);
  };

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
            <button
              className="workflows-icon-btn"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <FaSearch />
            </button>
            <button className="workflows-icon-btn">
              <FaRegBell />
              <span className="workflows-notification-dot"></span>
            </button>
            <button className="workflows-icon-btn">
              <FaRegCommentDots />
            </button>
            <div className="workflows-avatar-wrap">
              <FaUserCircle className="workflows-avatar-icon" />
              <FaChevronDown className="workflows-avatar-chevron" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div className="workflows-search-bar">
          <input
            type="text"
            placeholder="Search workflows..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>
      )}

      {/* WORKFLOWS CONTAINER */}
      <div className="workflows-container">
        {/* TABS + FILTER (inside the container) */}
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