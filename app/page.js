"use client";

import { useState } from "react";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [plateNo, setPlateNo] = useState("");
  const [rewardMsg, setRewardMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  const handleRewardClick = () => {
    setPlateNo("");
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!plateNo.trim()) {
      alert("🚫 Plate number is required!");
      return;
    }

    setModalOpen(false);
    setLoading(true);
    setRewardMsg("");

    try {
      const res = await fetch("/api/reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_reward", plate_no: plateNo }),
      });

      const data = await res.json();

      if (!res.ok) {
        setRewardMsg(`⚠️ ${data.error || "Something went wrong."}`);
      } else {
        setRewardMsg(
          data.message ||
            (data.reward === 0
              ? "😢 Oops! You got 0 pani puri free. Better luck next time!"
              : `✨ Congratulations! You got ${data.reward} pani puri FREE! ✨`)
        );
        setRewardClaimed(true);
      }
    } catch (err) {
      setRewardMsg("⚠️ Network error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', sans-serif",
        backgroundColor: "#fff8e1",
        color: "#333",
        textAlign: "center",
      }}
    >

      {/* HERO BANNER */}
      <section className="hero-banner"></section>

      {/* HEADER */}
      <header
        style={{ 
          color: "white",
          padding: "30px 10px",
        }}
      >
       
      </header>

      {/* WELCOME */}
      <div style={{ margin: "5px 20px", fontSize: "1.5rem", color: "#e65100" }}>
        🥳 Craving something tangy? You’re in the right place! Let’s Chalo... pani puri kahte hai!
      </div>

      <div
        style={{
          backgroundColor: "#fff3e0",
          padding: "20px",
          margin: "20px",
          borderRadius: "10px",
          fontWeight: "bold",
          color: "#bf360c",
          fontSize: "1.3rem",
        }}
      >
        QR SCANNED SUCCESSFULLY!
      </div>

      <div
        style={{
          fontSize: "1.1rem",
          color: "#d84315",
          marginTop: "10px",
          fontWeight: 600,
        }}
      >
        👉 Click on "Reward" to get free pani puri!
      </div>

      {/* BUTTON */}
      <button
        onClick={handleRewardClick}
        disabled={loading || rewardClaimed}
        style={{
          background: "linear-gradient(45deg, #ff6f00, #ff8f00)",
          color: "white",
          border: "none",
          padding: "15px 30px",
          fontSize: "1.2rem",
          borderRadius: "30px",
          cursor: loading || rewardClaimed ? "not-allowed" : "pointer",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          marginTop: "10px",
        }}
      >
        {loading
          ? "⏳ Checking..."
          : rewardClaimed
          ? "🎉 Reward Claimed"
          : "🎉 Reward"}
      </button>

      {/* MESSAGE */}
      {rewardMsg && (
        <div
          style={{
            margin: "20px auto",
            padding: "20px",
            maxWidth: "80%",
            background: "linear-gradient(45deg, #ffe082, #ffca28)",
            color: "#4e342e",
            fontSize: "1.5rem",
            fontWeight: "bold",
            borderRadius: "15px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          }}
        >
          {rewardMsg}
        </div>
      )}

      {/* THANK YOU */}
      <div
        style={{
          backgroundColor: "#ffe0b2",
          padding: "20px",
          fontSize: "1.2rem",
          margin: "30px 20px",
          borderRadius: "8px",
          color: "#4e342e",
        }}
      >
        🙏 Thank you for visiting our page and scanning the QR! <br />
        Enjoy your pani puri and keep coming back for more!
      </div>

      {/* FOOTER */}
      <footer
        style={{
          backgroundColor: "#7c4dff",
          color: "white",
          padding: "15px",
          fontSize: "0.9rem",
        }}
      >
        © 2025 The Always Hungry. All rights reserved.
      </footer>

      {/* MODAL */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            zIndex: 1000,
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "15px",
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            <h2>Enter Your Plate Number</h2>
            <input
              type="text"
              value={plateNo}
              onChange={(e) => setPlateNo(e.target.value)}
              placeholder="e.g. DL8CAF1234"
              style={{
                fontSize: "1.2rem",
                padding: "10px",
                borderRadius: "10px",
                border: "2px solid #ccc",
                marginBottom: "15px",
                width: "80%",
              }}
            />
            <br />
            <button
              onClick={handleSubmit}
              style={{
                backgroundColor: "#ff9800",
                border: "none",
                color: "white",
                padding: "10px 20px",
                borderRadius: "20px",
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
