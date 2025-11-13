import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { transformApiUserToProfile } from "@/utils/profileTransform";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  CalendarCheck,
  MapPin,
  Cake,
  Fingerprint,
  Key,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface AdminProfile {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  dob: string;
  nic: string;
  joined: string;
  lastLogin: string;
  avatar: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    // Use authenticated user data transformed to profile format
    if (user) {
      const transformedProfile = transformApiUserToProfile(user);
      if (mounted) {
        setProfile(transformedProfile);
      }
    }

    setLoading(false);

    return () => {
      mounted = false;
    };
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return;
    setProfile({ ...profile, [e.target.name]: e.target.value } as AdminProfile);
  };

  const handleSave = () => {
    if (!profile) return;
    // send to mock API and update local state
    fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    })
      .then((r) => r.json())
      .then((updated) => {
        setProfile(updated);
        // notify other parts of the app (DashboardLayout) about profile update
        try {
          window.dispatchEvent(
            new CustomEvent("profile-updated", { detail: updated })
          );
        } catch (e) {}
        setEditMode(false);
        toast.success("Profile updated");
      })
      .catch(() => {
        toast.error("Failed to update profile");
      });
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-12">
        {loading && (
          <div className="text-sm text-muted-foreground mb-4">
            Loading profile…
          </div>
        )}
        {!loading && !profile && (
          <div className="text-sm text-destructive mb-4">
            Failed to load profile.
          </div>
        )}
        {profile && (
          <Card className="shadow-xl border-none bg-gradient-to-br from-accent/10 to-background min-h-[320px]">
            <CardHeader className="flex flex-row md:items-center items-start gap-8 pb-6 border-b">
              <img
                src={profile.avatar}
                alt="Admin Avatar"
                className="w-24 h-24 rounded-full border-4 border-accent shadow-lg transition-transform hover:scale-105"
              />
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    {/* Employee ID is never editable */}
                    <div className="flex items-center gap-2 text-base font-semibold mb-1">
                      <Key className="w-5 h-5 text-accent" />
                      <span>Employee ID:</span>
                      <span className="ml-2 text-foreground">
                        {profile.employeeId}
                      </span>
                    </div>
                    {/* Full Name */}
                    <div className="flex items-center gap-2 text-base font-semibold mb-1">
                      <User className="w-5 h-5 text-accent" />
                      <span>Full Name:</span>
                      {editMode ? (
                        <>
                          <Input
                            name="firstName"
                            value={profile.firstName}
                            onChange={handleChange}
                            placeholder="First Name"
                            className="max-w-xs ml-2"
                            autoFocus
                          />
                          <Input
                            name="lastName"
                            value={profile.lastName}
                            onChange={handleChange}
                            placeholder="Last Name"
                            className="max-w-xs ml-2"
                          />
                        </>
                      ) : (
                        <span className="ml-2 text-foreground">
                          {profile.firstName} {profile.lastName}
                        </span>
                      )}
                    </div>
                    {/* Role as badge only */}
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="px-2 py-1 text-sm">
                        {profile.role}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-base font-medium">
                      <Mail className="w-5 h-5 text-accent" />
                      Email:
                      {editMode ? (
                        <Input
                          name="email"
                          value={profile.email}
                          onChange={handleChange}
                          className="max-w-xs ml-2"
                          placeholder="Email"
                        />
                      ) : (
                        <span className="ml-2 text-foreground">
                          {profile.email}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-base font-medium mt-1">
                      <Phone className="w-5 h-5 text-accent" />
                      Phone:
                      {editMode ? (
                        <Input
                          name="phone"
                          value={profile.phone}
                          onChange={handleChange}
                          className="max-w-xs ml-2"
                          placeholder="Phone"
                        />
                      ) : (
                        <span className="ml-2 text-foreground">
                          {profile.phone}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-base font-medium mt-1">
                      <MapPin className="w-5 h-5 text-accent" />
                      Address:
                      {editMode ? (
                        <Input
                          name="address"
                          value={profile.address}
                          onChange={handleChange}
                          className="max-w-xs ml-2"
                          placeholder="Address"
                        />
                      ) : (
                        <span className="ml-2 text-foreground">
                          {profile.address}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {!editMode && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-4"
                    onClick={() => setEditMode(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6 px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-2">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-base font-medium">
                      <Cake className="w-5 h-5 text-accent" />
                      Date of Birth:
                    </div>
                    {editMode ? (
                      <Input
                        name="dob"
                        value={profile.dob}
                        onChange={handleChange}
                        className="max-w-xs mt-1"
                        placeholder="Date of Birth"
                        type="date"
                      />
                    ) : (
                      <div className="pl-7 mt-1 text-foreground">
                        {profile.dob}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-base font-medium">
                      <Fingerprint className="w-5 h-5 text-accent" />
                      NIC:
                    </div>
                    {editMode ? (
                      <Input
                        name="nic"
                        value={profile.nic}
                        onChange={handleChange}
                        className="max-w-xs mt-1"
                        placeholder="NIC"
                      />
                    ) : (
                      <div className="pl-7 mt-1 text-foreground">
                        {profile.nic}
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-base font-medium">
                      <CalendarCheck className="w-5 h-5 text-accent" />
                      Joined:
                    </div>
                    <div className="pl-7 mt-1 text-foreground font-semibold">
                      {profile.joined}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-base font-medium">
                      <ShieldCheck className="w-5 h-5 text-accent" />
                      Last Login:
                    </div>
                    <div className="pl-7 mt-1">
                      <Badge variant="outline" className="px-3 py-1 text-sm">
                        {profile.lastLogin}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              {editMode && (
                <div className="flex gap-2 justify-end mt-4">
                  <Button size="sm" variant="secondary" onClick={handleSave}>
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;
