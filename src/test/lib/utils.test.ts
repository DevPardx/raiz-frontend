import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn utility", () => {
  it("should merge class names correctly", () => {
    const result = cn("px-2 py-1", "px-4");
    expect(result).toBe("py-1 px-4");
  });

  it("should handle conditional classes", () => {
    const isActive = true;
    const result = cn("base-class", isActive && "active-class");
    expect(result).toBe("base-class active-class");
  });

  it("should handle false/null/undefined values", () => {
    const result = cn("base-class", false, null, undefined, "another-class");
    expect(result).toBe("base-class another-class");
  });

  it("should merge tailwind classes correctly", () => {
    const result = cn("text-sm text-gray-500", "text-lg");
    expect(result).toBe("text-gray-500 text-lg");
  });

  it("should handle empty input", () => {
    const result = cn();
    expect(result).toBe("");
  });

  it("should handle array of classes", () => {
    const result = cn(["class1", "class2"], "class3");
    expect(result).toBe("class1 class2 class3");
  });
});
