import { createMocks } from "node-mocks-http";
import { GET, POST } from "../../app/api/projects/route";
import {
  GET as getProject,
  PUT,
  DELETE,
} from "../../app/api/projects/[id]/route";
import Project from "../../models/Project";

// Mock the Project model
jest.mock("../../models/Project", () => ({
  find: jest.fn(),
  countDocuments: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  prototype: {
    save: jest.fn(),
  },
}));

// Mock connectToDatabase
jest.mock("../../lib/mongodb", () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve()),
}));

describe("/api/projects", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/projects", () => {
    it("should return paginated projects", async () => {
      const mockProjects = [
        {
          _id: "507f1f77bcf86cd799439011",
          name: "Test Project",
          description: "Test Description",
          status: "active",
          priority: "medium",
          startDate: new Date("2024-01-01"),
          team: ["John Doe"],
          tags: ["test"],
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-01"),
        },
      ];

      // Mock the find method chain
      const mockFind = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              lean: jest.fn().mockResolvedValue(mockProjects),
            }),
          }),
        }),
      });

      Project.find = mockFind;
      Project.countDocuments = jest.fn().mockResolvedValue(1);

      const { req } = createMocks({
        method: "GET",
        url: "/api/projects?page=1&limit=10",
      });

      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.projects).toHaveLength(1);
      expect(data.data.pagination.page).toBe(1);
      expect(data.data.pagination.total).toBe(1);
    });

    it("should handle search parameters", async () => {
      const mockFind = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              lean: jest.fn().mockResolvedValue([]),
            }),
          }),
        }),
      });

      Project.find = mockFind;
      Project.countDocuments = jest.fn().mockResolvedValue(0);

      const { req } = createMocks({
        method: "GET",
        url: "/api/projects?search=test&status=active&priority=high",
      });

      await GET(req);

      expect(mockFind).toHaveBeenCalledWith({
        status: "active",
        priority: "high",
        $or: [
          { name: { $regex: "test", $options: "i" } },
          { description: { $regex: "test", $options: "i" } },
        ],
      });
    });

    it("should handle database errors", async () => {
      Project.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              lean: jest.fn().mockRejectedValue(new Error("Database error")),
            }),
          }),
        }),
      });

      const { req } = createMocks({
        method: "GET",
        url: "/api/projects",
      });

      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Internal server error");
    });
  });

  describe("POST /api/projects", () => {
    it("should create a new project", async () => {
      const mockProject = {
        _id: "507f1f77bcf86cd799439011",
        name: "New Project",
        description: "New Description",
        status: "planning",
        priority: "medium",
        startDate: new Date("2024-01-01"),
        team: ["John Doe"],
        tags: ["new"],
        save: jest.fn().mockResolvedValue(true),
      };

      // Mock the Project constructor
      const ProjectConstructor = jest
        .fn()
        .mockImplementation(() => mockProject);
      ProjectConstructor.prototype.save = mockProject.save;

      const originalProject = Project;
      Project = ProjectConstructor as any;

      const { req } = createMocks({
        method: "POST",
        body: {
          name: "New Project",
          description: "New Description",
          startDate: "2024-01-01",
          team: ["John Doe"],
          tags: ["new"],
        },
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Project created successfully");
      expect(mockProject.save).toHaveBeenCalled();

      // Restore original Project
      Project = originalProject;
    });

    it("should validate required fields", async () => {
      const { req } = createMocks({
        method: "POST",
        body: {
          name: "Test",
          // Missing description and startDate
        },
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Missing required fields");
    });

    it("should handle validation errors", async () => {
      const mockProject = {
        save: jest.fn().mockRejectedValue({
          name: "ValidationError",
          errors: {
            name: { message: "Name is required" },
            description: { message: "Description is required" },
          },
        }),
      };

      const ProjectConstructor = jest
        .fn()
        .mockImplementation(() => mockProject);
      const originalProject = Project;
      Project = ProjectConstructor as any;

      const { req } = createMocks({
        method: "POST",
        body: {
          name: "Test",
          description: "Test desc",
          startDate: "2024-01-01",
        },
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Validation failed");
      expect(data.details).toContain("Name is required");

      // Restore original Project
      Project = originalProject;
    });
  });

  describe("GET /api/projects/[id]", () => {
    it("should return a single project", async () => {
      const mockProject = {
        _id: "507f1f77bcf86cd799439011",
        name: "Test Project",
        description: "Test Description",
        status: "active",
        priority: "medium",
        startDate: new Date("2024-01-01"),
        team: ["John Doe"],
        tags: ["test"],
      };

      Project.findById = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockProject),
      });

      const { req } = createMocks({
        method: "GET",
        url: "/api/projects/507f1f77bcf86cd799439011",
      });

      const response = await getProject(req, {
        params: { id: "507f1f77bcf86cd799439011" },
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe("Test Project");
    });

    it("should return 404 for non-existent project", async () => {
      Project.findById = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      const { req } = createMocks({
        method: "GET",
        url: "/api/projects/507f1f77bcf86cd799439011",
      });

      const response = await getProject(req, {
        params: { id: "507f1f77bcf86cd799439011" },
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Project not found");
    });

    it("should validate ObjectId format", async () => {
      const { req } = createMocks({
        method: "GET",
        url: "/api/projects/invalid-id",
      });

      const response = await getProject(req, {
        params: { id: "invalid-id" },
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Invalid project ID");
    });
  });

  describe("PUT /api/projects/[id]", () => {
    it("should update a project", async () => {
      const mockUpdatedProject = {
        _id: "507f1f77bcf86cd799439011",
        name: "Updated Project",
        description: "Updated Description",
        status: "completed",
        priority: "high",
        startDate: new Date("2024-01-01"),
        team: ["John Doe", "Jane Smith"],
        tags: ["updated"],
      };

      Project.findByIdAndUpdate = jest
        .fn()
        .mockResolvedValue(mockUpdatedProject);

      const { req } = createMocks({
        method: "PUT",
        body: {
          name: "Updated Project",
          description: "Updated Description",
          status: "completed",
          priority: "high",
          team: ["John Doe", "Jane Smith"],
          tags: ["updated"],
        },
      });

      const response = await PUT(req, {
        params: { id: "507f1f77bcf86cd799439011" },
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Project updated successfully");
      expect(data.data.name).toBe("Updated Project");
    });

    it("should return 404 for non-existent project", async () => {
      Project.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      const { req } = createMocks({
        method: "PUT",
        body: { name: "Updated Project" },
      });

      const response = await PUT(req, {
        params: { id: "507f1f77bcf86cd799439011" },
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Project not found");
    });
  });

  describe("DELETE /api/projects/[id]", () => {
    it("should delete a project", async () => {
      const mockDeletedProject = {
        _id: "507f1f77bcf86cd799439011",
        name: "Deleted Project",
      };

      Project.findByIdAndDelete = jest
        .fn()
        .mockResolvedValue(mockDeletedProject);

      const { req } = createMocks({
        method: "DELETE",
      });

      const response = await DELETE(req, {
        params: { id: "507f1f77bcf86cd799439011" },
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Project deleted successfully");
    });

    it("should return 404 for non-existent project", async () => {
      Project.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      const { req } = createMocks({
        method: "DELETE",
      });

      const response = await DELETE(req, {
        params: { id: "507f1f77bcf86cd799439011" },
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Project not found");
    });
  });
});
