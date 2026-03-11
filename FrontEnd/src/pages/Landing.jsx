import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import registerImg from "../assets/register.png";
import dashboardImg from "../assets/dashboard.png";
import membershipImg from "../assets/membership.png";
import taskCreationImg from "../assets/taskcreation.png";
import taskPageImg from "../assets/taskpage.png";

const Landing = () => {
  const navigate = useNavigate();

  const walkthroughItems = [
    {
      title: "User Registration",
      description:
        "Secure onboarding with structured role definition. Owners and members are registered with controlled access layers.",
      image: registerImg,
    },
    {
      title: "Owner Dashboard",
      description:
        "Centralized command center where project owners create, monitor, and manage execution.",
      image: dashboardImg,
    },
    {
      title: "Membership Management",
      description:
        "Owners add or remove members with server-validated authorization rules.",
      image: membershipImg,
    },
    {
      title: "Task Creation",
      description:
        "Structured task assignment system with controlled state transitions.",
      image: taskCreationImg,
    },
    {
      title: "Task Execution View",
      description:
        "Members update only their assigned tasks. Every action is validated at API level.",
      image: taskPageImg,
    },
  ];

  return (
    <div className="w-full bg-white text-gray-900">
      {/* ================= HERO ================= */}
      <section className="relative px-6 py-28 max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
          Structured Team Execution.
          <span className="block text-blue-600 mt-2">Designed for Managers.</span>
        </h1>

        <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
          A workflow-driven project management platform where project owners
          create teams, assign tasks, and control execution — all secured
          through server-validated permissions and structured logic.
        </p>

        <div className="mt-10 flex justify-center gap-6 flex-wrap">
          <button
            onClick={() => navigate("/register")}
            className="px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-medium shadow-md hover:bg-blue-700 transition duration-200"
          >
            Get Started
          </button>

          <button
            onClick={() => navigate("/login")}
            className="px-8 py-4 border border-gray-300 rounded-xl text-lg font-medium hover:bg-red-600 hover:text-white transition duration-200"
          >
            Sign In
          </button>
        </div>
      </section>

      {/* ================= VALUE SECTION ================= */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold">
            Built for Structured Project Ownership
          </h2>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Project owners define structure. Members execute tasks. Every action
            is validated at the server layer to ensure controlled collaboration
            and consistent workflow transitions.
          </p>
        </div>
      </section>

      {/* ================= CORE FEATURES ================= */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 ">
          <div className="p-6 rounded-2xl border hover:shadow-md transition hover:bg-gray-400 ">
            <h3 className="text-2xl font-semibold">
              Owner-Controlled Projects
            </h3>
            <p className="mt-4 text-gray-600 text-lg hover:text-white">
              Owners create projects, manage members, and assign
              responsibilities with full structural control.
            </p>
          </div>

          <div className="p-6 rounded-2xl border hover:shadow-md transition hover:bg-gray-400">
            <h3 className="text-2xl font-semibold">Member Task Execution</h3>
            <p className="mt-4 text-gray-600 text-lg hover:text-white">
              Members update only their assigned tasks. Unauthorized
              modifications are prevented at the API level.
            </p>
          </div>

          <div className="p-6 rounded-2xl border hover:shadow-md transition hover:bg-gray-400">
            <h3 className="text-2xl font-semibold">Server-Enforced Workflow</h3>
            <p className="mt-4 text-gray-600 text-lg hover:text-white">
              Task state transitions follow predefined rules. Middleware
              validates permissions before data persistence.
            </p>
          </div>
        </div>
      </section>

      {/* ================= SCROLL WALKTHROUGH ================= */}
      <section className="py-32 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto space-y-32">
          {walkthroughItems.map((item, index) => (
            <motion.div
              key={index}
              className="grid md:grid-cols-2 gap-16 items-center min-h-[60vh]"
              initial={{ opacity: 0, y: 120 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: false, amount: 0.65 }}
            >
              {/* Left Text */}
              <div className={`${index % 2 !== 0 ? "md:order-2" : ""}`}>
                <h3 className="text-3xl font-bold">{item.title}</h3>
                <p className="mt-6 text-lg text-gray-600">{item.description}</p>
              </div>

              {/* Right Image */}
              <div
                className={`${index % 2 !== 0 ? "md:order-1" : ""} rounded-2xl overflow-hidden shadow-2xl border`}
              >
                <img src={item.image} alt={item.title} className="w-full" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold">How Collaboration Flows</h2>

          <div className="mt-16 grid md:grid-cols-4 gap-10 text-lg text-gray-700">
            <div>
              <div className="text-blue-600 font-bold flex justify-center text-xl mb-4"><p className="bg-blue-200 w-12 p-2 rounded-md">01</p></div>Owner
              registers and creates a project
            </div>
            <div>
              <div className="text-blue-600 font-bold flex justify-center text-xl mb-4"><p className="bg-blue-200 w-12 p-2 rounded-md">02</p></div>Owner
              adds members to the project
            </div>
            <div>
              <div className="text-blue-600 font-bold flex justify-center text-xl mb-4"><p className="bg-blue-200 w-12 p-2 rounded-md">03</p></div>Owner
              assigns tasks to members
            </div>
            <div>
              <div className="text-blue-600 font-bold flex justify-center text-xl mb-4"><p className="bg-blue-200 w-12 p-2 rounded-md">04</p></div>Members
              update progress  server validates each action
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="bg-blue-600 py-24 px-6 text-center text-white">
        <h2 className="text-4xl font-bold">
          Take Control of Your Project Workflow
        </h2>
        <p className="mt-6 text-xl text-blue-100">
          Create structured teams. Assign tasks. Enforce execution.
        </p>
        <button
          onClick={() => navigate("/register")}
          className="mt-10 px-8 py-4 bg-white text-blue-600 rounded-xl text-lg font-semibold shadow hover:bg-gray-100 transition duration-200"
        >
          Launch Application
        </button>
      </section>
    </div>
  );
};

export default Landing;
