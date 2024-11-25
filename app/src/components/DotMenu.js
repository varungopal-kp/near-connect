import React, { useState } from "react";

const DotsMenu = ({ action }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleEdit = (e) => {
    setIsOpen(false);
    action.edit(e);
  };

  const handleDelete = (e) => {
    setIsOpen(false);
    action.delete(e);
  };

  
  return (
    <div style={styles.container}>
      <button onClick={toggleMenu} style={styles.dotsButton}>
        &#x22EE; {/* Vertical ellipsis (three dots) */}
      </button>
      {isOpen && (
        <div style={styles.menu}>
          {action.edit && (
            <button style={styles.menuItem} onClick={handleEdit}>
              Edit
            </button>
          )}
          {action.delete && (
            <button style={styles.menuItem} onClick={handleDelete}>
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    display: "inline-block",
    float: "right",
  },
  dotsButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "22px",
  },
  menu: {
    position: "absolute",
    top: "30px",
    right: 0,
    backgroundColor: "#fff",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.15)",
    borderRadius: "5px",
    overflow: "hidden",
    zIndex: 1000,
  },
  menuItem: {
    display: "block",
    padding: "10px 20px",
    backgroundColor: "#fff",
    border: "none",
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "14px",
    color: "#333",
    borderBottom: "1px solid #ddd",
  },
};

export default DotsMenu;
