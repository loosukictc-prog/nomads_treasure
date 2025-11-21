import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ApiTest() {
  const [results, setResults] = useState<string[]>([]);

  const testEndpoint = async (
    url: string,
    method: string = "GET",
    body?: any,
  ) => {
    const timestamp = new Date().toLocaleTimeString();
    try {
      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);
      const data = await response.json();

      setResults((prev) => [
        `[${timestamp}] ${method} ${url} → ${response.status}: ${JSON.stringify(data)}`,
        ...prev.slice(0, 9),
      ]);
    } catch (error) {
      setResults((prev) => [
        `[${timestamp}] ${method} ${url} → ERROR: ${error}`,
        ...prev.slice(0, 9),
      ]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border rounded-lg p-4 shadow-lg max-w-md z-50">
      <h3 className="font-bold mb-2">API Debug Tool</h3>
      <div className="space-y-2 mb-4">
        <Button
          size="sm"
          onClick={() => testEndpoint("/api/ping")}
          className="w-full"
        >
          Test Ping
        </Button>
        <Button
          size="sm"
          onClick={() => testEndpoint("/api/health")}
          className="w-full"
        >
          Test Health
        </Button>
        <Button
          size="sm"
          onClick={() =>
            testEndpoint("/api/login", "POST", {
              email: "admin@nomadtreasures.com",
              password: "admin123",
            })
          }
          className="w-full"
        >
          Test Login
        </Button>
        <Button
          size="sm"
          onClick={() => setResults([])}
          variant="outline"
          className="w-full"
        >
          Clear
        </Button>
      </div>

      <div className="text-xs space-y-1 max-h-48 overflow-y-auto">
        {results.map((result, i) => (
          <div
            key={i}
            className="font-mono text-xs break-all bg-gray-50 p-1 rounded"
          >
            {result}
          </div>
        ))}
      </div>
    </div>
  );
}
