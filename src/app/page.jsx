"use client";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import "@/app/style.css";
import styles from "@/app/style/eye.module.css";

const IMAGES = {
  normal: "/images/normal.png",
  exited: "/images/happy.png",
  scared: "/images/sad.png",
  close_eyes: "/images/not_looking.png",
};

export default function page() {
  const [image, setImage] = useState("exited");

  // Refs for both eyes and their pupils
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);
  const leftPupilRef = useRef(null);
  const rightPupilRef = useRef(null);

  function movePupil(eyeEl, pupilEl, mouseX, mouseY) {
    const eyeRect = eyeEl.getBoundingClientRect();
    const pupilRect = pupilEl.getBoundingClientRect();

    // Center of the eye in viewport coordinates
    const eyeCenterX = eyeRect.left + eyeRect.width / 2;
    const eyeCenterY = eyeRect.top + eyeRect.height / 2;

    // Max distance the pupil center can travel from the eye center
    const maxRadius = eyeRect.width / 2 - pupilRect.width / 2 - 5;

    // Angle from eye center toward mouse cursor
    const angle = Math.atan2(mouseY - eyeCenterY, mouseX - eyeCenterX);

    // Raw distance from eye center to mouse
    const rawDistance = Math.hypot(mouseX - eyeCenterX, mouseY - eyeCenterY);

    // Clamp: never exceed maxRadius
    const distance = Math.min(rawDistance, maxRadius);

    // Pupil offset from eye center
    const offsetX = Math.cos(angle) * distance;
    const offsetY = Math.sin(angle) * distance;

    // Position pupil: center it, then apply offset
    pupilEl.style.left = `calc(50% + ${offsetX}px - ${pupilRect.width / 2}px)`;
    pupilEl.style.top = `calc(50% + ${offsetY}px - ${pupilRect.height / 2}px)`;
  }

  const handleMouseMove = (e) => {
    // Eyes are not rendered when image is "not_looking", skip if refs are null
    if (!leftEyeRef.current || !rightEyeRef.current) return;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    movePupil(leftEyeRef.current, leftPupilRef.current, mouseX, mouseY);
    movePupil(rightEyeRef.current, rightPupilRef.current, mouseX, mouseY);
  };

  // Login
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const getMe = async () => {
      try {
        const response = await fetch("/api/me", {
          method: "GET",
        });

        if (!response.ok) {
          setCheckingAuth(false);
          return;
        }

        const data = await response.json();
        console.log(data);

        if (data.role === "manager") {
          router.replace("/dashboard");
        } else if (data.role === "shopkeeper") {
          router.replace("/shop");
        } else {
          setCheckingAuth(false);
        }
      } catch (err) {
        // Network error or fetch failure — still show the login form
        console.error("Auth check failed:", err);
        setCheckingAuth(false);
      }
    };
    getMe();
  }, [router]);

  //    login will NOT appear
  if (checkingAuth) {
    return null;
  }

  const handleLogin = async () => {
    console.log(username);
    console.log(password);

    setUsername("");
    setPassword("");

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      setImage("scared");

      alert("Please provide username and password");

      return;
    }

    const data = await response.json();
    console.log(data);

    if (data.role === "manager") {
      router.push("/dashboard");
    } else if (data.role === "shopkeeper") {
      router.push("/shop");
    }
  };

  return (
    <div onMouseMove={handleMouseMove} className="page">
      <div className="loginCard">
        {/* ── Character Section ── */}
        <div className="characterArea ">
          <div className="image">
            <Image
              src={IMAGES[image]}
              alt="character face"
              width={220}
              height={220}
              className="hero"
              style={{ width: "220px", height: "220px", objectFit: "contain" }}
            />

            {image === "close_eyes" ? null : (
              <>
                {/* Left eye */}
                <div
                  ref={leftEyeRef}
                  style={{ top: "55px", left: "73.5px" }}
                  className={styles.eye}
                >
                  <div
                    ref={leftPupilRef}
                    style={{ top: "50%", left: "50%" }}
                    className={styles.pupil}
                  />
                </div>

                {/* Right eye */}
                <div
                  ref={rightEyeRef}
                  style={{ top: "55px", left: "107.5px" }}
                  className={styles.eye}
                >
                  <div
                    ref={rightPupilRef}
                    style={{ top: "50%", left: "50%" }}
                    className={styles.pupil}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <Image
          className="portal"
          src="/images/portal.png"
          alt="portal"
          width={220}
          height={220}
        />

        {/* ── Form Section ── */}
        <div className="loginPage">
          <h1 className="loginTitle">Welcome Back!</h1>
          <p className="loginSubtitle">Sign in to continue</p>
          <div className="credentialsHint">
            <span className="credentialItem"><span className="credentialKey">username</span><span className="credentialVal">user</span></span>
            <span className="credentialItem"><span className="credentialKey">password</span><span className="credentialVal">password</span></span>
          </div>
          {/* Username */}
          <div className="fieldGroup">
            <label className="fieldLabel" htmlFor="username">
              Username
            </label>
            <div className="inputWrapper">
              {/* Person icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                id="username"
                className="loginInput"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setImage("normal");
                }}
              />
            </div>
          </div>
          {/* Password */}
          <div className="fieldGroup">
            <label className="fieldLabel" htmlFor="password">
              Password
            </label>
            <div className="inputWrapper">
              {/* Lock icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="password"
                className="loginInput"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setImage("close_eyes");
                }}
              />
            </div>
          </div>
          <div className="divider" />
          <button
            id="loginBtn"
            onClick={handleLogin}
            className={`loginButton${image === "scared" ? " danger" : ""}`}
            onMouseEnter={() => {
              if (image !== "scared") setImage("exited");
            }}
            onMouseLeave={() => {
              if (image !== "scared") setImage("normal");
            }}
          >
            Log In
          </button>
          {/* <p className="loginFooter">
            Don&apos;t have an account? <span>Sign up</span>
          </p> */}
        </div>
      </div>
    </div>
  );
}
