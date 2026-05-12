import type { User } from "@healthbridge/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { GoogleCalendarSettings } from "@/components/GoogleCalendarSettings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGoogleCallback } from "@/hooks/useGoogleCallback";
import { api } from "@/lib/api";

export default function Profile() {
  const { data: userData, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const data = await api
        .get("user/get-profile")
        .json<{ success: boolean; user: User }>();
      return data.user;
    },
  });

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [form, setForm] = useState<User | undefined>(userData);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (userData) setForm(userData);
  }, [userData]);

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: async () => {
      const data = new FormData();
      data.append("name", form!.name);
      data.append("phone", form!.phone ?? "");
      data.append("address", JSON.stringify(form!.address));
      data.append("gender", form!.gender ?? "Not Selected");
      data.append("dob", form!.dob ? String(form!.dob) : "");
      if (image) data.append("image", image);
      await api.post("user/update-profile", { body: data });
    },
    onSuccess: async () => {
      toast.success("Profile updated successfully");
      await refetch();
      setIsEdit(false);
      setImage(null);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  useGoogleCallback();

  if (!userData || !form) return null;
  return (
    <div className="max-w-2xl pt-5 space-y-6">
      <Card>
        <CardContent className="pt-6 flex items-center gap-6">
          {isEdit ? (
            <div className="flex flex-col items-center gap-2">
              <Label htmlFor="image" className="cursor-pointer">
                <Avatar className="size-24 border-primary border-2">
                  <AvatarImage
                    src={preview ?? userData.image ?? undefined}
                    alt={userData.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl">
                    {userData.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                id="image"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setImage(file);
                  if (file) setPreview(URL.createObjectURL(file));
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload
              </Button>
            </div>
          ) : (
            <Avatar className="size-24">
              <AvatarImage
                src={userData.image || undefined}
                alt={userData.name}
                className="object-cover"
              />
              <AvatarFallback className="text-2xl">
                {userData.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}

          <div className="flex-1">
            {isEdit ? (
              <Input
                className="text-2xl font-medium"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev!, name: e.target.value }))
                }
              />
            ) : (
              <p className="text-2xl font-semibold">{userData.name}</p>
            )}
            <p className="text-sm text-muted-foreground">{userData.email}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-[1fr_2fr] gap-y-4 text-sm">
          <p className="font-medium text-muted-foreground">Email</p>
          <p>{userData.email}</p>

          <p className="font-medium text-muted-foreground">Phone</p>
          {isEdit ? (
            <Input
              className="max-w-52"
              value={form.phone ?? ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev!, phone: e.target.value }))
              }
            />
          ) : (
            <p>{userData.phone ?? "Not set"}</p>
          )}

          <p className="font-medium text-muted-foreground">Address</p>
          {isEdit ? (
            <div className="grid gap-2">
              <Input
                value={form.address?.line1 ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev!,
                    address: { ...prev!.address, line1: e.target.value },
                  }))
                }
                placeholder="Address line 1"
              />
              <Input
                value={form.address?.line2 ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev!,
                    address: { ...prev!.address, line2: e.target.value },
                  }))
                }
                placeholder="Address line 2"
              />
            </div>
          ) : (
            <p>
              {userData.address?.line1}
              {userData.address?.line2 && (
                <>
                  <br />
                  {userData.address.line2}
                </>
              )}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-[1fr_2fr] gap-y-4 text-sm">
          <p className="font-medium text-muted-foreground">Gender</p>
          {isEdit ? (
            <Select
              value={form.gender ?? "Not Selected"}
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev!,
                  gender: value as User["gender"],
                }))
              }
            >
              <SelectTrigger className="w-45">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Selected">Not Selected</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <p>{userData.gender}</p>
          )}

          <p className="font-medium text-muted-foreground">Birthday</p>
          {isEdit ? (
            <Input
              className="max-w-45"
              type="date"
              value={
                form.dob ? new Date(form.dob).toISOString().split("T")[0] : ""
              }
              onChange={(e) =>
                setForm((prev) => ({ ...prev!, dob: new Date(e.target.value) }))
              }
            />
          ) : (
            <p>
              {userData.dob
                ? new Date(String(userData.dob)).toLocaleDateString()
                : "Not set"}
            </p>
          )}
        </CardContent>
      </Card>
      
      <GoogleCalendarSettings />

      <div className="flex gap-2">
        {isEdit ? (
          <>
            <Button onClick={() => updateProfile()} disabled={isPending}>
              {isPending ? "Saving..." : "Save information"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsEdit(false);
                setPreview(null);
                setImage(null);
              }}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button onClick={() => setIsEdit(true)}>Edit</Button>
        )}
      </div>
    </div>
  );
}
