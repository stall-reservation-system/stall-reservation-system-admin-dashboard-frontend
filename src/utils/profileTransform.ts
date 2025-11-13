import { User } from "@/types/auth";

/**
 * Transforms API user response to AdminProfile format
 * Generates employee ID based on userId
 * Generates avatar from first letter of name if not available
 */
export function transformApiUserToProfile(user: User): any {
  // Generate employee ID from userId (e.g., userId 1 -> CMBF001, 2 -> CMBF002)
  const employeeId = `CMBF${String(user.userId).padStart(3, "0")}`;

  // Generate avatar from first letter of name if not available
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const initials = getInitials(user.name);
  const avatar = `https://ui-avatars.com/api/?name=${initials}&background=0D8ABC&color=fff`;

  // Split name into first and last name
  const nameParts = user.name.split(" ");
  const firstName = nameParts[0] || "N/A";
  const lastName = nameParts.slice(1).join(" ") || "N/A";

  return {
    employeeId,
    firstName,
    lastName,
    email: user.email || "N/A",
    phone: user.contactNumber || "N/A",
    address: "N/A", // Not provided by API
    role: user.role || "N/A",
    dob: "N/A", // Not provided by API
    nic: "N/A", // Not provided by API
    joined: user.createdAt
      ? new Date(user.createdAt).toLocaleDateString()
      : "N/A",
    lastLogin: new Date().toLocaleString(), // Current login time
    avatar,
    // Keep original user data for reference
    _userId: user.userId,
    _genres: user.genres || [],
  };
}
