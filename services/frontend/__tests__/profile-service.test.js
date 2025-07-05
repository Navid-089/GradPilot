import {
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  getAcademicInfo,
  updateAcademicInfo,
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from "../lib/profile-service";

// ---- ✅ Global Mocks ----
global.fetch = jest.fn();
const mockToken = "mock-jwt-token";
const mockUser = {
  userId: "26",
  name: "Rapunzel",
  email: "rapunzel@gmail.com",
};

// ---- ✅ Setup before each test ----
beforeEach(() => {
  jest.clearAllMocks();

  global.localStorage = {
    getItem: jest
      .fn()
      .mockImplementation((key) => (key === "token" ? mockToken : null)),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
});

describe("Profile Service", () => {
  describe("getProfile", () => {
    it("should return mock profile data", async () => {
      const result = await getProfile();
      expect(result).toEqual({
        name: "John Doe",
        email: "john@example.com",
        gpa: 3.8,
        researchInterests: ["Machine Learning", "NLP"],
        testScores: {
          GRE: "320",
          IELTS: "7.5",
        },
        targetMajors: ["Computer Science", "AI"],
        targetCountries: ["USA", "Canada"],
        deadlineYear: 2026,
      });
    });
  });

  describe("updateProfile", () => {
    it("should update profile successfully", async () => {
      const updateData = {
        name: "Jane Doe",
        email: "jane@example.com",
        phone: "123-456-7890",
        bio: "Updated bio",
        gpa: 3.9,
      };

      const result = await updateProfile(updateData);

      expect(result).toEqual({
        message: "Profile updated successfully",
      });
    });

    it("should throw error when profile data is invalid", async () => {
      await expect(updateProfile({})).rejects.toThrow("GPA is required");
    });
  });
});
