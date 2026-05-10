import type { Doctor } from "@healthbridge/types";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { useAppStore } from "@/state/useAppStore";

type DoctorProfile = Omit<Doctor, "slotsBooked">;

const formSchema = z.object({
  fees: z.number().positive("Fees must be a positive number"),
  about: z.string().min(1, "About section is required"),
  address: z.object({
    line1: z.string().min(1, "Address line 1 is required"),
    line2: z.string(),
  }),
  available: z.boolean(),
});

export default function DoctorProfile() {
  const [isEdit, setIsEdit] = useState(false);
  const {currencySymbol} = useAppStore();

  const { data: profileData, refetch } = useQuery({
    queryKey: ["doctor", "profile"],
    queryFn: async () => {
      const data = await api
        .get("doctor/profile")
        .json<{ success: boolean; doctor: DoctorProfile }>();
      return data.doctor;
    },
  });

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      await api.post("doctor/update-profile", { json: values });
    },
    onSuccess: async () => {
      toast.success("Profile updated successfully");
      await refetch();
      setIsEdit(false);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const form = useForm({
    defaultValues: {
      fees: profileData?.fees ?? 0,
      about: profileData?.about ?? "",
      address: {
        line1: profileData?.address.line1 ?? "",
        line2: profileData?.address.line2 ?? "",
      },
      available: profileData?.available ?? true,
    },
    onSubmit: async ({ value }) => {
      updateProfile(value);
    },
    validators: {
      onSubmit: formSchema,
    },
  });

  if (!profileData) return null;

  return (
    <div className="flex flex-col gap-4 m-5">
        <div className="md:w-60 h-69 shrink-0">
          <img
            className="w-full h-full rounded-2xl object-contain md:object-cover bg-primary dark:bg-primary-foreground"
            src={profileData.image}
            alt={profileData.name}
          />
        </div>


      <Card className="flex-1">
        <CardContent className="py-7 space-y-4">
          <p className="text-3xl font-medium">{profileData.name}</p>

          <div className="flex items-center gap-2">
            <p>
              {profileData.degree} - {profileData.speciality}
            </p>
            <Badge variant="outline">{profileData.experience}</Badge>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            {/* About */}
            <form.Field name="about">
              {(field) => {
                const { errors } = field.state.meta;
                return (
                  <div>
                    <p className="text-sm font-medium mb-1">About</p>
                    {isEdit ? (
                      <>
                        <Textarea
                          rows={8}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {errors.length > 0 && (
                          <span className="text-destructive text-sm">
                            {errors[0]?.message}
                          </span>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {profileData.about}
                      </p>
                    )}
                  </div>
                );
              }}
            </form.Field>

            {/* Fees */}
            <form.Field name="fees">
              {(field) => {
                const { errors } = field.state.meta;
                return (
                  <div className="flex items-center gap-2">
                    <p className="font-medium">Appointment fee:</p>
                    {isEdit ? (
                      <div>
                        <Input
                          type="number"
                          className="max-w-32"
                          value={field.state.value}
                          onChange={(e) =>
                            field.handleChange(Number(e.target.value))
                          }
                        />
                        {errors.length > 0 && (
                          <span className="text-destructive text-sm">
                            {errors[0]?.message}
                          </span>
                        )}
                      </div>
                    ) : (
                      <p>{currencySymbol}{profileData.fees}</p>
                    )}
                  </div>
                );
              }}
            </form.Field>

            {/* Address */}
            <div className="space-y-2">
              <p className="font-medium">Address</p>
              {isEdit ? (
                <>
                  <form.Field name="address.line1">
                    {(field) => {
                      const { errors } = field.state.meta;
                      return (
                        <div>
                          <Input
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Address line 1"
                          />
                          {errors.length > 0 && (
                            <span className="text-destructive text-sm">
                              {errors[0]?.message}
                            </span>
                          )}
                        </div>
                      );
                    }}
                  </form.Field>

                  <form.Field name="address.line2">
                    {(field) => (
                      <Input
                        value={field.state.value ?? ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Address line 2"
                      />
                    )}
                  </form.Field>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {profileData.address.line1}
                  <br />
                  {profileData.address.line2}
                </p>
              )}
            </div>

            {/* Available */}
            <form.Field name="available">
              {(field) => (
                <div className="flex items-center gap-2">
                  <Switch
                    checked={field.state.value}
                    onCheckedChange={(checked) =>
                      isEdit && field.handleChange(checked)
                    }
                    disabled={!isEdit}
                  />
                  <Label>Available</Label>
                </div>
              )}
            </form.Field>

            {isEdit && (
              <div className="flex gap-2">
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Save"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setIsEdit(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </form>
          {!isEdit && 
            <div className="space-y-4">
              {/* read-only display of about, fees, address, available */}
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEdit(true)}
              >
                Edit
              </Button>
            </div>
          }
        </CardContent>
      </Card>
    </div>
  );
}
