"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface HealthStatus {
  service: string;
  status: "success" | "error" | "loading" | "idle";
  message: string;
  responseTime: number;
  timestamp: string;
}

const SERVICES = [
  { name: "Auth", path: "/health" },
  { name: "Profiles", path: "/health" },
  { name: "Challenges", path: "/health" },
  { name: "Companies", path: "/health" },
  { name: "Messages", path: "/health" },
  { name: "Subscriptions", path: "/health" },
  { name: "Feed", path: "/health" },
];

export default function HealthCheckPage() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState(
    typeof window !== "undefined"
      ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      : "http://localhost:3000",
  );

  const checkServiceHealth = async (serviceName: string, path: string) => {
    const startTime = Date.now();
    const serviceUrl = `${apiUrl}/${serviceName.toLowerCase()}${path}`;

    try {
      const response = await axios.get(serviceUrl, {
        timeout: 10000,
        validateStatus: () => true,
      });

      const responseTime = Date.now() - startTime;
      const status =
        response.status === 200 ? ("success" as const) : ("error" as const);

      return {
        service: serviceName,
        status,
        message: `Status ${response.status} - ${JSON.stringify(response.data).substring(0, 100)}`,
        responseTime,
        timestamp: new Date().toLocaleTimeString(),
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      return {
        service: serviceName,
        status: "error" as const,
        message: `Error: ${errorMessage}`,
        responseTime,
        timestamp: new Date().toLocaleTimeString(),
      };
    }
  };

  const runHealthChecks = async () => {
    setIsLoading(true);
    setHealthStatus(
      SERVICES.map((service) => ({
        service: service.name,
        status: "loading" as const,
        message: "Checking...",
        responseTime: 0,
        timestamp: new Date().toLocaleTimeString(),
      })),
    );

    try {
      const results = await Promise.all(
        SERVICES.map((service) =>
          checkServiceHealth(service.name, service.path),
        ),
      );

      setHealthStatus(results);
    } catch (error) {
      console.error("Error running health checks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runHealthChecks();
  }, [apiUrl]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 border-green-400 text-green-800";
      case "error":
        return "bg-red-100 border-red-400 text-red-800";
      case "loading":
        return "bg-yellow-100 border-yellow-400 text-yellow-800";
      default:
        return "bg-gray-100 border-gray-400 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return "✓";
      case "error":
        return "✗";
      case "loading":
        return "⏳";
      default:
        return "○";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Backend Health Check
          </h1>
          <p className="text-gray-600 mb-6">
            Verifica el estado de conexión de todos los servicios backend
          </p>

          {/* API URL Input */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Base URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="http://localhost:3000"
              />
              <button
                onClick={runHealthChecks}
                disabled={isLoading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors font-medium"
              >
                {isLoading ? "Checking..." : "Test Again"}
              </button>
            </div>
          </div>

          {/* Health Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {healthStatus.map((status) => (
              <div
                key={status.service}
                className={`border-l-4 rounded-lg p-4 ${getStatusColor(status.status)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold">
                      {getStatusIcon(status.status)}
                    </span>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {status.service} Service
                      </h3>
                      <p className="text-sm opacity-75">{status.message}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-current border-opacity-20 flex justify-between text-xs">
                  <span>
                    Response Time:{" "}
                    <strong>{status.responseTime.toLocaleString()}ms</strong>
                  </span>
                  <span>{status.timestamp}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          {healthStatus.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Summary
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="text-3xl font-bold text-green-600">
                    {healthStatus.filter((s) => s.status === "success").length}
                  </div>
                  <p className="text-sm text-green-700">Services OK</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="text-3xl font-bold text-red-600">
                    {healthStatus.filter((s) => s.status === "error").length}
                  </div>
                  <p className="text-sm text-red-700">Services Failed</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600">
                    {(
                      healthStatus
                        .filter((s) => s.status === "success")
                        .reduce((acc, s) => acc + s.responseTime, 0) /
                      (healthStatus.filter((s) => s.status === "success")
                        .length || 1)
                    ).toFixed(0)}
                    ms
                  </div>
                  <p className="text-sm text-blue-700">Avg Response Time</p>
                </div>
              </div>
            </div>
          )}

          {/* Debug Info */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <details className="cursor-pointer">
              <summary className="font-semibold text-gray-700 hover:text-gray-900">
                Debug Info
              </summary>
              <div className="mt-4 bg-gray-50 rounded p-4 overflow-auto max-h-64">
                <pre className="text-xs text-gray-700">
                  {JSON.stringify(
                    {
                      apiUrl,
                      timestamp: new Date().toISOString(),
                      healthStatus,
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
