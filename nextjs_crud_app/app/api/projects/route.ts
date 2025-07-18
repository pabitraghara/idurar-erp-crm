import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";

// GET /api/projects - List all projects with pagination
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const search = searchParams.get("search");

    // Build filter object
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    // Get projects and total count
    const [projects, total] = await Promise.all([
      Project.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Project.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        projects,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();

    // Validate required fields
    const { name, description, startDate } = body;
    if (!name || !description || !startDate) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: name, description, startDate",
        },
        { status: 400 }
      );
    }

    // Create new project
    const project = new Project({
      name,
      description,
      status: body.status || "planning",
      priority: body.priority || "medium",
      startDate: new Date(startDate),
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      budget: body.budget || undefined,
      team: body.team || [],
      tags: body.tags || [],
    });

    const savedProject = await project.save();

    return NextResponse.json(
      {
        success: true,
        data: savedProject,
        message: "Project created successfully",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating project:", error);

    // Handle validation errors
    if (error instanceof Error && error.name === "ValidationError") {
      const validationError = error as {
        errors: Record<string, { message: string }>;
      };
      const errorMessages = Object.values(validationError.errors).map(
        (err) => err.message
      );
      return NextResponse.json(
        { success: false, error: "Validation failed", details: errorMessages },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
