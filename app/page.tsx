"use client"
import { Moon, Sun } from "lucide-react"
import type React from "react"
import { motion } from "framer-motion"

import { Screen } from "@/components/screen"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function HomePage() {
  const [isDark, setIsDark] = useState(true)
  const [email, setEmail] = useState("")

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDark])

  const toggleDarkMode = () => {
    setIsDark(!isDark)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle email submission
    console.log("Email submitted:", email)
  }

  return (
    <div
      className="h-screen bg-gray-100 relative overflow-hidden"
      style={{ backgroundColor: isDark ? "#0D0E0E" : undefined }}
    >
      {/* Left corner decoration */}
      <div className="absolute left-0 top-0 w-[60px] h-full overflow-hidden sm:block hidden z-0">
        <div
          className="absolute dark:opacity-[0.15] opacity-[0.2] inset-0 w-[60px] h-full border border-dashed dark:border-[#eee] border-[#000]/70"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, transparent, transparent 2px, currentcolor 2px, currentcolor 3px, transparent 3px, transparent 6px)",
          }}
        ></div>
      </div>

      {/* Right corner decoration */}
      <div className="absolute right-0 top-0 w-[60px] h-full overflow-hidden sm:block hidden z-0">
        <div
          className="absolute dark:opacity-[0.15] opacity-[0.2] inset-0 w-[60px] h-full border border-dashed dark:border-[#eee] border-[#000]/70"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, transparent, transparent 2px, currentcolor 2px, currentcolor 3px, transparent 3px, transparent 6px)",
          }}
        ></div>
      </div>

      <Screen>
        <header
          className="flex h-16 items-center justify-between border-b border-dashed dark:border-gray-700 px-4 bg-white"
          style={{ backgroundColor: isDark ? "#0D0E0E" : undefined, color: isDark ? "white" : undefined }}
        >
          <a className="flex flex-row items-center gap-2" href="/">
            <svg width="32" height="32" viewBox="0 0 100 100">
              <path
                d="M20 15 C15 15, 10 20, 10 25 L10 35 C10 40, 15 45, 20 45 L25 45 L25 75 C25 80, 30 85, 35 85 L40 85 C45 85, 50 80, 50 75 L50 45 L55 45 C60 45, 65 40, 65 35 L65 25 C65 20, 60 15, 55 15 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-custom text-xl font-semibold">TempMail</span>
          </a>

          <div className="flex flex-row items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={isDark}
              onClick={toggleDarkMode}
              className={`peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none ${
                isDark ? "bg-gray-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`bg-white pointer-events-none flex size-4 items-center justify-between rounded-full text-black ring-0 transition-transform duration-300 ${
                  isDark ? "translate-x-4" : "translate-x-0"
                }`}
              >
                {isDark ? <Sun className="mx-auto size-2.5" /> : <Moon className="mx-auto size-2.5" />}
              </span>
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 bg-white" style={{ backgroundColor: isDark ? "#0D0E0E" : undefined }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center h-full">
            <motion.div
              className="text-center space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h1
                  className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
                  style={{ color: isDark ? "white" : "#111827" }}
                >
                  Join Our Product Launch Waitlist
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0 text-center">
                  Be first in line. Join the waitlist.
                </p>
              </motion.div>

              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row sm:relative gap-3 sm:gap-0">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-4 sm:pr-32 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <button
                      type="submit"
                      className="sm:absolute sm:right-2 sm:top-2 sm:bottom-2 bg-black dark:bg-white text-white dark:text-black px-6 py-4 sm:py-0 rounded-lg sm:rounded-md text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors w-full sm:w-auto"
                    >
                      Get Notified
                    </button>
                  </div>
                </form>

                <motion.div
                  className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div className="flex -space-x-2">
                    <Avatar className="w-8 h-8 border-2 border-white dark:border-gray-800">
                      <AvatarFallback className="bg-purple-500 text-white text-xs font-semibold">A</AvatarFallback>
                    </Avatar>
                    <Avatar className="w-8 h-8 border-2 border-white dark:border-gray-800">
                      <AvatarFallback className="bg-blue-500 text-white text-xs font-semibold">B</AvatarFallback>
                    </Avatar>
                    <Avatar className="w-8 h-8 border-2 border-white dark:border-gray-800">
                      <AvatarFallback className="bg-indigo-500 text-white text-xs font-semibold">C</AvatarFallback>
                    </Avatar>
                  </div>
                  <span>100+ people on the waitlist</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </main>

        <footer
          className="border-t border-dashed dark:border-gray-700 px-4 py-4 bg-white text-center"
          style={{ backgroundColor: isDark ? "#0D0E0E" : undefined, color: isDark ? "white" : undefined }}
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">Made with @v0</p>
        </footer>
      </Screen>
    </div>
  )
}
