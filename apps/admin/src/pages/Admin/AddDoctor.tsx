import { useForm } from "@tanstack/react-form";
import { useRef, useState } from "react";
import { toast } from "sonner";
import z from "zod";
import uploadImg from "@/assets/upload_area.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  experience: z.string().min(1, "Experience is required"),
  fees: z.number().min(1, "Fees is required"),
  about: z.string().min(1, "About is required"),
  speciality: z.string().min(1, "Speciality is required"),
  degree: z.string().min(1, "Degree is required"),
  address1: z.string().min(1, "Address is required"),
  address2: z.string(),
});

const specialities = [
  "General physician",
  "Gynecologist",
  "Dermatologist",
  "Pediatricians",
  "Neurologist",
  "Gastroenterologist",
];

const experiences = Array.from(
  { length: 10 },
  (_, i) => `${i + 1} Year${i > 0 ? "s" : ""}`,
);

export default function AddDoctor() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [docImg, setDocImg] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      experience: "1 Year",
      fees: 0,
      about: "",
      speciality: "General physician",
      degree: "",
      address1: "",
      address2: "",
    },
    onSubmit: async ({ value }) => {
      if (!docImg) {
        toast.error("Please select an image");
        return;
      }

      const formData = new FormData();
      formData.append("image", docImg);
      formData.append("name", value.name);
      formData.append("email", value.email);
      formData.append("password", value.password);
      formData.append("experience", value.experience);
      formData.append("fees", String(value.fees));
      formData.append("about", value.about);
      formData.append("speciality", value.speciality);
      formData.append("degree", value.degree);
      formData.append(
        "address",
        JSON.stringify({ line1: value.address1, line2: value.address2 }),
      );
      console.log(formData);
      await api.post("admin/add-doctor", { body: formData });
      toast.success("Doctor added successfully");
      // form.reset();
      // setDocImg(null);
    },
    validators: {
      onSubmit: formSchema,
    },
  });

  return (
    <div className="m-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="h-full w-full"
      >
        {/* Image Upload */}
        <div className="flex flex-col items-center gap-4 w-fit">
          <input
            ref={fileInputRef}
            id="doc-img"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setDocImg(file);
                setPreview(URL.createObjectURL(file));
              }
            }}
            type="file"
            accept="image/*"
            alt="user-image"
            hidden
          />
          <Label htmlFor="doc-img" className="cursor-pointer w-fit">
            <img
              className="size-35 rounded-full object-contain bg-accent border-primary border-2"
              src={preview || uploadImg}
              alt="Upload doctor"
            />
          </Label>

          <Button
            variant={"ghost"}
            type="button"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 mt-4">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <form.Field name="name">
              {(field) => (
                <div className="flex flex-col gap-1">
                  <Label>Name</Label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Name"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <span className="text-destructive text-sm">
                      {field.state.meta.errors[0]?.message}
                    </span>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="email">
              {(field) => (
                <div className="flex flex-col gap-1">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Email"
                  />
                  {field.state.meta.errors[0] && (
                    <span className="text-destructive text-sm">
                      {field.state.meta.errors[0]?.message}
                    </span>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <div className="flex flex-col gap-1">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Password"
                  />
                  {field.state.meta.errors[0] && (
                    <span className="text-destructive text-sm">
                      {field.state.meta.errors[0]?.message}
                    </span>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="experience">
              {(field) => (
                <div className="flex flex-col gap-1">
                  <Label>Experience</Label>
                  <select
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="border rounded px-2 py-2"
                  >
                    {experiences.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </form.Field>

            <form.Field name="fees">
              {(field) => (
                <div className="flex flex-col gap-1">
                  <Label>Fees</Label>
                  <Input
                    type="number"
                    defaultValue={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    placeholder="Doctor fees"
                  />
                  {field.state.meta.errors[0] && (
                    <span className="text-destructive text-sm">
                      {field.state.meta.errors[0]?.message}
                    </span>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <form.Field name="speciality">
              {(field) => (
                <div className="flex flex-col gap-1">
                  <Label>Speciality</Label>
                  <Select
                    defaultValue={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {specialities.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>

            <form.Field name="degree">
              {(field) => (
                <div className="flex flex-col gap-1">
                  <Label>Degree</Label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Degree"
                  />
                  {field.state.meta.errors[0] && (
                    <span className="text-destructive text-sm">
                      {field.state.meta.errors[0]?.message}
                    </span>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="address1">
              {(field) => (
                <div className="flex flex-col gap-1">
                  <Label>Address</Label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Address line 1"
                  />
                  {field.state.meta.errors[0] && (
                    <span className="text-destructive text-sm">
                      {field.state.meta.errors[0]?.message}
                    </span>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="address2">
              {(field) => (
                <div className="flex flex-col gap-1">
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Address line 2"
                  />
                </div>
              )}
            </form.Field>
          </div>
        </div>

        <div>
          <p className="mt-4 mb-2">About Doctor</p>
          <form.Field name="about">
            {(field) => (
              <Textarea
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                rows={5}
                placeholder="Write about doctor"
              />
            )}
          </form.Field>
        </div>

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" disabled={isSubmitting} className="mt-4">
              {isSubmitting ? "Adding..." : "Add Doctor"}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}
