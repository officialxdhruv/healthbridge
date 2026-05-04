import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { assets } from "@/assets/assets_frontend/assets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";

export type UserProfile = {
  _id: string;
  name: string;
  email: string;
  image: string;
  phone: string | null;
  gender: "Male" | "Female" | "Other" | "Not Selected";
  dob: Date | null;
  address: {
    line1: string;
    line2?: string;
    city?: string;
    state?: string;
  };
};

export default function Profile() {
  const { data: userData, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const data = await api
        .get("user/get-profile")
        .json<{ success: boolean; user: UserProfile }>();
      return data.user;
    },
  });

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [form, setForm] = useState<UserProfile | undefined>(userData);

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

  if (!userData || !form) return null;

  return (
    <div className="max-w-lg flex flex-col gap-2 text-sm pt-5">
      {isEdit ? (
        <label htmlFor="image">
          <div className="inline-block relative cursor-pointer">
            <img
              className="w-36 rounded opacity-75"
              src={image ? URL.createObjectURL(image) : String(userData.image)}
              alt=""
            />
            <img
              className="w-10 absolute bottom-12 right-12"
              src={image ? "" : assets.upload_icon}
              alt=""
            />
          </div>
          <input
            onChange={(e) => {
              if (e.target.files) setImage(e.target.files[0] ?? null);
            }}
            type="file"
            id="image"
            hidden
          />
        </label>
      ) : (
        <img className="w-36 rounded" src={String(userData.image)} alt="" />
      )}

      {isEdit ? (
        <Input
          className="text-3xl font-medium max-w-60"
          type="text"
          onChange={(e) =>
            setForm((prev) => ({ ...prev!, name: e.target.value }))
          }
          value={form.name}
        />
      ) : (
        <p className="font-medium text-3xl mt-4">{userData.name}</p>
      )}

      <Separator />

      <div>
        <p className="underline mt-3">CONTACT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-muted-foreground">
          <p className="font-medium">Email id:</p>
          <p>{userData.email}</p>

          <p className="font-medium">Phone:</p>
          {isEdit ? (
            <Input
              className="max-w-52"
              type="text"
              onChange={(e) =>
                setForm((prev) => ({ ...prev!, phone: e.target.value }))
              }
              value={form.phone ?? ""}
            />
          ) : (
            <p>{userData.phone}</p>
          )}

          <p className="font-medium">Address:</p>
          {isEdit ? (
            <p className="grid gap-2">
              <Input
                type="text"
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev!,
                    address: { ...prev!.address, line1: e.target.value },
                  }))
                }
                value={form.address?.line1 ?? ""}
              />
              <Input
                type="text"
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev!,
                    address: { ...prev!.address, line2: e.target.value },
                  }))
                }
                value={form.address?.line2 ?? ""}
              />
            </p>
          ) : (
            <p>
              {userData.address?.line1} <br /> {userData.address?.line2}
            </p>
          )}
        </div>
      </div>

      <div>
        <p className="underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-muted-foreground">
          <p className="font-medium">Gender:</p>
          {isEdit ? (
            <Select
              value={form.gender ?? "Not Selected"} // gender select onValueChange
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev!,
                  gender: value as UserProfile["gender"],
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
              </SelectContent>
            </Select>
          ) : (
            <p>{userData.gender}</p>
          )}

          <p className="font-medium">Birthday:</p>
          {isEdit ? (
            <Input
              className="max-w-45"
              type="date"
              onChange={(e) =>
                setForm((prev) => ({ ...prev!, dob: new Date(e.target.value) }))
              }
              value={
                form.dob ? new Date(form.dob).toISOString().split("T")[0] : ""
              }
            />
          ) : (
            <p>
              {userData.dob
                ? new Date(String(userData.dob)).toLocaleDateString()
                : "Not set"}
            </p>
          )}
        </div>
      </div>

      <div className="mt-10">
        {isEdit ? (
          <Button onClick={() => updateProfile()} disabled={isPending}>
            {isPending ? "Saving..." : "Save information"}
          </Button>
        ) : (
          <Button onClick={() => setIsEdit(true)}>Edit</Button>
        )}
      </div>
    </div>
  );
}
